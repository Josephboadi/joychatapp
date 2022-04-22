import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { app } from "../config/firebase.config";
import { getAuth } from "firebase/auth";
export const UserContext = createContext();

const baseUrl = "http://localhost:4000/";

export const UserProvider = ({ children }) => {
  const firebaseAuth = getAuth(app);
  const [user, setUser] = useState(null);
  const [allUser, setAllUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const socket = io(baseUrl, {
    withCredentials: true,
    autoConnect: true,
  });

  const firebaseSignOut = async () => {
    const userId = {
      userId: user?.userId,
      newMessages: {},
    };

    firebaseAuth.signOut();

    window.localStorage.setItem("auth", "false");
    setUser(null);
    await axios.post(`${baseUrl}api/v1/user/logout`, userId);
  };

  const blockUser = async (data) => {
    const { userId, blockUserId } = data;
    await axios.post(`${baseUrl}api/v1/user/blockuser`, {
      userId,
      blockUserId,
    });
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        userCred.getIdToken().then((token) => {
          window.localStorage.setItem("auth", "true");
          validateUser(token);
        });
      } else {
        setUser(null);
        window.localStorage.setItem("auth", "false");
      }
    });
  }, []);

  const validateUser = async (token) => {
    const res = await axios.get(`${baseUrl}api/v1/user/login`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    window.localStorage.setItem("auth", "true");
    setUser(res?.data?.user);
    if (res?.data?.user?.userId) {
      const resUser = await axios.get(
        `${baseUrl}api/v1/user/users/res?.data?.user?.userId`
      );

      socket.emit("new_user", { userId: res?.data?.user?.userId });

      socket.off("new_user").on("new_user", (payload) => {
        const resUsers = payload?.filter(
          (item) => item?.userId !== res?.data?.user?.userId
        );

        let finalUser = resUsers.filter((neUser) => {
          return !user?.blockedUsers?.find((itemB) => {
            return neUser.userId === itemB;
          });
        });

        setAllUser(finalUser);
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        allUser,
        selectedUser,
        setSelectedUser,
        setAllUser,
        setUser,
        validateUser,
        firebaseSignOut,
        blockUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
