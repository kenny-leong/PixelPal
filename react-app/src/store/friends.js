

// Action Creators
const getFriends = (friends) => ({
  type: "GET_ALL_FRIENDS",
  friends
})

// const  addFriend = (friend) => ({
//   type: ADD_FRIEND,
//   friend
// })

// const deleteFriend = () => ({
//   type: DELETE_FRIEND
// })


// *************************** Thunks ***********************************


export const getUserFriends = (userId) => async dispatch => {
  const response = await fetch(`/api/friends/users/${userId}`)

  if (response.ok) {
    const friendObjs = await response.json();
    dispatch(getFriends(friendObjs.friends));
    return friendObjs.friends
  }
}





// reducer

let initialState = {}

export default function friendsReducer( state = initialState, action) {
  switch(action.type) {
    case "GET_ALL_FRIENDS":
      return {
        ...state,
        userFriends: action.friends
      }
    default:
      return state;
  }
}
