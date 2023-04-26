import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getServers } from "../../store/server";
import { NavLink } from 'react-router-dom';
import ServersSidebarItem from "./ServerSidebarItem";
import OpenModalButton from "../OpenModalButton";
import ServerCreateModal from "../ServerCreateModal";
import './ServerSidebar.css'

const ServersSidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(getServers(user))
    }
  }, [user, dispatch])

  let servers = useSelector(state => state.server.orderedList)
  if (!servers) return null;


  // sort servers by id
  servers = servers.sort((a, b) => a.id - b.id);

  const handleServerSelect = (server) => {
    setSelectedServer(server.id)
  }

  return (
    <>
        <>
          <div className="server-sidebar">
            <ul className='server-sidebar-ul'>
              <NavLink key='Direct Messages' to={'/channels/@me'}>
                <img className='server-sidebar-icon' src='https://i.redd.it/6jupfeilyhx71.jpg' alt='preview'></img>
              </NavLink>

              <div className='server-sidebar-server-group'>
                {
                  servers.map(server => (
                    <NavLink
                      style={{ textDecoration: 'none' }}
                      key={`server-${server.id}`}
                      to={`/channels/${server.id}/${server.channels[0].id}`}
                    >
                      <div className={`server-icon-container ${selectedServer === server.id ? "selected" : ""}`}
                      onClick={() => handleServerSelect(server)}
                      title={server.name}
                      >
                        <ServersSidebarItem server={server} />
                      </div>
                    </NavLink>
                  ))
                }
              </div>

              <li style={{ listStyle: 'none' }} className='server-sidebar-add-server-btn'>
                <OpenModalButton
                  buttonText='+'
                  modalComponent={<ServerCreateModal />}
                />
              </li>

            </ul>
          </div >
        </>
    </>
  )
}

export default ServersSidebar
