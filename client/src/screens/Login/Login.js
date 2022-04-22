import React, { useContext, useEffect } from "react";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import "./Login.css";
import { app } from "../../config/firebase.config";
import { UserContext } from "../../Api/userContext";
import { useNavigate } from "react-router-dom";
import { MsgContext } from "../../Api/msgContext";

const Login = () => {
  const { validateUser } = useContext(UserContext);
  const { socket } = useContext(MsgContext);
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        navigate("/chat");
      }
    });
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) =>
      firebaseAuth.onAuthStateChanged((userCred) => {
        userCred.getIdToken().then((token) => {
          validateUser(token);
          socket.emit("new_user");
          navigate("/");
        });
      })
    );
  };

  return (
    <div className='login__container'>
      <div className='login__innerContainer'>
        <button onClick={loginWithGoogle} className='login__button lco'>
          login
        </button>
      </div>
    </div>
  );
};

export default Login;
