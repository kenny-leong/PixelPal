import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import MessageItem from "../MessageItem";
import { useParams } from 'react-router-dom';
import "./ChannelMessages.css";


function ChannelMessages({ messages }) {
    const channel = useSelector(state => state.channels.oneChannel)
    const messageListRef = useRef(null);
    const { channelId } = useParams();
    const dispatch = useDispatch();


    const channelMessages = messages.filter(message => message.channelId === parseInt(channelId));

    // Scroll to bottom of message list when it's first rendered
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [dispatch, messages]);

    if (!messages) {
        return (
            <div className='loading-animation'>
                <div className="center">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                </div>
            </div>
        )
    }

    return (
        <div className='channel-messages-container'>
            <div className="channel-messages-top">
                <div className="channel-icon-container">
                    <h1 className="channel-icon">#</h1>
                </div>
                <h2 className="channel-messages-welcome">Welcome to #{channel.name}!</h2>
                <p className="channel-messages-start">This is the start of the #{channel.name} channel.</p>
            </div>
            <div className="channel-messages-section">
                {channelMessages.map(message => (
                    <div key={`message${message.id}`} className='message-item-container'>
                        <MessageItem message={message} />
                    </div>
                ))}
                <div ref={messageListRef} />
            </div>
        </div>
    );
}


export default ChannelMessages;
