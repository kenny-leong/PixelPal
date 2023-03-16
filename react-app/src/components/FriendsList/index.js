// import { Redirect, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// import { logout } from "../../store/session";
import { getAllFriendsThunk } from "../../store/friends";
import EmojisModal from "../EmojisModal/AllEmojisModal";
import './FriendsList.css'

export default function FriendsList() {
  // const history = useHistory();
  const dispatch = useDispatch()

  const currentUserId = useSelector(state => state.session.user.id)

  const allFriends = useSelector(state => state.friends)
  const friendsArr = Object.values(allFriends)
  // console.log('friends Arr with object.values', friendsArr)
  // console.log('friends from dispatching thunk in component', allFriends)

  useEffect(() => {
    dispatch(getAllFriendsThunk(currentUserId))
    // console.log('use effect running to dispatch allfriends thunk')
  }, [dispatch])

//   if (!currentUserId) {
//     return (<Redirect to="/login"/>)
//   }
//   const handleLogout = async (e) => {
//     e.preventDefault()

//     dispatch(logout())
//     .then(history.push("/login"))
// }


  return (
    <div className='friendslist-container'>
      <div className='friendslist-header-container'>
        <i class="fa-solid fa-user-group" />
        <div className='friendslist-friends'> Friends </div>
        <div className='friendslist-all'> All </div>
        {/* <span className='friendslist-addfriend-button'> Add Friend </span> */}
      </div>
      <div className='friendslist-user-container-1'> Online - {friendsArr.length} </div>
      {friendsArr.map(friend => {
        return (
          <div className='friendslist-user-container' key={friend.id}>
            <img className='friendslist-profile-image' src={friend.prof_pic} alt='profile_pic_user' />
            <span className='friendslist-username'> {friend.username.split("#")[0]} </span>
            {/* on hover it should show their tag */}
          </div>
        )
      })}

      <EmojisModal />
      {/* <button onClick={handleLogout}> Logout </button> */}
    </div>
  )
}
