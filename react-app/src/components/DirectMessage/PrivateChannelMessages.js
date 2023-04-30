import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MessageItem from "../MessageItem";
import { getUserFriends } from "../../store/friends";
import { getServer } from '../../store/server';
import placeholder from '../../static/placeholder.webp';
import "./PrivateChannelMessages.css";

function PrivateChannelMessages({ messages }) {

    const { channelId, serverId } = useParams();
    const messageListRef = useRef(null);
    const currentUser = useSelector(state => state.session.user)
    const userFriends = useSelector(state => state.friends.userFriends)
    const channelMessages = messages.filter(message => message.channelId == channelId);

    const server = useSelector(state => state.server.currentServer);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getServer(serverId))
        dispatch(getUserFriends(currentUser.id))
    }, [dispatch, channelId, serverId, currentUser]);

    // Scroll to bottom of message list when it's first rendered
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [dispatch, messages]);



    if (!server || !userFriends || !currentUser) {
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


    const index = currentUser.username.indexOf('#');
    const sessionUsername = currentUser.username.slice(0, index);
    let friend;


    if (server.name.includes('-')) {
        const sName = server.name.split('-').find(name => name !== sessionUsername);
        friend = userFriends.find(friend => friend.user.username.startsWith(sName)).user
    }

    return (
        <div className='channel-messages-container'>
            <div className="channel-messages-top">
                <div className="channel-icon-container">
                    <img src={friend ? friend.prof_pic : placeholder} className="dm-picture-icon" alt='dm-icon' />
                </div>
                <h2 className="channel-messages-welcome">
                    {server.name.includes("-")
                        ? server.name.split("-").find(name => name !== sessionUsername)
                        : server.name
                    }
                </h2>
                <p className="channel-messages-start">
                    This is the beginning of your direct message history with {server.name.includes("-")
                        ? server.name.split("-").find(name => name !== sessionUsername)
                        : server.name
                    }.
                </p>
            </div>
            <div id='scroller'>
                {channelMessages.map((message) => {
                    return (
                        <div key={`message${message.id}`} className='message-item-container'>
                            <MessageItem message={message} />
                        </div>
                    );
                })}
                <div ref={messageListRef} />
            </div>
        </div>
    );
}


export default PrivateChannelMessages;
