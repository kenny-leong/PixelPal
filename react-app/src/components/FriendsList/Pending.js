import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserFriends, getFriendRequests } from "../../store/friends";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import logo from '../../static/phantasmal-logo-trans.png';
import './Pending.css';

function Pending() {
    const dispatch = useDispatch()

    const currentUser = useSelector(state => state.session.user);
    const pendingFriends = useSelector(state => state.friends.pendingReqs);
    const { closeModal } = useModal();
    const history = useHistory();

    useEffect(() => {
        // dispatch(getUserFriends(currentUser.id))
        dispatch(getFriendRequests());
    }, [dispatch, currentUser.id])


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


    // placeholder function
    const handleOptions = (e) => {
        e.preventDefault();
        window.alert('More Options Feature Coming Soon!');
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
            <div className='friendslist-user-container-1 sugg'>
                <span>Friend Suggestions — {pendingFriends.length}</span>
            </div>

            {pendingFriends.map(friend => (
                <div className='friendslist-user-container' key={`stranger${friend.id}`}>
                    <div className='friendslist-pic-username'>
                        <div>
                            <img className='friendslist-profile-image' src={friend.prof_pic ? friend.prof_pic : logo} alt='profile_pic_user' />
                        </div>
                        <div className='friendslist-username'>
                            <span>{friend.username.split("#")[0]}</span>
                        </div>
                        <div className='friendslist-tag'>
                            <span>#{friend.username.split("#")[1]}</span>
                        </div>
                    </div>

                    <div className='friendslist-chat-icon'>
                        <div className='icon-hover sugg'>
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <div className='icon-hover sugg' onClick={handleOptions}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}



export default Pending;
