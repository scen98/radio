/* eslint-disable react-hooks/exhaustive-deps */
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import { useSwipeable } from 'react-swipeable';
import { displayTrackText, getThumbnailPath, ITrack } from '../model/track';
import styled from "styled-components";

interface IMobileHeader {
    currentTrack: ITrack;
    nextTrack: ITrack;
    isNightModeOn: boolean;
    setIsNightModeOn: (isOn: boolean)=>void;
}

const DropDiv = styled.div`
    background: ${props => props.theme.mobileHeader};
    display: grid;
    grid-template-columns: 80px auto 80px;
    a{
        text-decoration: none;
    }
`;

export const MobileHeader: React.FC<IMobileHeader> = ({ currentTrack, nextTrack, isNightModeOn, setIsNightModeOn }) => {
    const [currentImgSrc, setCurrentImgSrc] = useState("radio/page_elements/logo.png");
    const [menuClass, setMenuClass] = useState("drop-div drop-menu hidden slide-in");
    const menuRef = useRef<HTMLDivElement>();
    const barRef = useRef<HTMLAnchorElement>();
    const isListenerOn = useRef<boolean>(false);

    useEffect(()=>{      
        return ()=>{
            removeClickListener();
        }    
    }, []);

    function addClickListener(){
        if(!isListenerOn.current){
            window.addEventListener("click", handleClickOutside);
            isListenerOn.current = true;
        }
    }

    function removeClickListener(){
        window.removeEventListener("click", handleClickOutside);
    }

    const handleClickOutside = (event) => {
        if(menuRef.current && !menuRef.current.contains(event.target)){
            if(barRef.current && !barRef.current.contains(event.target)){
                hideMenu();
            }     
        }
    }

    const handlers = useSwipeable({
        onSwipedLeft: hideMenu,
    });

    useEffect(() => {
        if (currentTrack) setCurrentImgSrc(getThumbnailPath(currentTrack));
    }, [currentTrack]);

    function hideMenu() {
        if (menuClass.includes("slide-in")) {
            setMenuClass("drop-div drop-menu slide-out");      
        }
    }

    return (
        <Fragment>
            <div {...handlers} className={menuClass} >
                <div ref={menuRef}>               
                <a onClick={() => { setMenuClass("drop-div drop-menu slide-out"); }}><FontAwesomeIcon className="drop-icon drop-x orange" icon={faTimes} /></a>
                <Link onClick={hideMenu} to="/radio" className="drop-div-menu" >Főoldal</Link>
                <Link onClick={hideMenu} to="/radio/history?kereses=" className="drop-div-menu" >Korábban</Link>
                <Link onClick={hideMenu} to="/radio/uj" className="drop-div-menu">Legújabb</Link>
                <Link onClick={hideMenu} to="/radio/nepszeru" className="drop-div-menu" >Népszerű</Link>
                <Link onClick={hideMenu} to="/radio/musor" className="drop-div-menu">Műsorok</Link>
                <Link onClick={hideMenu} to="/radio/kapcsolat" className="drop-div-menu">Kapcsolat</Link>
                <br />
                <Link onClick={hideMenu} to={`/radio/history?kereses=${encodeURIComponent(displayTrackText(currentTrack))}`} className="drop-div-menu" ><i className="orange">Most: </i>{displayTrackText(currentTrack)}</Link>
                <Link onClick={hideMenu} to={`/radio/history?kereses=${encodeURIComponent(displayTrackText(nextTrack))}`} className="drop-div-menu" ><i className="orange">Következik: </i>{displayTrackText(nextTrack)}</Link>
                <div onClick={()=>{ setIsNightModeOn(!isNightModeOn) }} className="switch-text">
                    <span>Sötét mód</span>
                    <label className="switch">
                        <input type="checkbox" checked={isNightModeOn} onChange={()=>{ setIsNightModeOn(isNightModeOn); /* ez a hülyeség tényleg kell ide */ }}  />
                        <span className="switch-slider"></span>
                    </label>                
                </div>
                </div>
            </div>
            <DropDiv>
                <Link to={`/radio/history?kereses=${encodeURIComponent(displayTrackText(currentTrack))}`} >
                    <img src={currentImgSrc} onError={() => { setCurrentImgSrc("/radio/page_elements/logo.png") }} className="header-image" alt="Logo" />
                </Link>
                <div className="drop-title">
                    {currentTrack != null ?
                        (<Fragment>
                            <Link to={`/radio/history?kereses=${encodeURIComponent(displayTrackText(currentTrack))}`} >
                                <p className="header-title">
                                    {currentTrack.title}
                                    <br />
                                    {currentTrack.artist}
                                </p>
                            </Link>
                        </Fragment>) :
                        (<h3>Betöltés</h3>)}
                </div>
                <a ref={barRef} className="drop-icon" onClick={() => { setMenuClass("drop-div drop-menu slide-in"); addClickListener(); }}><FontAwesomeIcon icon={faBars} /></a>
            </DropDiv>
        </Fragment>
    )
}

export default MobileHeader;