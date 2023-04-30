import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserServers, deleteServer } from "../../store/server";
import { getUserFriends, getFriendRequests, getNonFriends } from "../../store/friends";
import { io } from 'socket.io-client';
import logo from '../../static/phantasmal-logo-trans.png';
import './DirectMessageBar.css';


let socket;

function DirectMessageBar() {

    const history = useHistory();
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.session.user)
    const userServers = useSelector(state => state.server.userServers)
    const userFriends = useSelector(state => state.friends.userFriends)

    useEffect(() => {
        dispatch(getUserServers(currentUser.id))
        dispatch(getUserFriends(currentUser.id))
    }, [dispatch, currentUser.id])


    useEffect(() => {
        socket = io();

        if (socket) {
            socket.on("newServer", (server) => {
                dispatch(getUserServers(currentUser.id))
            })
            socket.on("newRequest", (req) => {
                dispatch(getFriendRequests(currentUser.id));
                dispatch(getNonFriends())
                dispatch(getUserFriends(currentUser.id))
                dispatch(getUserServers(currentUser.id))
              })
        }
        // when component unmounts, disconnect
        return (() => socket.disconnect())
    }, [dispatch, currentUser.id])



    if (!currentUser || !userServers || !userFriends) {
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
    const index = currentUser.username.indexOf('#')
    const sessionUsername = currentUser.username.slice(0, index);

    const handleDMOpen = (server) => {
        history.push(`/private-messages/${server.id}/${server.channels[0].id}`);
    }

    const deleteDM = (server) => {
        dispatch(deleteServer(server.id))
            .then(() => {
                socket.emit('newServer', null)
                history.push(`/channels/@me`)
            })
    }

    return (
        <>
            <div className='friendslist-channel-container'>
                <div className='friendslist-channel-friendscontainer'>
                    <i className="fa-solid fa-user-group" />
                    <div className='friendslist-channel-item'> Friends </div>
                </div>

                <div className='friendslist-channel-dm-container'>
                    <div className="direct-message-tab">
                        <div className='friendslist-channel-dm'> DIRECT MESSAGES </div>
                        <i className="fa-solid fa-plus" />
                    </div>
                    {privateServerArr.map(server => (
                        <div className="dm-div-container" key={`server ${server.id}`}>
                            <div className="private-dm-container" onClick={() => handleDMOpen(server)}>
                                <img
                                    src={server.name.includes('-')
                                        ? userFriends.find(friend => friend.user.username.startsWith(server.name.split('-').find(name => name !== sessionUsername))).user.prof_pic
                                            ? userFriends.find(friend => friend.user.username.startsWith(server.name.split('-').find(name => name !== sessionUsername))).user.prof_pic
                                            : logo
                                        : logo}
                                    alt='private-dm-pic'
                                    className="dm-picture"
                                />
                                <span className="dm-name">
                                    {server.name.includes("-")
                                        ? server.name.split("-").find(name => name !== sessionUsername)
                                        : server.name
                                    }
                                </span>
                            </div>
                            <div className="trash-div" onClick={() => deleteDM(server)}>
                                <i className="fa-solid fa-trash"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )

}



export default DirectMessageBar;
