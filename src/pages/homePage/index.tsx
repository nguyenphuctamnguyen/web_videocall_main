import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ref,
  set,
  onValue,
  push,
  update,
  remove,
  get,
} from "firebase/database";
import { database } from "../../config/firebase.tsx";
import "./home.css";
import { images } from "../../assets/index.tsx";
import { AiOutlineSend, AiFillMessage, AiOutlineMinus } from "react-icons/ai";
import { jwtDecode } from "jwt-decode"; // Chỉnh sửa import jwtDecode
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMicrophone,
  faCamera,
  faSlash,
} from "@fortawesome/free-solid-svg-icons";
// import NoiseVideo from '../../assets/video/noise.mp4'
const NoiseVideo = require("../../assets/video/noise.mp4");
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
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "56f5b4a5777cf1b38d6cc282",
      credential: "nYhktQ4rThQrQa6r",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "56f5b4a5777cf1b38d6cc282",
      credential: "nYhktQ4rThQrQa6r",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "56f5b4a5777cf1b38d6cc282",
      credential: "nYhktQ4rThQrQa6r",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "56f5b4a5777cf1b38d6cc282",
      credential: "nYhktQ4rThQrQa6r",
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc = new RTCPeerConnection(servers);

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [joinCode, setJoinCode] = useState("");
  const [chatId, setchatId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnload = async (event) => {
      let roomRef = ref(database, `calls/${joinCode}`);
      let roomRef1 = ref(database, `calls/${chatId}`);
      await remove(roomRef);
      await remove(roomRef1);
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    window.onbeforeunload = async () => {
      let roomRef = ref(database, `calls/${joinCode}`);
      await remove(roomRef);
    };
    const token: string | null | undefined =
      window.localStorage.getItem("token");
    if (token) {
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="app">
      {currentPage === "home" ? (
        <Menu
          joinCode={joinCode}
          setJoinCode={setJoinCode}
          setPage={setCurrentPage}
          setchatId={setchatId}
        />
      ) : (
        <Videos
          chatId={chatId}
          mode={currentPage}
          callId={joinCode}
          setPage={setCurrentPage}
          setchatId={setchatId}
          setJoinCode={setJoinCode}
        />
      )}
    </div>
  );
}

function Menu({ joinCode, setJoinCode, setPage, setchatId }) {
  async function onJoinRamdomRoom() {
    // lấy các phòng đang trống
    const roomsSnapshot = await get(ref(database, "calls"));
    const rooms = roomsSnapshot.val();
    if (rooms) {
      const availableRooms = Object.keys(rooms).filter(
        (key) => !rooms[key].offer || (!rooms[key].answer && key !== joinCode)
      );
      const randomRoomId =
        availableRooms[Math.floor(Math.random() * availableRooms.length)];
      setJoinCode(randomRoomId);
      setPage("join");
      setchatId(randomRoomId);

      // await joinRoomWithId(randomRoomId);
      if (availableRooms.length === 0) {
        alert("No available rooms to join.");
        return;
      }
    } else {
      alert("No available rooms to join.");
      return;
    }
  }
  const [userInfo, setuserInfo] = useState<TypeUser | null | undefined>(null);
  const navigate = useNavigate();
  useEffect(() => {
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
    } else {
    }
  }, []);

  return (
    <div className="relative flex">
      <div className="relative flex flex-col items-center justify-center w-screen h-screen">
        <div className="flex flex-col justify-center mt-40 mb-20 md:mt-20">
          <p className="text-[#C9E165] font-bold text-xl">
            Xin chào {userInfo?.name}
          </p>
          <button
            onClick={() => {
              window.localStorage.setItem("token", "");
              navigate("/");
            }}
            className="text-red-500"
          >
            Đăng xuất
          </button>
        </div>
        <div className="flex flex-col items-center justify-center md:flex-row">
          <button
            className="bg-orange-500 w-[300px] h-[300px] rounded-xl text-white text-xl active:scale-95"
            onClick={() => setPage("create")}
          >
            CREATE ROOM
          </button>
          <button
            className="bg-red-500 w-[300px] h-[300px] mt-5 md:mt-0 md:ml-5 rounded-xl text-white text-xl active:scale-95"
            onClick={onJoinRamdomRoom}
          >
            JOIN RANDOM ROOM
          </button>
        </div>
      </div>
      <div className="absolute top-0 left-[50px]">
        <img
          src={images.top_logo}
          className="w-[100px] h-[100px] md:w-[200px] md:h-[200px]"
        />
      </div>
    </div>
  );
}

function Videos({ mode, callId, setPage, chatId, setchatId, setJoinCode }) {
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(callId);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [data, setData] = useState([]);
  const [userInfo, setuserInfo] = useState<TypeUser | null | undefined>(null);
  const [newItem, setNewItem] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const localRef = useRef<any>();
  const remoteRef = useRef<any>();
  const [remoteStreamActive, setRemoteStreamActive] = useState<boolean>(true); // Thêm trạng thái kiểm tra remote stream
  const [countChat, setCountChat] = useState<number>(0);
  const [isShowChat, setIsShowChat] = useState(false);

  const chatEndRef = useRef();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
          const cout = countChat + 1;
          setCountChat(cout);
        });

        setData(_data);
        setTimeout(() => {
          scrollToBottom();
        }, 200);
      });
    }
  }, [chatId]);

  useEffect(() => {
    setCountChat(0);
  }, [isShowChat]);

  useEffect(() => {
    window.onbeforeunload = async () => {
      hangUp();
    };
    setTimeout(() => {
      setRemoteStreamActive(false);
    }, 1000);
  }, []);

  useEffect(() => {
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
    } else {
    }
  }, []);

  const setupSources = async () => {
    pc = new RTCPeerConnection(servers);

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
      if (remoteStream.getTracks().length > 0) {
        setRemoteStreamActive(true); // Cập nhật trạng thái khi có remote stream
      }
    };

    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);
    if (mode === "create") {
      const id = Date.now();
      setchatId(id);
      const callDoc = ref(database, `calls/${id}`);
      const offerCandidates = ref(
        database,
        `calls/${callDoc.key}/offerCandidates`
      );
      const answerCandidates = ref(
        database,
        `calls/${callDoc.key}/answerCandidates`
      );

      setRoomId(callDoc.key);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          push(offerCandidates, event.candidate.toJSON());
        }
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
        email: userInfo?.email,
      };

      await set(callDoc, { offer });

      onValue(callDoc, (snapshot) => {
        const data = snapshot.val();
        if (data?.answer && !pc.currentRemoteDescription) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      onValue(answerCandidates, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const candidate = new RTCIceCandidate(childSnapshot.val());
          pc.addIceCandidate(candidate);
        });
      });
    } else if (mode === "join") {
      setCountChat(0)
      const callDoc = ref(database, `calls/${callId}`);
      const answerCandidates = ref(
        database,
        `calls/${callId}/answerCandidates`
      );
      const offerCandidates = ref(database, `calls/${callId}/offerCandidates`);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          push(answerCandidates, event.candidate.toJSON());
        }
      };

      const callSnapshot = await get(callDoc);
      const callData = callSnapshot.val();

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
        email: userInfo?.email,
      };

      await update(callDoc, { answer });

      onValue(offerCandidates, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const candidate = new RTCIceCandidate(childSnapshot.val());
          pc.addIceCandidate(candidate);
        });
      });
    }
    setCameraOn(true);
    setMicOn(true);
    localStream.getVideoTracks().forEach((track: any) => {
      track.enabled = true;
    });
    localStream.getAudioTracks().forEach((track: any) => {
      track.enabled = true;
    });

    remoteStream.getVideoTracks().forEach((track: any) => {
      track.enabled = true;
    });
    remoteStream.getAudioTracks().forEach((track: any) => {
      track.enabled = true;
    });
    pc.onconnectionstatechange = async (event) => {
      if (pc.connectionState === "connected") {
        const chatDoc = ref(database, `chat/${chatId}`);
        await set(chatDoc, {});
      }
      if (pc.connectionState === "disconnected") {
        let roomRef = ref(database, `calls/${roomId}`);
        const roomSnapshot = await get(roomRef);
        const roomData = roomSnapshot.val();
        const id = Object.keys(roomData)[0];

        if (!roomData[id].offer) {
          alert("The owner has escaped. The room will be deleted");
          hangUp();
        } else {
          alert("The user has exited the conversation");
          setCameraOn(true);
          setMicOn(true);
          localStream.getVideoTracks().forEach((track: any) => {
            track.enabled = true;
          });
          localStream.getAudioTracks().forEach((track: any) => {
            track.enabled = true;
          });
          remoteStream.getVideoTracks().forEach((track: any) => {
            track.enabled = true;
          });
          remoteStream.getAudioTracks().forEach((track: any) => {
            track.enabled = true;
          });
          setRemoteStreamActive(false);
          await remove(roomRef);
          setupSources();
        }
      }
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        // hangUp();
      }
    };
  };

  const hangUp = async () => {
    localStorage.removeItem("micOn");
    localStorage.removeItem("cameraOn");
    pc.close();
    pc = new RTCPeerConnection(servers); // Re-initialize PeerConnection

    if (roomId) {
      let roomRef = ref(database, `calls/${roomId}`);
      // Xóa các answer candidates và answer

      const roomSnapshot = await get(roomRef);
      const roomData = roomSnapshot.val();
      let numberOfUsers = 0;
      // Check if offer exists
      if (roomData.offer) {
        numberOfUsers += 1;
      }

      // Check if answer exists
      if (roomData.answer) {
        numberOfUsers += 1;
      }
      // If there are two users in the room
      if (numberOfUsers === 2) {
        if (pc.signalingState !== "closed") {
          pc.close();
        }
        // Determine if the current user is the offerer or the answerer
        const token: any = window.localStorage.getItem("token");
        const decoded: any = jwtDecode(token);

        if (decoded.email === roomData.offer.email) {
          // Current user is the offerer, remove their offer
          const offerRef = ref(database, `calls/${roomId}/offer`);
          const offerCandidatesRef = ref(
            database,
            `calls/${roomId}/offerCandidates`
          );
          await remove(offerRef);
          await remove(offerCandidatesRef);
        } else if (decoded.email === roomData.answer.email) {
          // Current user is the answerer, remove their answer
          const answerRef = ref(database, `calls/${roomId}/answer`);
          const answerCandidatesRef = ref(
            database,
            `calls/${roomId}/answerCandidates`
          );
          await remove(answerRef);
          await remove(answerCandidatesRef);
        }
      } else if (numberOfUsers === 1) {
        // If only one user in the room, remove the room entirely
        await remove(roomRef);
      }
      setPage("home");
      setJoinCode("");
      setchatId("");
      // await remove(roomRef);
    }
    pc = new RTCPeerConnection(servers);

    // window.location.reload();
  };

  const toggleMic = () => {
    const localStream = localRef.current?.srcObject as MediaStream;
    localStream.getAudioTracks().forEach((track: any) => {
      track.enabled = !track.enabled;
    });
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    const localStream = localRef.current?.srcObject as MediaStream;
    localStream.getVideoTracks().forEach((track: any) => {
      track.enabled = !track.enabled;
    });
    setCameraOn(!cameraOn);
  };

  useEffect(() => {
    // Lưu trạng thái vào localStorage khi chúng thay đổi
    localStorage.setItem("micOn", JSON.stringify(micOn));
    localStorage.setItem("cameraOn", JSON.stringify(cameraOn));
  }, [micOn, cameraOn]);

  //chat
  const handleAddItem = async () => {
    if (newItem) {
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
    }
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
            <div className="px-2 py-1 text-white border rounded-md border-1">
              <p>{item.message}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end mx-4 mt-3" key={index}>
            <div className="px-2 py-1 mr-2 text-white bg-[#C9E165] border rounded-md">
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

  const toggleChatBox = () => {
    setIsShowChat(!isShowChat);
  };

  const renderCountChat = useCallback(() => {
    return (
      <div className="bg-red-500 w-[30px] h-[30px] right-0 top-0 absolute flex justify-center items-center text-white font-semibold rounded-full">
        {/* {countChat} */}
      </div>
    );
  }, [countChat]);

  return (
    <div className="videos">
      <video
        ref={localRef}
        autoPlay
        playsInline
        className="absolute top-[5px] md:top-[40px] right-[5px] md:right-[40px] w-[150px] md:w-[280px] h-[150px] md:h-[210px] rounded-md z-10"
        muted
      />

      <video
        ref={remoteRef}
        autoPlay
        playsInline
        className={`absolute top-0 bottom-0 left-0 right-0 w-screen h-screen bg-black ${
          remoteStreamActive ? "flex" : "hidden"
        }`}
      />
      <video
        src={NoiseVideo}
        loop
        autoPlay
        playsInline
        controls={false}
        className={`object-fill w-screen h-screen ${
          !remoteStreamActive ? "flex" : "hidden"
        }`}
      ></video>

      <div className="absolute flex justify-center w-screen bottom-10">
        <button
          onClick={toggleMic}
          className="w-[60px] h-[60px] bg-[rgba(255,255,255,0.6)] flex justify-center items-center rounded-full "
        >
          <FontAwesomeIcon size={"xl"} icon={faMicrophone} />
          {!micOn && (
            <div className="absolute">
              <FontAwesomeIcon icon={faSlash} color="black" size="2x" />
            </div>
          )}
        </button>

        <button
          onClick={toggleCamera}
          className="w-[60px] h-[60px] bg-[rgba(255,255,255,0.6)] flex justify-center items-center rounded-full ml-10"
        >
          <FontAwesomeIcon size={"xl"} icon={faCamera} />
          {!cameraOn && (
            <div className="absolute">
              <FontAwesomeIcon icon={faSlash} color="black" size="2x" />
            </div>
          )}
        </button>

        <button
          onClick={hangUp}
          disabled={!webcamActive}
          className="bg-red-500 rounded-full w-[60px] h-[60px] justify-center items-center flex ml-10"
        >
          <FontAwesomeIcon size={"xl"} icon={faPhone} />
        </button>
      </div>

      {!isShowChat && (
        <button
          onClick={toggleChatBox}
          className="absolute bottom-[50%] left-[20px] w-[80px] h-[80px] bg-[rgba(255,255,255,0.5)] shadow-2xl rounded-full flex justify-center items-center"
        >
          <AiFillMessage size={60} color="rgba(0,0,0,0.5)" />
          {countChat > 0 && renderCountChat()}
        </button>
      )}

      {isShowChat && (
        <div className="absolute bottom-0 left-0 w-[300px] h-[400px] bg-[rgba(255,255,255,0.5)] shadow-2xl rounded-xl  md:flex">
          <div className="flex flex-col flex-1 overflow-y-auto bg-[rgba(0,0,0,0.5)] mt-[0px] h-[85%]">
            {data.map(renderChat)}
            <div ref={chatEndRef} />
          </div>
          <div className="absolute bottom-0 flex items-center w-full px-5 py-2 bg-[#C9E165]">
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
          <button
            onClick={toggleChatBox}
            className="absolute top-0 right-0 bg-[rgba(0,0,0,0.5)] w-[30px] h-[30px] flex justify-center items-center"
          >
            <AiOutlineMinus color="white" />
          </button>
        </div>
      )}

      {!webcamActive && (
        <div className="absolute top-0 bottom-0 left-0 right-0 w-screen h-screen bg-[rgba(0,0,0,0.6)]">
          <div className="absolute top-[50%] left-[50%] rounded-[10px] p-[30px] bg-white text-blue-500 translate-x-[-50%] translate-y-[-50%] text-xl">
            <h3>Turn on your camera and microphone and start the call</h3>
            <div className="flex mt-[40px] justify-end">
              <button
                onClick={() => setPage("home")}
                className="mr-[20px] bg-red-500 text-white px-8 py-4 rounded-md active:scale-95"
              >
                Cancel
              </button>
              <button
                className="mr-[20px] bg-blue-500 text-white px-8 py-4 rounded-md active:scale-95"
                onClick={setupSources}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
