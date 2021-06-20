import React from 'react'
import { Link } from "react-router-dom"
import MobileHeader from './MobileHeader';
import { ITrack } from '../model/track';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faMoon as emptyMoon } from "@fortawesome/free-regular-svg-icons"
import styled from 'styled-components'
import { useWindow } from '../customHooks';

interface IHeader{
    currentTrack: ITrack;
    nextTrack: ITrack;
    isNightModeOn: boolean;
    setIsNightModeOn: (isOn: boolean) => void;
}

const TopNav = styled.div`
  display: inline;
  overflow: hidden;
  z-index: 9999;
  padding-left: 15px;
  padding-right: 15px;
  text-decoration: none;
  a{
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 30px 20px;
    text-decoration: none;
    font-size: 22px;
    font-family: "klavika-bold";
  }
  a:hover{
    color: ${props => props.theme.fontColor};
    transition: 0.8s;
    text-shadow: 1px 1px 2px ${props => props.theme.textShadow}, 0 0 25px ${props => props.theme.textShadow}, 0 0 5px ${props => props.theme.textShadow};
  }
`;

export const Header: React.FC<IHeader> = ({currentTrack, nextTrack, isNightModeOn, setIsNightModeOn}) => { 
    const mobile = useWindow(800);

    return (
        <header>
        {!mobile ?        
        (<div className="header-grid">
            <Link to="/radio/">
                <img src="/radio/page_elements/logo.png" className="logo" alt="Logo"/>
            </Link>
            <TopNav>
                <Link to="/radio" >Főoldal</Link>
                <Link to="/radio/history?kereses=" >Játszott</Link>
                <Link to="/radio/musor">Műsorok</Link>
                <Link to="/radio/kapcsolat">Kapcsolat</Link>
                <div className="night-mode-nav" onClick={()=>{ setIsNightModeOn(!isNightModeOn) }} ><FontAwesomeIcon className="night-icon" icon={isNightModeOn ? faMoon : emptyMoon} /></div>
            </TopNav>
        </div>):
        (<MobileHeader currentTrack={currentTrack} nextTrack={nextTrack} isNightModeOn={isNightModeOn} setIsNightModeOn={(isOn)=>{ setIsNightModeOn(isOn) }} />)}
       
    </header>
    )
}

export default Header;