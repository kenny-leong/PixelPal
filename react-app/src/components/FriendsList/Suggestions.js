import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getNonFriends, sendFriendReq, getFriendRequests } from "../../store/friends";
import { useHistory } from "react-router-dom";
import logo from '../../static/phantasmal-logo-trans.png';
import { io } from 'socket.io-client';
import './Suggestions.css';

let socket;

function Suggestions() {
  const dispatch = useDispatch()

  const currentUser = useSelector(state => state.session.user);
  const strangers = useSelector(state => state.friends.strangers);
  const pendingFriends = useSelector(state => state.friends.pendingReqs);
  const history = useHistory();

  useEffect(() => {
    dispatch(getNonFriends())
    dispatch(getFriendRequests(currentUser.id));
  }, [dispatch, currentUser.id])


  useEffect(() => {
    socket = io();

    // when component unmounts, disconnect
    return (() => socket.disconnect())
  }, [dispatch, currentUser])


  if (!currentUser || !strangers || !pendingFriends) {
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

  // handles getting suggestions
  const openSuggestions = () => {
    history.push(`/friends/suggestions`);
  }

  // handles getting pending requests
  const openPending = () => {
    history.push(`/friends/pending`);
  }

  // handles getting pending requests
  const handleFriendRoute = () => {
    history.push(`/friends/add`);
  }

  const sendFriendRequest = async (stranger) => {
    await dispatch(sendFriendReq(currentUser.id, stranger.id))
      .then((res) => {
        if (socket) socket.emit("newRequest", res)
      })
  }


  return (
    <div className='friendslist-container'>
      <div className="spacing-add-friend">
        <div className='friendslist-header-container'>
          <i className="fa-solid fa-user-group" />
          <div className='friendslist-friends'> Friends </div>
          <div className="friendlist-opts">
            <div className='friendslist-all sugg' onClick={openAllFriends}> All </div>
            <div className='friendslist-pending sugg' onClick={openPending}>
              <span>Pending</span>
              {pendingFriends.length > 0 && (
                <div className="red-bg-amt">
                  <span className="num-strangers">{pendingFriends.length}</span>
                </div>
              )}
            </div>
            <div className='friendslist-sugg sugg' onClick={openSuggestions}>
              <span>Suggestions</span>
              <div className="red-bg-amt">
                <span className="num-strangers">{strangers.length}</span>
              </div>
            </div>
            {/* <div className='friendslist-blocked sugg'> Blocked </div> */}
          </div>
        </div>
        <div className="add-friend-btn" onClick={handleFriendRoute}>
          <span className="add-friend-txt">Add Friend</span>
        </div>
      </div>
      <div className='friendslist-user-container-1 sugg'>
        <span>Suggested Friends — {strangers.length}</span>
      </div>

      {strangers.map(friend => (
        <div className='friendslist-user-container' key={`stranger${friend.id}`}>
          <div className='friendslist-pic-username'>
            <div className="profile-pic-div pending">
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
            <div className='icon-hover sugg' onClick={() => sendFriendRequest(friend)}>
              <i className="fa-solid fa-user-plus"></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}



export default Suggestions;
