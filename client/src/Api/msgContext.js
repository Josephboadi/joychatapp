import React, { createContext, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
const baseUrl = "http://localhost:4000/";

export const MsgContext = createContext();

export const MsgProvider = ({ children }) => {
  const socket = io(baseUrl, {
    withCredentials: true,
    autoConnect: true,
  });
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});

  const getUserMessages = async (data1) => {
    console.log(data1);
    const { userId, myId } = data1;
    const res = await axios.get(`${baseUrl}api/v1/msg/msg/${userId}/${myId}`);

    // console.log(res);
    setMessages(res?.data?.privateMsg);
    // console.log(messages);
  };

  const createMessage = async (body) => {
    // console.log(body);
    const { userId, message, myId, sender, time, date } = body;
    await axios.post(`${baseUrl}api/v1/msg/createmsg`, {
      userId,
      message,
      sender,
      myId,
      time,
      date,
    });
  };

  return (
    <MsgContext.Provider
      value={{
        socket,
        users,
        setUsers,
        userId,
        setUserId,
        messages,
        setMessages,
        privateMessages,
        setPrivateMessages,
        newMessages,
        setNewMessages,
        getUserMessages,
        createMessage,
      }}
    >
      {children}
    </MsgContext.Provider>
  );
};
