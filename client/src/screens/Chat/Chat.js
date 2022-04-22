import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { IoSend } from "react-icons/io5";
import { BiBlock } from "react-icons/bi";

import Sidebar from "../../components/Sidebar";
import "./Chat.css";

import { UserContext } from "../../Api/userContext";
import { app } from "../../config/firebase.config";
import { MsgContext } from "../../Api/msgContext";

const Chat = () => {
  const { user, setUser, selectedUser, validateUser, blockUser } =
    useContext(UserContext);
  const { socket, userId, messages, setMessages } = useContext(MsgContext);
  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);
  const [message, setMessage] = useState("");

  const [auth, setAuth] = useState(
    false || window.localStorage.getItem("auth")
  );

  const getFormattedDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (!userCred) {
        setAuth(false);
        setUser(null);
        window.localStorage.setItem("auth", "false");
        navigate("/login");
      } else {
      }
    });
  }, [messages, userId]);

  useEffect(() => {
    if (user !== null) {
      socket.emit("user_messages");
      socket.emit("private_messages");
    }
  }, []);

  socket.off("user_messages").on("user_messages", (privateMessages) => {
    setMessages(privateMessages);
  });

  socket.off("new_user").on("new_user", (payload) => {});

  const todayDate = getFormattedDate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    let today = new Date();
    let minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    let time = today.getHours() + ":" + minutes;

    const data = {
      userId: selectedUser.userId,
      message,
      sender: user,
      myId: user.userId,
      user,
      time,
      date: todayDate,
    };
    socket.emit("message_user", data);

    setMessage("");

    socket.emit("user_messages");
    socket.emit("private_messages");
  };

  const handleBlockUser = () => {
    const data = { userId: user.userId, blockUserId: selectedUser.userId };

    if (window.confirm("Are you sure you want to block user?") == true) {
      blockUser(data);

      firebaseAuth.onAuthStateChanged((userCred) => {
        if (userCred) {
          userCred.getIdToken().then((token) => {
            window.localStorage.setItem("auth", "true");
            validateUser(token);
          });
        } else {
          setAuth(false);
          setUser(null);
          window.localStorage.setItem("auth", "false");
          navigate("/login");
        }
      });
    }
  };

  return (
    <>
      <div className='container'>
        <div className='chat__container'>
          <Sidebar />
          <div className='chat__mainSection'>
            <div className='chat__messagesSection'>
              {selectedUser && (
                <div className='chat__sectionHeader'>
                  <div className='chat__headerContent'>
                    <img
                      width={40}
                      height={40}
                      style={{ borderRadius: 20, marginRight: 5 }}
                      src={selectedUser?.imageURL}
                      alt='https://res.cloudinary.com/dblprzex8/image/upload/v1649530086/avatars/gnn7wyyqttyrht7xjogi.png'
                    />
                    <p>{selectedUser?.name}</p>
                  </div>
                  {selectedUser?.blockedStatus ? (
                    <div className='chat__headerBlockedUser'>
                      <BiBlock style={{ fontSize: 20, color: "white" }} />
                      <p>Blocked</p>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleBlockUser()}
                      className='chat__headerBlockUser'
                    >
                      <BiBlock style={{ fontSize: 20, color: "white" }} />
                      <p>Block User</p>
                    </div>
                  )}
                </div>
              )}
              {user !== null && messages.length > 0 ? (
                messages?.map((message, index) => (
                  <div
                    key={index}
                    className={`${
                      index === 0 ? "msg__1container" : "msg__container"
                    }`}
                  >
                    <div className='single__msgDate'>
                      <p className='msg__date'>{message?._id}</p>
                    </div>

                    {message?.messagesByDate?.map((details, index) => (
                      <div
                        key={index}
                        className={`msgDetailMainContainer ${
                          details.to === user.userId
                            ? ""
                            : "myMsgDetailMainContainer"
                        }`}
                      >
                        <div
                          className={`${
                            details.to === user.userId
                              ? "msg__detailContainer"
                              : "msg__myDetailContainer"
                          }`}
                        >
                          <p>{details?.message}</p>
                          <p
                            style={{
                              display: "flex",
                              alignSelf: "flex-end",
                              marginBottom: -5,
                              fontSize: 12,
                              marginTop: 5,

                              // position: "absolute",
                              // bottom: 5,
                              // right: 2,
                            }}
                          >
                            {details?.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className='msg_containerEmpty'>
                  <p style={{ fontSize: 30 }}>Select a user to chat with</p>
                </div>
              )}
            </div>
            <div className='chat__formSection'>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className='form__content'>
                  <div className='input__wrapper'>
                    <input
                      disabled={!selectedUser || selectedUser?.blockedStatus}
                      className='input'
                      type='text'
                      placeholder='Type your message'
                      id='message'
                      name='message'
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      // rows={2}
                    />
                  </div>
                  <div
                    disabled={
                      !selectedUser ||
                      message === "" ||
                      selectedUser?.blockedStatus
                    }
                    onClick={(e) => handleSubmit(e)}
                    className='icon__wrapper'
                  >
                    <IoSend style={{ color: "#3A9BDC", fontSize: 30 }} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
