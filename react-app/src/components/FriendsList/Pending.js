import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { removeFriendship, getFriendRequests, acceptFriendRequest } from "../../store/friends";
import { useHistory } from "react-router-dom";
import logo from '../../static/phantasmal-logo-trans.png';
import { io } from 'socket.io-client';
import './Pending.css';


let socket;

function Pending() {
    const dispatch = useDispatch()

    const currentUser = useSelector(state => state.session.user);
    const pendingFriends = useSelector(state => state.friends.pendingReqs);
    const history = useHistory();

    useEffect(() => {

        dispatch(getFriendRequests(currentUser.id));
    }, [dispatch, currentUser.id])


    useEffect(() => {
        socket = io();

        // when component unmounts, disconnect
        return (() => socket.disconnect())
      }, [dispatch, currentUser])


    if (!currentUser || !pendingFriends) {
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


    // handles getting all friends
    const openAllFriends = () => {
        history.push(`/channels/@me`);
    }

    // handles getting all friend suggestions
    const openSuggestions = () => {
        history.push(`/friends/suggestions`);
    }

    // handles getting pending requests
    const openPending = () => {
        history.push(`/friends/pending`);
    }

    // handles rejecting a friend request
    const rejectRequest = async (friendId) => {
        await dispatch(removeFriendship(friendId))
            .then((res) => {
                if (socket) socket.emit("newRequest", res)
            })
    }

    // handles accepting a friend request
    const acceptReq = async (friendId) => {
        await dispatch(acceptFriendRequest(currentUser.id, friendId))
            .then((res) => {
                if (socket) socket.emit("newRequest", res)
            })
    }




    return (
        <div className='friendslist-container'>
            <div className="spacing-add-friend pending">
                <div className='friendslist-header-container'>
                    <i className="fa-solid fa-user-group" />
                    <div className='friendslist-friends'> Friends </div>
                    <div className="friendlist-opts">
                        <div className='friendslist-all pend' onClick={openAllFriends}> All </div>
                        <div className='friendslist-pending pend' onClick={openPending}>Pending</div>
                        <div className='friendslist-sugg pend' onClick={openSuggestions}>Suggestions</div>
                        <div className='friendslist-blocked pend'> Blocked </div>
                    </div>
                </div>
                <div className="add-friend-btn">
                    <span className="add-friend-txt">Add Friend</span>
                </div>
            </div>
            <div className='friendslist-user-container-1 pending'>
                <span>Friend Requests — {pendingFriends.length}</span>
            </div>

            {pendingFriends.map(friend => (
                <div className='friendslist-user-container' key={`stranger${friend.id}`}>
                    <div className='friendslist-pic-username'>
                        <div>
                            <img className='friendslist-profile-image' src={friend.user.prof_pic ? friend.user.prof_pic : logo} alt='profile_pic_user' />
                        </div>
                        <div className='friendslist-username'>
                            <span>{friend.user.username.split("#")[0]}</span>
                        </div>
                        <div className='friendslist-tag'>
                            <span>#{friend.user.username.split("#")[1]}</span>
                        </div>
                    </div>

                    <div className='friendslist-chat-icon'>
                        <div className='icon-hover sugg' onClick={() => acceptReq(friend.user.id)}>
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <div className='icon-hover sugg' onClick={() => rejectRequest(friend.user.id)}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}



export default Pending;
