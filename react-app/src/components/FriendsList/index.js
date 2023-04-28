import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserFriends } from "../../store/friends";
import { getUserServers, addPrivateServer } from "../../store/server";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import './FriendsList.css'

export default function FriendsList() {
  const dispatch = useDispatch()

  const currentUser = useSelector(state => state.session.user)
  const userServers = useSelector(state => state.server.userServers)
  const userFriends = useSelector(state => state.friends.userFriends)
  const { closeModal } = useModal();
  const history = useHistory();

  useEffect(() => {
    dispatch(getUserFriends(currentUser.id))
    dispatch(getUserServers(currentUser.id))
  }, [dispatch, currentUser.id])


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

  console.log(userFriends)


  const handleFriendOptions = (e) => {
    e.preventDefault();
    window.alert('Friend Request Feature Coming Soon!');
  }

  const handleDM = async (friendUsername, friendPic) => {

    const index = friendUsername.indexOf("#");
    const slicedUsername = friendUsername.slice(0, index);

    for (let server of privateServerArr) {
      if (server.name === slicedUsername) {
        return history.push(`/private-messages/${server.id}/${server.channels[0].id}`)
      }
    }

		await dispatch(addPrivateServer(`${slicedUsername}`, currentUser.id, true, currentUser.username, friendUsername, friendPic))
			.then((res) => {
				history.push(`/private-messages/${res.id}/${res.channels[0].id}`)
				closeModal();
			})
  }


  const handleDMOpen = (server) => {
    history.push(`/private-messages/${server.id}/${server.channels[0].id}`);
  }

  const handleOptions = (e) => {
    e.preventDefault();
    window.alert('More Options Feature Coming Soon!');
  }

  return (
    <div>
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
              <div className="private-dm-container" key={`dm${server.id}`} onClick={() => handleDMOpen(server)}>
                <img src={server.server_picture} alt='private-dm-pic' className="dm-picture"/>
                <span className="dm-name">{server.name}</span>
              </div>
          ))}
        </div>
      </div>

      <div className='friendslist-container'>
        <div className='friendslist-header-container'>
          <i className="fa-solid fa-user-group" />
          <div className='friendslist-friends'> Friends </div>
          <div className="friendlist-opts">
            <div className='friendslist-all' onClick={handleFriendOptions}> All </div>
            <div className='friendslist-pending' onClick={handleFriendOptions}> Pending </div>
            <div className='friendslist-sugg' onClick={handleFriendOptions}>Suggestions</div>
            <div className='friendslist-blocked' onClick={handleFriendOptions}> Blocked </div>
          </div>
        </div>
        <div className='friendslist-user-container-1'> All Friends — {userFriends.length} </div>
        {userFriends.map(friend => (
            <div className='friendslist-user-container' key={`friend${friend.user.id}`} onClick={() => handleDM(friend.user.username, friend.user.prof_pic)} >
              <div className='friendslist-pic-username'>
                <div> <img className='friendslist-profile-image' src={friend.user.prof_pic} alt='profile_pic_user' /> </div>
                <div className='friendslist-username'> {friend.user.username.split("#")[0]} </div>
                <div className='friendslist-tag'> #{friend.user.username.split("#")[1]} </div>
              </div>

              <div className='friendslist-chat-icon'>
                <div className='icon-hover' onClick={() => handleDM(friend.user.username, friend.user.prof_pic)}> <i className="fa-solid fa-message" /> </div>
                <div className='icon-hover' onClick={handleOptions}> <i className="fa-solid fa-ellipsis-vertical" /></div>
              </div>
            </div>
          )
        )}

      </div>
    </div>
  )
}
