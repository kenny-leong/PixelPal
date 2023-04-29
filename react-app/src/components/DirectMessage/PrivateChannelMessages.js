import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MessageItem from "../MessageItem";
import { getUserFriends } from "../../store/friends";
import { getServer } from '../../store/server';
import { clearMessages, getChannelMessages } from "../../store/message";
import "./PrivateChannelMessages.css";

function PrivateChannelMessages({ messages }) {

    const { channelId, serverId } = useParams();
    const allMessages = useSelector(state => state.messages);
    const currentUser = useSelector(state => state.session.user)
    const userFriends = useSelector(state => state.friends.userFriends)

    // if the incoming msg has a channelId, rewrite it in state so that we aren't rendering same data twice
    if (messages?.channelId === channelId) {
        allMessages[messages.id] = messages;
    }

    const server = useSelector(state => state.server.currentServer);
    const dispatch = useDispatch();

    //populate store with channelMessages on render and when channel.id changes
    //trying to remove allMessages from dependency array (ADD BACK IN IF NEEDED)
    useEffect(() => {
        dispatch(getChannelMessages(channelId));
        dispatch(getServer(serverId))
        dispatch(getUserFriends(currentUser.id))
        // clear state every time channel Id changes
        return () => dispatch(clearMessages())
    }, [dispatch, channelId, serverId]); //allMessages



    if (!allMessages || !server || !userFriends || !currentUser) {
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
    const allMessagesArr = Object.values(allMessages);
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
                    <img src={friend.prof_pic} className="dm-picture-icon" alt='dm-icon'/>
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
