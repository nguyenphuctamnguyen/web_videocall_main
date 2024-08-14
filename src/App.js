import "./App.css";
import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import HomePage from "./pages/homePage/index.tsx";
import { Suspense } from "react";
import LoginPage from "./pages/LoginPage/index.tsx";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import("./pages/LoginPage/index.tsx"));
const Home = React.lazy(() => import("./pages/homePage/index.tsx"));

function App() {
  const loading = false;
  return (
    <GoogleOAuthProvider clientId="704785985806-afefndvt8k5crphv70hcie8n5lcdr4fj.apps.googleusercontent.com">
      {" "}
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/" name="Home Page" element={<Login />} />
            <Route exact path="/Home" name="Login Page" element={<Home />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
