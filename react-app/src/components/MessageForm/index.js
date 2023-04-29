import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { getChannelDetails } from '../../store/channels';
import { createMessage, getChannelMessages } from "../../store/message";
import ChannelMessages from "../ChannelMessages";
import "./MessageForm.css";

let socket;

function MessageForm() {
    const dispatch = useDispatch();

    const { serverId, channelId } = useParams();

    const [content, setContent] = useState("");
    const [messages, setMessages] = useState([]);

    const user = useSelector(state => state.session.user);
    const channel = useSelector(state => state.channels.oneChannel);



    useEffect(() => {
        // Load channel details when component mounts or channelId changes
        dispatch(getChannelDetails(channelId));

        // fetch prev messages from server
        async function fetchPrevMessages() {
            const prevMsgs = await dispatch(getChannelMessages(channelId));
            setMessages(Object.values(prevMsgs));
        }

        // call the async function
        fetchPrevMessages();

    }, [dispatch, serverId, channelId])

    useEffect(() => {
        // Connect to the Socket.IO server when component mounts or channelId/user changes
        socket = io();

        if (socket && user) {
            // Join the user to the specified channel room
            socket.emit('join', { channel_id: channelId, username: user.username })

            // Listen for incoming chat messages and add them to the messages state
            socket.on("chat", (chat) => {
                setMessages(prevMessages => [...prevMessages, chat])
            })
        }

        // When component unmounts, disconnect from the Socket.IO server
        return (() => socket.disconnect() )

    }, [channelId, user])

    if (!channel) return null;

    const handleSubmit = async (e) => {
        // e is undefined if message sent with Enter key, check if it exists (message sent by clicking Send button) before running e.preventDefault()
        if (e) e.preventDefault();

        // Create a new message object
        let message = {
        userId: user?.id,
        channelId: channel.id,
        content: content,
        timestamp: new Date(),
        reactions: [],
        };

        // Dispatch the new message to the server
        let createdMsg = await dispatch(createMessage(message));

        // Emit the new message to the Socket.IO server
        if (socket) socket.emit("chat", createdMsg);

        // Clear the message input field
        setContent("");
    };

    const enterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <>
            <ChannelMessages messages={messages} />
            <div className="message-form-background">
                <div className='message-form-container'>
                    <form className="message-form" onSubmit={handleSubmit}>
                        {/* at 1800 characters start a counter for characters allowed left (starts at 200), disable the send button above 2000  */}
                        <textarea
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`Message ${channel.name}`}
                            onKeyPress={enterKey}
                            required
                        />
                        <div className="message-form-right-side">
                            <div className={content.length >= 1800 ? (content.length > 2000 ? "character-count-error" : "character-count-warning") : "message-hidden"}>{2000 - content.length}</div>
                            <button className={content.length > 2000 ? "message-form-button message-form-text message-form-disabled" : "message-form-button message-form-text"} type="submit" disabled={content.length > 2000}>Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}


export default MessageForm;
