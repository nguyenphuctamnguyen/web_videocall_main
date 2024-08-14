import {
  onValue,
  push,
  ref,
  set,
  remove,
  get,
  update,
} from "firebase/database";
import { jwtDecode } from "jwt-decode"; // Chỉnh sửa import jwtDecode
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { database } from "../../config/firebase.tsx";
import { useNavigate } from "react-router-dom";
import { images } from "../../assets/index.tsx";
interface TypeUser {
  email: string;
  name: string;
  avatar?: string;
  picture?: string;
}

interface TypeItemChat {
  id: string;
  message: string;
  user: TypeUser;
}

// Initialize WebRTC
const servers = {
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "4bfcdab7e31d9be7d6c38476",
      credential: "mvBYEq1SzqJq696y",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "4bfcdab7e31d9be7d6c38476",
      credential: "mvBYEq1SzqJq696y",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "4bfcdab7e31d9be7d6c38476",
      credential: "mvBYEq1SzqJq696y",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "4bfcdab7e31d9be7d6c38476",
      credential: "mvBYEq1SzqJq696y",
    },
],
  iceCandidatePoolSize: 10,
};

let pc = new RTCPeerConnection(servers);

function App() {
  return (
    <div className="app">
      <Videos />
    </div>
  );
}

function Videos({}) {
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [userInfo, setuserInfo] = useState<TypeUser | null | undefined>(null);
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [chatId, setchatId] = useState("");
  const [isCaller, setIsCaller] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(true); // New state for microphone
  const [cameraOn, setCameraOn] = useState<boolean>(true); // New state for camera
  const navigate = useNavigate();

  const handleDeleteCollection = async (id: string) => {
    try {
      await remove(ref(database, `calls/${id}`));
    } catch (error) {
      console.error("Error deleting collection: ", error);
    }
  };

  useEffect(() => {
    if (chatId) {
      const dataRef = ref(database, "chat" + "/" + chatId);
      onValue(dataRef, (snapshot) => {
        const _data: any = [];
        snapshot.forEach((child) => {
          const listFirebaseChat = child.val();
          _data.push({
            id: child.key,
            ...listFirebaseChat,
          });
        });
        setData(_data);
      });
    }
  }, [chatId]);

  useEffect(() => {
    if (roomId) {
      setchatId(roomId);
    }
    return () => {
      const room = window.localStorage.getItem("roomId");
      const dataRef = ref(database, "chat" + "/" + chatId);
      handleDeleteCollection(room || "");
      remove(dataRef);
    };
  }, [roomId]);

  useEffect(() => {
    setupSources();
    const token: string | null | undefined =
      window.localStorage.getItem("token");
    if (token) {
      const decoded: TypeUser = jwtDecode(token);
      const userProfile = {
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
      };
      setuserInfo(userProfile);
    }
  }, []);

  const localRef = useRef<any>();
  const remoteRef = useRef<any>();

  const setupSources = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);

    const callRef = ref(database, "calls");
    const newCallRef: any = push(callRef);

    setRoomId(newCallRef.key);
    setIsCaller(true); // Set isCaller to true for the user creating the room
    window.localStorage.setItem("roomId", newCallRef.key);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidateData = event.candidate.toJSON();
        set(
          push(ref(database, `calls/${newCallRef.key}/offerCandidates`)),
          candidateData
        );
      }
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await set(newCallRef, { offer });

    onValue(newCallRef, async (snapshot) => {
      const data = snapshot.val();
      if (data?.answer && pc.signalingState === "have-local-offer") {
        const answerDescription = new RTCSessionDescription(data.answer);
        try {
          await pc.setRemoteDescription(answerDescription);
        } catch (error) {
          console.error("Error setting remote description: ", error);
        }
      }
    });

    onValue(
      ref(database, `calls/${newCallRef.key}/answerCandidates`),
      (snapshot: any) => {
        snapshot.forEach(async (childSnapshot: any) => {
          if (childSnapshot.exists()) {
            try {
              const candidate = new RTCIceCandidate(childSnapshot.val());
              await pc.addIceCandidate(candidate);
            } catch (e) {
              console.error("Error adding received ice candidate", e);
            }
          }
        });
      }
    );

    pc.onconnectionstatechange = (event) => {
      console.log("Connection state change:", pc.connectionState);
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        hangUp();
      } else if (pc.connectionState === "connected") {
        console.log("Connected");
      }
    };

    pc.oniceconnectionstatechange = (event) => {
      console.log("ICE connection state change:", pc.iceConnectionState);
    };
  };

  async function onJoinRamdomRoom() {
    const roomsSnapshot = await get(ref(database, "calls"));
    const rooms = roomsSnapshot.val();
    const availableRooms = Object.keys(rooms).filter(
      (key) => !rooms[key].offer || (!rooms[key].answer && key !== roomId)
    );

    if (availableRooms.length === 0) {
      console.log("No available rooms to join.");
      return;
    }

    const randomRoomId =
      availableRooms[Math.floor(Math.random() * availableRooms.length)];
    setRoomId(randomRoomId);
    setchatId(randomRoomId);
    await joinRoomWithId(randomRoomId);
  }

  async function joinRoomWithId(roomId: any) {
    const callRef = ref(database, `calls/${roomId}`);
    const offerCandidatesRef = ref(database, `calls/${roomId}/offerCandidates`);
    const answerCandidatesRef = ref(
      database,
      `calls/${roomId}/answerCandidates`
    );

    setIsCaller(false); // Set isCaller to false for the user joining the room

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidateData = event.candidate.toJSON();
        set(push(answerCandidatesRef), candidateData);
      }
    };

    const callSnapshot = await get(callRef);
    const callData = callSnapshot.val();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
    console.log("Remote description set with offer:", offerDescription);

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);
    console.log("Local description set with answer:", answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await update(callRef, { answer });
    console.log("Answer updated in database");

    onValue(offerCandidatesRef, (snapshot: any) => {
      snapshot.forEach(async (childSnapshot: any) => {
        if (childSnapshot.exists()) {
          try {
            const candidate = new RTCIceCandidate(childSnapshot.val());
            await pc.addIceCandidate(candidate);
            console.log("Added offer candidate");
          } catch (e) {
            console.error("Error adding received offer ice candidate", e);
          }
        }
      });
    });

    pc.onconnectionstatechange = (event) => {
      console.log("Connection state change:", pc.connectionState);
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        console.log("Disconnected from the call");
      } else if (pc.connectionState === "connected") {
        console.log("Connected");
      }
    };

    pc.oniceconnectionstatechange = (event) => {
      console.log("ICE connection state change:", pc.iceConnectionState);
    };
  }

  const hangUp = async () => {
    pc.close();
    if (roomId) {
      const roomRef = ref(database, `calls/${roomId}`);
      await remove(roomRef);
    }
    window.location.reload();
  };

  //chat
  const handleAddItem = async () => {
    const dataRef = ref(database, "chat" + "/" + chatId);
    const token: string | null | undefined =
      window.localStorage.getItem("token");
    if (token) {
      const decoded: TypeUser = jwtDecode(token);
      const userProfile = {
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
      };
      const newItemRef = push(dataRef);
      set(newItemRef, {
        message: newItem,
        user: userProfile,
      });
      setNewItem("");
    }
  };

  const toggleMic = () => {
    const localStream = localRef.current.srcObject;
    localStream.getAudioTracks().forEach((track: any) => {
      track.enabled = !track.enabled;
    });
    setMicOn(!micOn);
    pc.getSenders().forEach((sender: any) => {
      if (sender.track?.kind === "audio") {
        sender.track.enabled = !sender.track.enabled;
      }
    });
  };

  const toggleCamera = () => {
    const localStream = localRef.current.srcObject;
    localStream.getVideoTracks().forEach((track: any) => {
      track.enabled = !track.enabled;
      localRef.current.srcObject = localStream;
    });
    setCameraOn(!cameraOn);
    pc.getSenders().forEach((sender: any) => {
      if (sender.track.kind === "video") {
        sender.track.enabled = !sender.track.enabled;
      }
    });
  };

  const renderChat = (item: TypeItemChat, index: number) => {
    return (
      <div key={index}>
        {userInfo?.email !== item.user.email ? (
          <div className="flex items-center mx-4 mt-3" key={index}>
            <img
              src={item.user?.avatar}
              className="w-[30px] h-[30px] rounded-full mr-2"
            />
            <div className="px-2 py-1 border rounded-md border-1">
              <p>{item.message}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end mx-4 mt-3" key={index}>
            <div className="px-2 py-1 mr-2 text-white bg-blue-500 border rounded-md">
              <p>{item.message}</p>
            </div>
            <img
              src={item.user?.avatar}
              className="w-[30px] h-[30px] rounded-full mr-2"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col flex-1 bg-black h-3/4 md:flex-row">
        <div className="relative w-full overflow-hidden bg-white h-3/4 md:h-full">
          <video
            ref={localRef}
            autoPlay
            playsInline
            className={`object-cover w-full h-full bg-black ${
              !cameraOn ? "hidden" : "block"
            }`}
            muted
          />
          <div className="h-[100px] w-full items-center flex bottom-3 justify-center absolute">
            <button
              onClick={toggleMic}
              className="w-[50px] h-[50px] bg-[rgba(255,255,255,0.3)] flex justify-center items-center rounded-full"
            >
              <img
                src={micOn ? images.voice : images.mic_off}
                className="w-[20px] h-[20px]"
              />
            </button>

            <button
              onClick={toggleCamera}
              className="w-[50px] h-[50px] bg-[rgba(255,255,255,0.3)] flex justify-center items-center rounded-full ml-10"
            >
              <img
                src={cameraOn ? images.video : images.cam_off}
                className="w-[20px] h-[20px]"
              />
            </button>
          </div>
          {!cameraOn && <div className="w-full h-full bg-black"></div>}
        </div>
        <div className="w-full overflow-hidden bg-white h-3/4 md:h-full">
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            className="object-cover w-full h-full bg-black"
          />
        </div>
      </div>

      <div className="flex h-1/4">
        <div className="w-1/2">
          <div className="flex flex-col items-center justify-center grid-flow-row gap-3 px-2 mt-5 md:flex-row">
            <button
              onClick={onJoinRamdomRoom}
              className="bg-primary md:w-[100px] h-[100px] rounded-lg justify-center items-center px-2 text-white w-full"
            >
              Join Random Room
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-red-500 md:w-[100px] h-[100px] rounded-lg justify-center items-center px-2 text-white w-full"
            >
              Stop
            </button>
          </div>
        </div>

        <div className="w-1/2 h-full bg-white shadow-2xl rounded-xl">
          <div className="flex flex-col flex-1 h-[100%] overflow-y-auto bg-white">
            {data.map(renderChat)}
          </div>

          <div className="flex items-center px-5 py-2 bg-blue-300">
            <input
              placeholder="Nhập..."
              className="flex w-full px-2 py-2 mr-2 rounded-md"
              onChange={(e) => setNewItem(e.target.value)}
              value={newItem}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buttonRef.current?.focus();
                }
              }}
            />

            <button onClick={handleAddItem} ref={buttonRef}>
              <AiOutlineSend className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 flex justify-center w-screen text-center bg-blue-400">
        <p>{roomId}</p>
      </div>
    </div>
  );
}

export default App;
