import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MessageItem from "../MessageItem";
import { getServer } from '../../store/server';
import { clearMessages, getChannelMessages } from "../../store/message";
import "./PrivateChannelMessages.css";

function PrivateChannelMessages({ messages }) {
    const channel = useSelector(state => state.channels.oneChannel)
    const allMessages = useSelector(state => state.messages);
    // if the incoming msg has a channelId, rewrite it in state so that we aren't rendering same data twice
    if (messages?.channelId) allMessages[messages.id] = messages
    const { channelId, serverId } = useParams();
    const server = useSelector(state => state.server.currentServer);


    const dispatch = useDispatch();



    //populate store with channelMessages on render and when channel.id changes
    //trying to remove allMessages from dependency array (ADD BACK IN IF NEEDED)
    useEffect(() => {
        dispatch(getChannelMessages(channelId));
        dispatch(getServer(serverId))
        // clear state every time channel Id changes
        return () => dispatch(clearMessages())
    }, [dispatch, channelId]); //allMessages



    if (!allMessages) return null;
    const allMessagesArr = Object.values(allMessages);

    return (
        <div className='channel-messages-container'>
            <div className="channel-messages-top">
                <div className="channel-icon-container">
                    <img src={server.server_picture} className="dm-picture-icon" />
                </div>
                <h2 className="channel-messages-welcome">{server.name}</h2>
                <p className="channel-messages-start">This is the beginning of your direct message history with {server.name}.</p>
            </div>
            <div id='scroller'>
                {allMessagesArr.map((message) => {
                    return (
                        <div key={`message${message.id}`} className='message-item-container'>
                            <MessageItem message={message} />
                        </div>
                    );
                })}
                <div id='anchor'></div>
            </div>
        </div>
    );
}


export default PrivateChannelMessages;
