import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserServers } from "../../store/server";


function DirectMessageBar() {

    const history = useHistory();
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.session.user)
    const userServers = useSelector(state => state.server.userServers)

    useEffect(() => {
        dispatch(getUserServers(currentUser.id))
      }, [dispatch, currentUser.id])

    const handleDMOpen = (server) => {
        history.push(`/private-messages/${server.id}/${server.channels[0].id}`);
    }

    if (!currentUser || !userServers) {
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


    return (
        <>
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
                    <div className="private-dm-container" onClick={() => handleDMOpen(server)}>
                        <img src={server.server_picture} alt='private-dm-pic' className="dm-picture"/>
                        <span className="dm-name">{server.name}</span>
                    </div>
                ))}
                </div>
            </div>
        </>
    )

}



export default DirectMessageBar;
