import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserFriends, getNonFriends } from "../../store/friends";
import { getUserServers, addPrivateServer } from "../../store/server";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import logo from '../../static/phantasmal-logo-trans.png';
import './Suggestions.css';



function Suggestions() {
  const dispatch = useDispatch()

  const currentUser = useSelector(state => state.session.user);
  const userServers = useSelector(state => state.server.userServers);
  const userFriends = useSelector(state => state.friends.userFriends);
  const strangers = useSelector(state => state.friends.strangers);
  const { closeModal } = useModal();
  const history = useHistory();

  useEffect(() => {
    dispatch(getUserFriends(currentUser.id))
    dispatch(getUserServers(currentUser.id))
    dispatch(getNonFriends())
  }, [dispatch, currentUser.id])


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

  // placeholder function
  const handleOptions = (e) => {
    e.preventDefault();
    window.alert('More Options Feature Coming Soon!');
  }


  // Starts or reopens a DM if previously opened
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
        dispatch(getUserServers(currentUser.id))
				closeModal();
			})
  }

  // open DM in Direct Message Bar
  const handleDMOpen = (server) => {
    history.push(`/private-messages/${server.id}/${server.channels[0].id}`);
  }


  // handles getting all friends
  const openAllFriends = () => {
    history.push(`/channels/@me`);
  }

  // handles getting all friends
  const openSuggestions = () => {
    history.push(`/friends/suggestions`);
  }


  return (
        <div className='friendslist-container'>
            <div className="spacing-add-friend">
                <div className='friendslist-header-container'>
                <i className="fa-solid fa-user-group" />
                <div className='friendslist-friends'> Friends </div>
                <div className="friendlist-opts">
                    <div className='friendslist-all sugg' onClick={openAllFriends}> All </div>
                    <div className='friendslist-pending'>Pending</div>
                    <div className='friendslist-sugg sugg' onClick={openSuggestions}>Suggestions</div>
                    <div className='friendslist-blocked'> Blocked </div>
                </div>
                </div>
                <div className="add-friend-btn">
                    <span className="add-friend-txt">Add Friend</span>
                </div>
            </div>
            <div className='friendslist-user-container-1 sugg'>
                <span>Friend Suggestions — {strangers.length}</span>
            </div>

            {strangers.map(friend => (
                <div className='friendslist-user-container' key={`stranger${friend.id}`} onClick={() => handleDM(friend.username, friend.prof_pic)}>
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
                    <div className='icon-hover' onClick={() => handleDM(friend.username, friend.prof_pic)}> <i className="fa-solid fa-message" /> </div>
                    <div className='icon-hover' onClick={handleOptions}> <i className="fa-solid fa-ellipsis-vertical" /></div>
                    </div>
                </div>
            ))}
        </div>
  )
}



export default Suggestions;
