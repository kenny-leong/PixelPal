

// Action Creators
const getFriends = (friends) => ({
  type: "GET_ALL_FRIENDS",
  friends
});

const getStrangers = (strangers) => ({
  type: "GET_NON_FRIENDS",
  strangers
});

// const  addFriend = (friend) => ({
//   type: ADD_FRIEND,
//   friend
// })

// const deleteFriend = () => ({
//   type: DELETE_FRIEND
// })


// *************************** Thunks ***********************************


export const getUserFriends = (userId) => async (dispatch) => {
  const response = await fetch(`/api/friends/users/${userId}`)

  if (response.ok) {
    const friendObjs = await response.json();
    dispatch(getFriends(friendObjs.friends));
    return friendObjs.friends
  }
}


export const getNonFriends = () => async (dispatch) => {
  const response = await fetch(`/api/friends/users/not_friends`)

  if (response.ok) {
    const nonFriends = await response.json();
    dispatch(getStrangers(nonFriends.non_friends));
    return nonFriends.non_friends;
  }
}

export const sendFriendReq = (friendId) => async (dispatch) => {
  const response = await fetch(`/api/friends/users/${friendId}/add`)

  if (response.ok) {
    const resMsg = await response.json();
    return resMsg;
  }
}





// ************************** Friend Reducer ****************************

let initialState = {}

export default function friendsReducer( state = initialState, action) {
  switch(action.type) {
    case "GET_ALL_FRIENDS":
      return {
        ...state,
        userFriends: action.friends
      }
    case 'GET_NON_FRIENDS':
      return {
        ...state,
        strangers: action.strangers
      }
    default:
      return state;
  }
}
