import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getUserServers } from "../../store/server";
import ServersSidebarItem from "./ServerSidebarItem";
import OpenModalButton from "../OpenModalButton";
import ServerCreateModal from "../ServerCreateModal";
import logo from '../../static/phantasmal-logo-trans.png';
import { useHistory } from "react-router-dom";
import './ServerSidebar.css'

const ServersSidebar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user)
  const [selectedServer, setSelectedServer] = useState(null);
  const servers = useSelector(state => state.server.userServers)

  useEffect(() => {
    dispatch(getUserServers(sessionUser.id))
  }, [dispatch, sessionUser])


  if (!servers) {
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

  const serverArr = Object.values(servers);
  const privateServerArr = serverArr.filter(server => server.status === false);



  const handleServerSelect = (server) => {
    history.push(`/channels/${server.id}/${server.channels[0].id}`)
    setSelectedServer(server.id)
  }

  const returnToChannels = () => {
    history.push(`/channels/@me`)
  }

  const openExplore = () => {
    history.push(`/explore/servers`)
  }

  return (
    <>
      <div className="server-sidebar">
        <div className='server-sidebar-ul'>
          <div className='home-server' onClick={returnToChannels}>
            <img className='server-sidebar-icon home' src={logo} alt='preview'></img>
          </div>

          <div className='server-sidebar-server-group'>
            {
              privateServerArr.map(server => (
                <div key={`server${server.id}`} className={`server-icon-container ${selectedServer === server.id ? "selected" : ""}`}
                  onClick={() => handleServerSelect(server)}
                  title={server.name}
                >
                  <ServersSidebarItem server={server} />
                </div>
              ))
            }
          </div>

          <div className="sep-border"></div>

          <div className='server-sidebar-add-server-btn'>
            <OpenModalButton
              buttonText='+'
              modalComponent={<ServerCreateModal />}
            />
          </div>

          <div className='server-sidebar-explore-servers' onClick={openExplore}>
            <span>
              <i className="fa-solid fa-compass"></i>
            </span>
          </div>

          <div className="padding-server-bar"></div>

        </div>
      </div >
    </>
  )
}

export default ServersSidebar
