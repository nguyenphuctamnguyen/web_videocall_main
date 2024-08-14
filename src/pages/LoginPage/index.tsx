import React from "react";
import { images } from "../../assets/index.tsx";
import { APP_DEFINE } from "../../Contanst/index.tsx";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";


function LoginPage(): React.JSX.Element {
  //đăng nhập google
  const navigate = useNavigate()
  return (
    <div
      className="flex items-center justify-center w-screen h-screen"
      style={{ backgroundImage: `url(${images.loginBg})` }}
    >
      <div className="flex flex-col items-center justify-center px-5 py-10 mx-5 text-center bg-white shadow-2xl md:px-20 rounded-2xl w-fit">
        <strong className="text:sm md:text-md xl:text-4xl text-primary">
          Become an {APP_DEFINE.APP_NAME} member!
        </strong>
        <img
          alt="Logo"
          src={images.logo}
          className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] mt-10"
        />
        <p className="mt-5">
          Sign in to {APP_DEFINE.APP_NAME} and start connecting
        </p>
        {/* <Link to={"/Home"}> */}
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const token: string | null | undefined =
              credentialResponse.credential;
            if (token) {
              window.localStorage.setItem("token", token); //lưu data user 
              navigate("/Home")
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </div>
  );
}

export default LoginPage;
