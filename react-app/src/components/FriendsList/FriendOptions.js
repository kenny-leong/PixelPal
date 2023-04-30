import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal"
import { removeFriendship, getNonFriends } from '../../store/friends';
import { getUserServers, deleteServer } from "../../store/server";
import { io } from 'socket.io-client';

import './FriendOptions.css';

let socket;

function FriendOptions({ friend }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const currentUser = useSelector(state => state.session.user)
    const userServers = useSelector(state => state.server.userServers)



    useEffect(() => {
        dispatch(getUserServers(currentUser.id))
    }, [dispatch, currentUser])


    useEffect(() => {
        socket = io();

        // when component unmounts, disconnect
        return (() => socket.disconnect())
    }, [dispatch])


    if (!currentUser || !userServers) {
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

    const serverArr = Object.values(userServers);
    const privateServerArr = serverArr.filter(server => server.status === true);
    const index = friend.username.indexOf('#')
    const friendUsername = friend.username.slice(0, index);

    const serverTBD = privateServerArr.find(server => server.name.includes(friendUsername))

    const returnHome = () => {
        closeModal();
    }

    const removeFriend = async () => {
        if (serverTBD) await dispatch(deleteServer(serverTBD.id));
        await dispatch(getUserServers(currentUser.id))
        await dispatch(removeFriendship(friend.id))
        socket.emit('newRequest', null)
        closeModal();
    }

    return (
        <div className='delete-friend-modal'>
            <span className='title-friend'>Friend Options</span>
            <div className='remove-friend remove' onClick={removeFriend}>
                <span>Remove {friend.username} from Friends</span>
            </div>
            <div className='remove-friend block'>
                <i className="fa-solid fa-ban"></i>
                <span>Block {friend.username}</span>
            </div>
            <div className='remove-friend cancel' onClick={returnHome}>
                <span>Cancel</span>
            </div>
        </div>
    )

}

export default FriendOptions;
