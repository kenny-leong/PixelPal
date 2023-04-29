import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MessageItem from "../MessageItem";
import { clearMessages, getChannelMessages } from "../../store/message";
import "./ChannelMessages.css";

function ChannelMessages({ messages }) {
    const channel = useSelector(state => state.channels.oneChannel)

    return (
        <div className='channel-messages-container'>
            <div className="channel-messages-top">
                <div className="channel-icon-container">
                    <h1 className="channel-icon">#</h1>
                </div>
                <h2 className="channel-messages-welcome">Welcome to #{channel.name}!</h2>
                <p className="channel-messages-start">This is the start of the #{channel.name} channel.</p>
            </div>
            <div id='scroller'>
                {messages.map(message => (
                    <div key={`message${message.id}`} className='message-item-container'>
                        <MessageItem message={message} />
                    </div>
                ))}
                <div id='anchor'></div>
            </div>
        </div>
    );
}


export default ChannelMessages;
