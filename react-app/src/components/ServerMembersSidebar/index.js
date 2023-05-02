import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServerMemberAdd from "../ServerMemberAdd";
import { useHistory } from "react-router-dom";
import { getServer, deleteServerMember } from "../../store/server";
import { getUserFriends, sendFriendReq, getNonFriends } from "../../store/friends";
import { getUserServers, addPrivateServer, getFriendServers } from "../../store/server";
import logo from '../../static/phantasmal-logo-trans.png';
import { useModal } from "../../context/Modal";
import "./ServerMemberSidebar.css";


const ServerMembersSidebar = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { setModalContent, closeModal } = useModal();

    const currentUser = useSelector(state => state.session.user);
    const server = useSelector(state => state.server.currentServer);
    const userServers = useSelector(state => state.server.userServers)
    const userFriends = useSelector(state => state.friends.userFriends)
    const strangers = useSelector(state => state.friends.strangers);
    const members = server.members;

    useEffect(() => {
        dispatch(getUserFriends(currentUser.id))
        dispatch(getUserServers(currentUser.id))
        dispatch(getNonFriends())
    }, [dispatch, currentUser])



    if (!currentUser || !userFriends || !userServers || !strangers) {
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
    const friendObj = {}
    const strangerObj = {}

    for (let friend of userFriends) {
        friendObj[friend.user.id] = friend;
    }

    for (let stranger of strangers) {
        strangerObj[stranger.id] = stranger;
    }

    // Starts or reopens a DM if previously opened
    const handleDM = async (friend) => {
        const friendServers = await dispatch(getFriendServers(friend.id));

        if (friendServers) {

            const friendServerArr = Object.values(friendServers);
            const friendPrivateServers = friendServerArr.filter(server => server.status === true);

            const index = friend.username.indexOf("#");
            const slicedFriendUsername = friend.username.slice(0, index);

            const index2 = currentUser.username.indexOf('#')
            const sessionUsername = currentUser.username.slice(0, index2);

            const privateServerName = `${slicedFriendUsername}-${sessionUsername}`;

            // Check if there is an existing server with the current user and the friend as the members
            for (let server of privateServerArr) {
                const members = server.members.map(member => member.id);
                if (members.includes(currentUser.id) && members.includes(friend.id)) {
                    return history.push(`/private-messages/${server.id}/${server.channels[0].id}`);
                }
            }

            for (let server of friendPrivateServers) {
                const members = server.members.map(member => member.id);
                if (members.includes(currentUser.id) && members.includes(friend.id)) {
                    return history.push(`/private-messages/${server.id}/${server.channels[0].id}`);
                }
            }

            await dispatch(addPrivateServer(`${privateServerName}`, currentUser.id, true, currentUser.username, friend.username))
                .then((res) => {
                    history.push(`/private-messages/${res.id}/${res.channels[0].id}`)
                    closeModal();
                })
        }
    }

    const handleDelete = async (e, member) => {
        e.preventDefault();

        await dispatch(deleteServerMember(server.id, member))
            .then(() => {
                dispatch(getServer(server.id));
            })
    }

    const addFriend = async (stranger) => {
        await dispatch(sendFriendReq(currentUser.id, stranger.id))
            .then((res) => {
                dispatch(getUserFriends(currentUser.id))
            })
    }

    //opens the add server member component
    const openModal = (server) => {
        setModalContent(<ServerMemberAdd server={server} />);
    };


    return (
        <div className="member-sidebar">
            <h1 className='create-server-header'>Members in {server.name}!</h1>
            <p className='create-server-para'>The following users are members of {server.name}:</p>
            {server.owner_id === currentUser.id && (
                <div className='server-members-setting-btn' onClick={() => openModal(server)}>
                    <div className="server-member-btn">
                        <i className="fa-solid fa-user-plus"></i>
                        <span className="add-member-txt">Add a new server member</span>
                    </div>
                </div>
            )}
            <div className='server-members-list-container'>
                {members.map(member => (
                    <div className='server-member-list-card' key={`member${member.id}`}>
                        <div className='friendslist-user-container' id="server-members-container">
                            <div className='friendslist-pic-username'>
                                <div>
                                    <img className='friendslist-profile-image members' src={member.prof_pic ? member.prof_pic : logo} alt='profile_pic_user' />
                                </div>
                                <div className='friendslist-username'>
                                    {member.username.split("#")[0]}
                                </div>
                                <div className='friendslist-tag'>
                                    #{member.username.split("#")[1]}
                                </div>
                            </div>
                            {friendObj[member.id] && member.id !== server.owner_id && (
                                <div className='friendslist-chat-icon-smember'>
                                    <div className='friendslist chat-icon' onClick={() => handleDM(member)}>
                                        <i className="fa-solid fa-message" />
                                    </div>

                                </div>
                            )}
                            {strangerObj[member.id] && member.id !== server.owner_id && (
                                <div className="friendslist-adduser-icon" onClick={() => addFriend(member)}>
                                    <i className="fa-solid fa-user-plus"></i>
                                </div>
                            )}
                            {server.owner_id === currentUser.id && member.id !== server.owner_id && (
                                <div className='friendslist kick-icon' onClick={(e) => handleDelete(e, member)}>
                                    <i className="fa-solid fa-ban"></i>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div className="padding-buffer"></div>
            </div>
        </div >
    );

}

export default ServerMembersSidebar;
