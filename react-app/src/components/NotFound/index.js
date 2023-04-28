import React from 'react';
import { useHistory } from 'react-router-dom';
import './NotFoundPageLoggedIn.css';
import notFoundGif from '../../static/portal.gif';
import logo from '../../static/phantasmal-logo-trans.png';

function NotFound ({ sessionUser }) {
    const history = useHistory();

    const returnHome = async (e) => {
        e.preventDefault();
        history.push("/");
    }

    if (sessionUser === null) {
        return null;
    } else {
        return (
            <>
                <div className='not-found-container'>
                    <div className='not-found-top'>
                        <button className='not-found-home-button' onClick={returnHome}>
                            <img className='pixel-pal-logo-black' src={logo} alt="pixel pal white logo" />
                            <h3 className='pixel-pal-logo-text-black'>Phantasmal</h3>
                        </button>
                    </div>
                    <img className='not-found-gif' src={notFoundGif} alt="not found" onClick={returnHome}/>
                    <div className='not-found-text-container'>
                        <h2 className='wrong-turn-text'>LOST WANDERER?</h2>
                        <p className='lost-text'>
                        Ho, traveler! Thou art adrift and seemeth to have lost thy way. But fret not, for I hold the key to thy return. Hearken! What thou needeth is a magic portal that shall transport thee back to the realm thou belongest. Worry not, for I am skilled in the art of portal creation and shall conjure one for thee posthaste. But alas, art thou in a rush and must away?
                        </p>
                        <button className='return-button' onClick={returnHome}>
                            Return to Phantasmal
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

export default NotFound;
