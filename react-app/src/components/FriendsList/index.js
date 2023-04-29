import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserFriends } from "../../store/friends";
import { getUserServers, addPrivateServer, getFriendServers } from "../../store/server";
import { useHistory } from "react-router-dom";
import logo from '../../static/phantasmal-logo-trans.png';
import { io } from 'socket.io-client';
import './FriendsList.css'

let socket;

export default function FriendsList() {
  const dispatch = useDispatch()

  const currentUser = useSelector(state => state.session.user)
  const userServers = useSelector(state => state.server.userServers)
  const userFriends = useSelector(state => state.friends.userFriends)
  const history = useHistory();

  useEffect(() => {
    dispatch(getUserFriends(currentUser.id))
    dispatch(getUserServers(currentUser.id))
  }, [dispatch, currentUser])

  useEffect(() => {
    socket = io();

    if (socket && currentUser) {
      socket.on("newServer", (server) => {
        dispatch(getUserServers(currentUser.id))
      })
    }
    // when component unmounts, disconnect
    return (() => socket.disconnect())
  }, [dispatch, currentUser])



  if (!currentUser || !userFriends || !userServers) {
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

  // placeholder function
  const handleOptions = (e) => {
    e.preventDefault();
    window.alert('More Options Feature Coming Soon!');
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
          socket.emit('newServer', res)
          history.push(`/private-messages/${res.id}/${res.channels[0].id}`)
        })
    }



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


  return (
    <div>
      <div className='friendslist-container'>
        <div className="spacing-add-friend">
          <div className='friendslist-header-container'>
            <i className="fa-solid fa-user-group" />
            <div className='friendslist-friends'> Friends </div>
            <div className="friendlist-opts">
              <div className='friendslist-all' onClick={openAllFriends}> All </div>
              <div className='friendslist-pending all' onClick={openPending}>Pending</div>
              <div className='friendslist-sugg all' onClick={openSuggestions}>Suggestions</div>
              <div className='friendslist-blocked all'> Blocked </div>
            </div>
          </div>
          <div className="add-friend-btn">
            <span className="add-friend-txt">Add Friend</span>
          </div>
        </div>
        <div className='friendslist-user-container-1'> All Friends — {userFriends.length} </div>
        {userFriends.map(friend => (
          <div className='friendslist-user-container' key={`friend${friend.user.id}`} >
            <div className='friendslist-pic-username' onClick={() => handleDM(friend.user)}>
              <div>
                <img className='friendslist-profile-image' src={friend.user.prof_pic ? friend.user.prof_pic : logo} alt='profile_pic_user' />
              </div>
              <div className='friendslist-username'> {friend.user.username.split("#")[0]} </div>
              <div className='friendslist-tag'> #{friend.user.username.split("#")[1]} </div>
            </div>

            <div className='friendslist-chat-icon'>
              <div className='icon-hover' onClick={() => handleDM(friend.user)}> <i className="fa-solid fa-message" /> </div>
              <div className='icon-hover' onClick={handleOptions}> <i className="fa-solid fa-ellipsis-vertical" /></div>
            </div>
          </div>
        )
        )}

      </div>
    </div>
  )
}
