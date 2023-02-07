import React, { useEffect, useState } from "react";
import sendLogo from '../images/send-logo-white.png'
import { v4 as uuid } from 'uuid';
import ScrollToBottom from "react-scroll-to-bottom";
import closeIcon from '../images/close-icon-white.png'

export default function Chat({socket, username, room, leaveRoom}){

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
          const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
    
          await socket.emit("send_message", messageData);
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage("");
          document.getElementById("input-message").value = "";
        }
      };
    
      useEffect(() => {
        const eventListener = (data) => {
          setMessageList((list) => [...list, data]);
        };
        socket.on("receive_message", eventListener);

      return () => socket.off("receive_message", eventListener);
      }, [socket]);

      // At every updat of the message list, it automatically scoll down
      useEffect(() => {
        var elem = document.getElementById("chat-body");
        elem.scrollTop = elem.scrollHeight;
      }, [messageList])

    return (
        <div className="chat-card">
            <div className="chat-header">
                <p>ROOM N°123</p>
                <img onClick={leaveRoom} className="leave-button" src={closeIcon} alt="send"/>
            </div>
            <div className="line"></div>
            <div id="chat-body" className="chat-body">
                {
                messageList.map((messageContent) => {

                    if(messageContent.author === username){
                      return (
                        <div key={uuid().slice(0,8)} className="message own">
                          <span className="message-content">
                            {messageContent.message}
                          </span>
                          <span className="message-time">{messageContent.time}</span>
                        </div>
                      )
                    }
                    else {
                      return (
                          <div key={uuid().slice(0,8)} className="message">
                            <span className="message-author">{messageContent.author}</span>
                            <span className="message-content">
                              {messageContent.message}
                            </span>
                            <span className="message-time">{messageContent.time}</span>
                          </div>
                      )
                    }
                    
                })
                }
                
            </div>
            <div className="line" />
            <div className="chat-footer">
                <input id="input-message" className='glass-input' type="text" placeholder="Hey..." onChange={(event) => {
                    setCurrentMessage(event.target.value)
                }} />
                
                <button className="glass-button-send" onClick={sendMessage} > <img className="logo-button" src={sendLogo} alt="send"/></button>
            </div>
        </div>
    )
}