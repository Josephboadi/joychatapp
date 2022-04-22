import React from "react";
import { Routes, Route } from "react-router-dom";

import { Chat, Login } from "./screens";

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Chat />} />
      <Route exact path='/login' element={<Login />} />
    </Routes>
  );
}

export default App;
