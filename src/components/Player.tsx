/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, Fragment } from "react";
import { useWidth } from "../customHooks";
import { displayTrackText, getAlbumArt, ITrack } from "../model/track";
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import styled from 'styled-components'

export enum EPlayMode{
    Normal,
    Mini
}

interface IPlayer{
    streamURL: string;
    currentTrack: ITrack;
    nextTrack: ITrack;
    playMode: EPlayMode;
}

const FooterPlay = styled.div`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 80px;
    background: ${props=> props.theme.player};
    border-top: 2px solid #afa8e7;
    font-family: "klavika-bold";
    z-index: 10000;
`;

export const Player:React.FC<IPlayer> = ({streamURL, currentTrack, nextTrack, playMode}: IPlayer) => {
    const [windowState, listen, cleanUp] = useWidth([{ name: "mobile", maxValue: 800 }, { name: "desktop", maxValue: 100000 }]);
    const [isPlaying, setIsPlaying] = useState(false);
    const stream = useRef(new Audio());
    const volumeSlider = useRef<HTMLInputElement>();
    const [sliderClass, setSliderClass] = useState("slider");
    const [isMuted, setIsMuted] = useState(false);
    const [currentImgSrc, setCurrentImgSrc] = useState("/radio/page_elements/logo.png");

    useEffect(()=>{
        if(iOS()){
            document.body.addEventListener('touchstart', function() { //mert az apple egy retkes buzi
                stream.current.src = streamURL;
                stream.current.play();
                stream.current.pause();
            }, { once: true });
        }
        listen();
        volumeSlider.current.onmouseenter = ()=>{ 
            const x=window.scrollX;
            const y=window.scrollY;
            window.onscroll=function(){ window.scrollTo(x, y); };

         }
        volumeSlider.current.onmouseleave = ()=>{ window.onscroll = function(){  } }
        return ()=>{
            cleanUp();
            window.onscroll = function(){  }
        }
    }, []);

    useEffect(()=>{
        if(currentTrack != null) setCurrentImgSrc(getAlbumArt(currentTrack));    
    }, [currentTrack]);

    useEffect(()=>{
        if(isPlaying){
            startPlay();
        } else {
            stopPlay();
        }
    }, [isPlaying]);

    useEffect(()=>{
        if(isMuted){
            stream.current.volume = 0;
            setSliderClass("muted-slider");
        } else {
            stream.current.volume = parseFloat(volumeSlider.current.value);
            setSliderClass("slider");
        }
    }, [isMuted]);

    function iOS() {
        return [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod'
        ].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      }

    const updateVolume = () =>{
        stream.current.volume = parseFloat(volumeSlider.current.value);
        if(isMuted && parseFloat(volumeSlider.current.value) > 0) setIsMuted(false);
        if(parseFloat(volumeSlider.current.value) === 0) setIsMuted(true);
    }

    const onSliderWheel = (e) => {
        if(e.deltaY < 0){
            volumeSlider.current.value = (parseFloat(volumeSlider.current.value) + 0.1).toString();
        } else {
            volumeSlider.current.value = (parseFloat(volumeSlider.current.value) - 0.1).toString();
        }
        updateVolume();
    }

    const startPlay = ()=>{
        stream.current.src = streamURL;
        //stream.current.autoplay = false;
        stream.current.play();
        if(isMuted){
            stream.current.volume = 0;
        } else {
            stream.current.volume =  parseFloat(volumeSlider.current.value);
        }
        
    }
    const stopPlay = ()=>{
        stream.current.pause();
        //stream.current.src = "";
    }
    return (
        <Fragment>
                {playMode === EPlayMode.Normal ?
                (<Fragment>{windowState.name === "desktop" ?
                (<FooterPlay>
                    <div className="divinfooter">
                        <Link to={`/radio/history?kereses=${encodeURIComponent(displayTrackText(currentTrack))}`} >
                            <img src={currentImgSrc} onError={()=>{ setCurrentImgSrc("/radio/page_elements/logo.png") }} className="imageinfooter" alt="Logo"/>
                        </Link>
                        <div className="footertextdiv">
                            <Link to={`/radio/history?kereses=${encodeURIComponent(displayTrackText(currentTrack))}`} >
                                <h1 className="titleinfooter">
                                    {currentTrack == null ? 
                                    (<span>Betöltés...</span>):
                                    (<span> {displayTrackText(currentTrack)}</span>)}
                            
                                </h1>
                            </Link>
                        
                            <Link to={`/radio/history?kereses=${encodeURIComponent(displayTrackText(nextTrack))}`} >
                                <h2 className="nexttrackinfooter">Következő: 
                                {nextTrack == null ?
                                (<span>Betöltés...</span>):
                                (<span> {displayTrackText(nextTrack)}</span>)}
                                </h2>
                            </Link>
                        </div>
                    </div>
                    
                    {isPlaying ?
                    (<button onClick={()=>{ setIsPlaying(false) }} className="playbutton pausebutton"><FontAwesomeIcon className="playbuttonimg pause-icon" icon={faPause} /></button>):
                    (<button onClick={()=>{ setIsPlaying(true) }} className="playbutton"><FontAwesomeIcon className="playbuttonimg" icon={faPlay} /></button>)
                    }
                    <div className="volumediv">
                        {isMuted ? 
                        (<img onClick={()=>{ setIsMuted(false) }} src="/radio/page_elements/muted_volume_icon.png" className="volumeicon" alt="Volume" />):
                        (<img onClick={()=>{ setIsMuted(true) }}  src="/radio/page_elements/volume_icon.png" className="volumeicon" alt="Volume" />)}        
                        <input name="slider" ref={volumeSlider} onWheel={onSliderWheel} onChange={updateVolume} type="range" min={0} max={1} step={0.01} className={sliderClass} />
                    </div>
                </FooterPlay>):
                (<FooterPlay>
            
                {isPlaying ?
                (<button onClick={()=>{ setIsPlaying(false) }} className="playbutton-mobile"><img src="/radio/page_elements/Pause.png" className="playbuttonimg-mobile" alt="Play"/></button>):
                (<button onClick={()=>{ setIsPlaying(true) }} className="playbutton-mobile"><img src="/radio/page_elements/Play.png" className="playbuttonimg-mobile" alt="Play"/></button>)
                }
                <div className="volumediv">
                    {isMuted ? 
                    (<img onClick={()=>{ setIsMuted(false) }} src="/radio/page_elements/muted_volume_icon.png" className="volumeicon" alt="Volume" />):
                    (<img onClick={()=>{ setIsMuted(true) }}  src="/radio/page_elements/volume_icon.png" className="volumeicon" alt="Volume" />)}        
                    <input ref={volumeSlider} onWheel={onSliderWheel} onChange={updateVolume} type="range" min={0} max={1} step={0.01} className={sliderClass} />
                </div>
            </FooterPlay>)} </Fragment>):
            (<div className="mini-container">
                {isPlaying ?
                (<button onClick={()=>{ setIsPlaying(false) }} className="playbutton-mini pausebutton-mini"><FontAwesomeIcon className="playbuttonimg pause-icon" icon={faPause} /></button>):
                (<button onClick={()=>{ setIsPlaying(true) }} className="playbutton-mini"><FontAwesomeIcon className="playbuttonimg" icon={faPlay} /></button>)
                }
                <div className="mini-text">
                        <div className="mini-current" >
                            <h1 className="titleinfooter">
                                {currentTrack == null ? 
                                (<span>Betöltés...</span>):
                                (<span> {displayTrackText(currentTrack)}</span>)}                            
                            </h1>
                        </div>
                        
                        <div className="mini-next" >
                            <h2 className="nexttrackinfooter">Következő: 
                            {nextTrack == null ?
                            (<span>Betöltés...</span>):
                            (<span> {displayTrackText(nextTrack)}</span>)}
                            </h2>
                        </div>
                </div>
                <div className="mini-slider-container">
                    <input id="slider" name="slider" ref={volumeSlider} onWheel={onSliderWheel} onChange={updateVolume} type="range" min={0} max={1} step={0.01} className={`mini-slider ${sliderClass}`} />
                </div>
            </div>)}
            
        </Fragment>
        
    )
}

export default Player;