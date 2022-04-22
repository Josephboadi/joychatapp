import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCFBAtXIoTYLeGvc0yjGZ1rMrYGMLzRbAQ",
  authDomain: "joechatapp.firebaseapp.com",
  projectId: "joechatapp",
  storageBucket: "joechatapp.appspot.com",
  messagingSenderId: "453390951279",
  appId: "1:453390951279:web:ef07670c58ed931978be9a",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

export { app };
