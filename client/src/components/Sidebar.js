import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { UserContext } from "../Api/userContext";
import "../screens/Chat/Chat.css";
import { MsgContext } from "../Api/msgContext";

const Sidebar = () => {
  const {
    user,
    setUser,
    allUser,
    firebaseSignOut,
    setAllUser,
    setSelectedUser,
  } = useContext(UserContext);
  const { socket, setMessages, userId } = useContext(MsgContext);

  const [active, setActive] = useState();
  useEffect(() => {
    if (user !== null) {
      const data1 = {
        userId: userId,
        myId: user.userId,
      };
      socket.emit("join_user", data1);
      socket.emit("new_user");
    }
  }, [userId]);

  socket.off("private_messages").on("private_messages", (privateMessages) => {
    setMessages(privateMessages);
  });

  socket.off("new_user").on("new_user", (payload) => {
    const resUsers = payload?.filter((item) => item?.userId !== user?.userId);

    let finalUser = resUsers.filter((neUser) => {
      return !user?.blockedUsers?.find((itemB) => {
        return neUser.userId === itemB;
      });
    });

    setAllUser(finalUser);
  });

  const navigate = useNavigate();

  const handleSignOut = () => {
    firebaseSignOut();
    setUser(null);
    navigate("/login");
  };

  const handleSelectUser = (data) => {
    const { userId, rowIndex } = data;
    const data1 = {
      userId: userId,
      myId: user.userId,
    };

    setActive(rowIndex);

    const userData = allUser?.filter((userd) => userd?.userId === userId);

    setSelectedUser(userData[0]);

    if (user !== null) {
      const data1 = {
        userId: userId,
        myId: user.userId,
      };
      socket.emit("join_user", data1);
      socket.emit("new_user");
    }
  };

  return (
    <div className='chat__sidebar'>
      <div className='side__header'>
        {user !== null && (
          <div className='side__headerImgCont'>
            <img
              width={40}
              height={40}
              style={{ borderRadius: 20 }}
              src={user?.imageURL}
              alt={user?.name}
            />
          </div>
        )}

        <p>{user?.name}</p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // width: 100,
            justifyContent: "space-evenly",
            // backgroundColor: "red",
            // paddingTop: 12,
            marginRight: 10,
          }}
        >
          {/* <p style={{ alignSelf: "center" }}>logout</p> */}
          <div
            onClick={handleSignOut}
            style={{ cursor: "pointer", fontSize: 20, color: "red" }}
          >
            <AiOutlineLogout />
          </div>
        </div>
      </div>
      <div className='side__body'></div>
      {allUser?.map((user, index) => (
        <div
          key={index}
          className={`side__bodyItem ${
            active == allUser.indexOf(user) ? "side__active" : ""
          }`}
          onClick={() =>
            handleSelectUser({
              userId: user?.userId,
              rowIndex: allUser.indexOf(user),
            })
          }
        >
          <img
            className='side__bodyImage'
            src={user?.imageURL}
            alt='https://res.cloudinary.com/dblprzex8/image/upload/v1649530086/avatars/gnn7wyyqttyrht7xjogi.png'
          />
          <p>{user?.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
