// ----------------------------------- constants ----------------------------------------
const LOAD_SERVERS = 'servers/load_all'
const LOAD_SERVER = 'servers/load_one'
const ADD_SERVER = 'servers/create'
const EDIT_SERVER = 'servers/edit'
const DELETE_SERVER = 'servers/delete'
const ADD_SERVER_MEMBER = 'servers/members/add'
const DELETE_SERVER_MEMBER = 'servers/members/add'

// ----------------------------------- action creators ----------------------------------------
const loadServers = (servers) => ({
  type: LOAD_SERVERS,
  servers
});

const loadServer = (server) => ({
  type: LOAD_SERVER,
  server
});

const loadUserServers = (serverArr) => ({
  type: 'LOAD_USER_SERVERS',
  serverArr
});

const createServer = server => ({
  type: ADD_SERVER,
  server
});

const updateServer = server => ({
  type: EDIT_SERVER,
  server
});

const removeServer = (id) => ({
  type: DELETE_SERVER,
  serverId: id
});

const createServerMember = () => ({
  type: ADD_SERVER_MEMBER
});

const removeServerMember = () => ({
  type: DELETE_SERVER_MEMBER
});


// ----------------------------------- thunk action creators ----------------------------------------

// GET ALL SERVERS
export const getServers = () => async (dispatch) => {
  const response = await fetch('/api/servers');

  if (response.ok) {
    const servers = await response.json();
    dispatch(loadServers(servers));
  }
};

// GET SINGLE SERVER BY ID
export const getServer = (id) => async (dispatch) => {
  const response = await fetch(`/api/servers/${id}`);

  if (response.ok) {
    const server = await response.json();
    delete server["channels"];
    dispatch(loadServer(server));
    return server;
  }
}

// GET ALL SERVERS USER IS A PART OF
export const getUserServers = (userId) => async (dispatch) => {
  const res = await fetch(`/api/servers/users/${userId}/servers`);

  if (res.ok) {
    const serverArr = await res.json();
    dispatch(loadUserServers(serverArr));
    return serverArr;
  }
}



// ADD A NEW SERVER
export const addServer = (name, owner_id, status, username, server_picture) => async (dispatch) => {
  const response = await fetch('/api/servers', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      owner_id,
      status,
      server_picture
    })
  })

  if (response.ok) {
    const newServer = await response.json();

    const responseChannels = await fetch('/api/channels', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: "General dicussion",
        name: "general",
        server_id: newServer.id
      })
    })

    if (responseChannels.ok) {
      const newChannel = await responseChannels.json();

      const responseMembers = await fetch(`/api/servers/${newChannel.serverId}/members`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username
        })
      })

      if (responseMembers.ok) {
        const data = await responseMembers.json();
        dispatch(createServer(data));
        return data;
      }
    }
  }
}



// ADD A NEW PRIVATE SERVER
export const addPrivateServer = (name, owner_id, status, username, friendUsername, server_picture) => async (dispatch) => {
  const response = await fetch('/api/servers', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      owner_id,
      status,
      server_picture
    })
  })

  if (response.ok) {
    const newServer = await response.json();

    const responseChannels = await fetch('/api/channels', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: "General dicussion",
        name: "general",
        server_id: newServer.id
      })
    })

    if (responseChannels.ok) {
      const newChannel = await responseChannels.json();

      await fetch(`/api/servers/${newChannel.serverId}/members`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username
        })
      })

      const responseMember2 = await fetch(`/api/servers/${newChannel.serverId}/members`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: friendUsername
        })
      })

      if (responseMember2.ok) {
        const data = await responseMember2.json();
        dispatch(createServer(data));
        return data;
      }
    }
  }
}


// EDIT A SERVER //
export const editServer = (serverId, server) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(server)
  })

  if (response.ok) {
    const data = await response.json();
    dispatch(updateServer(data));
    return data;
  }
}

// DELETE A SERVER //

export const deleteServer = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" }
  })

  if (response.ok) {
    dispatch(removeServer(serverId));
    return null;
  }
}


// ADD SERVER MEMEBER //

export const addServerMember = (serverId, user) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/members`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })

  if (response.ok) {
    dispatch(createServerMember());
    return null;
  }
}

// REMOVE SERVER MEMEBER //

export const deleteServerMember = (serverId, user) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/members`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })

  if (response.ok) {
    dispatch(removeServerMember());
    return null;
  }
}


// ----------------------------------- reducer ----------------------------------------

let initialState = {}

export default function serverReducer(state = initialState, action) {
  switch (action.type) {

    case LOAD_SERVERS: {
      const allServers = {};
      const serverArr = action.servers;
      serverArr.forEach(server => {
        allServers[server.id] = server;
      })
      return {
        ...state,
        allServers: allServers
      }
    }

    case LOAD_SERVER: {
      const currentServer = {};
      currentServer[action.server.id] = action.server;
      return { ...state, currentServer: { ...action.server } };
    }


    case 'LOAD_USER_SERVERS':
      const userServers = {};
      const serverArr = action.serverArr;
      serverArr.forEach(server => {
        userServers[server.id] = server;
      });
      return {
        ...state,
        userServers: userServers
      }

    case ADD_SERVER: {
      return {
        ...state,
        newServer: {
          ...action.server
        }
      }
    }

    case EDIT_SERVER: {
      return {
        ...state,
        currentServer: { ...state.currentServer, [action.server.id]: action.server }
      }
    }

    case DELETE_SERVER: {
      const newState = { ...state }
      return newState;
    }

    case ADD_SERVER_MEMBER: {
      return { ...state };
    }

    case DELETE_SERVER_MEMBER: {
      return { ...state };
    }

    default:
      return state;
  }
}
