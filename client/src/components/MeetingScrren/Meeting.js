import React,{useEffect} from 'react'
import { io } from "socket.io-client";
import Peer from 'peerjs';

import "./Meeting.css";

const ENDPOINT = "https://evening-shelf-31784.herokuapp.com";
//https://evening-shelf-31784.herokuapp.com/

const UserName=localStorage.getItem('username');
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
  const peers = {};

function Meeting(props) {

    useEffect(() => {
    const RoomId=props.match.params.roomId;
    const socket = io(ENDPOINT);    

    let myVideoStream;
    const videoGrid = document.getElementById("video-grid");
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat__window");

    
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "evening-shelf-31784.herokuapp.com",
  port: 443,
})

alert(process.env.port)
// display my video on screenn
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    //own video on screen
    console.log(stream);
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream);   

    socket.on("user-connected", (user) => {
    console.log("user connected")
      connectToNewUser(user, stream);
      var x = document.getElementById("snackbar");
      x.className = "show";
      x.innerHTML=`${user.name} Joined`
      // After 3 seconds, remove the show class from DIV
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
    
      
    });   
  })
  .catch(err => alert(err));


peer.on("open", (id) => {
  alert("peer connected")
  socket.emit("join-room",RoomId, id,UserName);
  
});
socket.on('user-disconnected', user => { 

  console.log(`peer with id ${user.peerId} disconnected`);
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML=`${user.name} Left`
  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

  
 // console.log("will go in  if 73");
   if (peers[user.peerId]){ 
   // console.log("executing if 73");
     peers[user.peerId].close()    
     delete peers[user.peerId];
   }
   
 
 })


peer.on("call", function (call) {
  //this runs for all connected peers

  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      console.log(call);

     peers[call.peer] = call;
      const video = document.createElement("video");

      call.on("stream", function (remoteStream) {     
        addVideoStream(video, remoteStream);
      });       
      
      call.on('close', function(){
        video.remove()
  });

    },  

    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});

 document.getElementById("send-msg").addEventListener("click",(e)=>{
  
  if ( chatInputBox.value != "") {
    socket.emit("message", chatInputBox.value);
    chatInputBox.value = "";
  }
 })

document.addEventListener("keydown", (e) => {
  if (e.which === 13 && chatInputBox.value != "") {
    socket.emit("message", chatInputBox.value);
    chatInputBox.value = "";
  }
});

socket.on("createMessage", (msg) => {
  console.log(msg);
  let li = document.createElement("li");
  li.innerHTML = msg.name+":"+msg.message;
  all_messages.append(li);
  main__chat__window.scrollTop = main__chat__window.scrollHeight;
});


const connectToNewUser = (user, streams) => {
  var call = peer.call(user.peerId, streams);

  var video = document.createElement("video");
//  video.id = user.peerId;

  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  
      call.on('close', function(){
          video.remove()
    });

  peers[user.peerId] = call;
};

const addVideoStream = (videoEl, stream) => {
  videoEl.srcObject = stream;
  videoEl.addEventListener("loadedmetadata", () => {
    videoEl.play();
  });

  videoGrid.append(videoEl);
  let totalUsers = document.getElementsByTagName("video").length;
 
};
    }, [])

    return (
      <div>
    <div class="main">
      <div class="main__left">
      {UserName && <h2>UserName :- {UserName} </h2>}
      <h2 className="meeting-details">Meeting Id :- {props.match.params.roomId} </h2>
      <i class="fa fa-user-friends"></i>
        <div class="main__videos">
          <div id="video-grid"></div>
        </div>

      </div>
      <div class="main__right">
        <div class="main__header">
          <h4>Chat</h4>
        </div>
        <div class="main__chat__window" id="main__chat__window">
          <ul class="messages" id="all_messages"></ul>
        </div>
        <div class="main__message_container">
          <input
            type="text"
            id="chat_message"
            placeholder="Type message here.."
          />
          <button className="send-btn" id="send-msg"><i class="fa fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
    <div id="snackbar">Some text some message..</div>
    </div>
    )
}

export default Meeting
