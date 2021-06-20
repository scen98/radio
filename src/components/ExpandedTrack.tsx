/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, Fragment, useEffect, useContext, useRef } from 'react'
import { displayTrackText, getAlbumArt, getFirstArtist, IApiTrackResponse, ILyricsCall, isTrackDefault, isTrackSong, ITrack, trackFactory } from '../model/track'
import dateFormat from "dateformat"
import { faYoutube, faSpotify, faSearchengin } from '@fortawesome/free-brands-svg-icons';
import { faCalendarCheck, faChevronUp, faMicrophoneAlt, faMusic, faPlayCircle, faScroll, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom"
import { getBillboardByTitle, IBillboardInfo, searchBillboard } from '../model/billboardManager';
import { BillboardContext } from '../BillboardProvider';
import BillboardBox from './BillboardBox';
import WeeklyChart from './WeeklyChart';
import extractColors from 'extract-colors'
import { useGET } from '../customHooks';


interface IExpandedTrack {
    track: ITrack;
    onClick: () => void;
}

export const ExpandedTrack: React.FC<IExpandedTrack> = ({ track, onClick }) => {
    const [imgSrc, setImgSrc] = useState(getAlbumArt(track));
    const [billboardInfo, setBillboardInfo] = useState<IBillboardInfo>({ hot: undefined, top: undefined, artist: undefined, allTimeArtist: undefined });
    const { hot, top, artists, allTimeArtists } = useContext(BillboardContext);
    const [displayBillboard, setDisplayBillboard] = useState(false);
    const fetchData = useGET();
    const [tracks, setTracks] = useState<ITrack[]>([]);
    const [mainStyle, setMainStyle] = useState({ background: "", boxShadow: "", border: "" });
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setImgSrc(getAlbumArt(track));        
    }, [track.trackId]);

    useEffect(() => {
        imgRef.current.addEventListener("load", () => {
            extractColors(imgSrc).then((colors) => {
                setMainStyle(generateMainStyles(colors));
            });
        });
    }, [imgSrc]);

    function generateMainStyles(colors) {
        if(isTrackDefault(track)){
            return defaultTrackStyle();
        }
        if(colors.length === 1 && colors[0].hex === "#ffffff"){
            return defaultTrackStyle();
        }
        const newStyle = { background: "", boxShadow: "", border: "" };
        if (colors.length > 2) {
            newStyle.background = `linear-gradient(to bottom, ${colors[0].hex}, ${colors[1].hex})`;
        } else {
            newStyle.background = colors[0].hex;
        }
        newStyle.boxShadow = `0 0 10px ${colors[0].hex}`;
        newStyle.border = `0.5px solid ${colors[0].hex}`;
        return newStyle;
    }

    function defaultTrackStyle(){
        return { background: "rgba(114, 114, 114, 0.5)", boxShadow: "0 0 10px white", border: "0.5px solid white" };
    }

    useEffect(() => {
        const firstArtist = getFirstArtist(track);
        const hotResult = searchBillboard(hot, track.title, firstArtist);
        const topResults = searchBillboard(top, track.title, firstArtist);
        const artistResults = getBillboardByTitle(artists, firstArtist);
        const allTimeResult = getBillboardByTitle(allTimeArtists, firstArtist);
        setBillboardInfo({
            hot: hotResult,
            top: topResults,
            artist: artistResults,
            allTimeArtist: allTimeResult
        });
        requestTrackData();
    }, [track.trackId]);

    useEffect(() => {
        if (billboardInfo.hot != null || billboardInfo.artist != null || billboardInfo.top != null || billboardInfo.allTimeArtist != null) {
            setDisplayBillboard(true);
        } else {
            setDisplayBillboard(false);
        }
    }, [billboardInfo]);

    const requestTrackData = async () => {
        const response: IApiTrackResponse = await fetchData(`/radio/api/searchbyidapi.php?trackid=${track.trackId}&limit=500`);
        if (response != null) {
            setTracks(trackFactory(response));
        }
    }

    return (
        <div className="expanded-track" style={mainStyle} >
            <div className="expanded-first-row">
                <img ref={imgRef} onClick={onClick} src={imgSrc} alt={"album_art"} onError={()=>{ setImgSrc("/radio/page_elements/logo.png"); }} className="track-img" />
                <div className="expanded-body">
                    <div className="expanded-info">
                        {track.artist !== "" && track.artist !== "Rádio 1" && track.artist !== "Radio 1" ?
                            (<p><FontAwesomeIcon icon={faMicrophoneAlt} className="expanded-icon" />Előadó <br /> <b>{track.artist}</b></p>) :
                            (<Fragment></Fragment>)}
                        <p><FontAwesomeIcon icon={faMusic} className="expanded-icon" />Cím <br /> <b>{track.title}</b></p>
                        {track.datePlayed != null ?
                            (<p><FontAwesomeIcon icon={faPlayCircle} className="expanded-icon" />Játszva <br /> <Link className="expanded-date" to={`/radio/history?kereses=&datum=${dateFormat(track.datePlayed, "yyyy-mm-dd")}`}><b>{dateFormat(track.datePlayed, "yyyy. mm. dd. HH:MM")}</b></Link></p>) :
                            (<Fragment></Fragment>)}
                        {track.dateAdded != null && track.dateAdded.getFullYear() !== 1970 ?
                            (<p><FontAwesomeIcon icon={faCalendarCheck} className="expanded-icon" />Hozzáadva <br /> <b>{dateFormat(track.dateAdded, "yyyy. mm. dd. HH:MM")}</b></p>) :
                            (<Fragment></Fragment>)}
                    </div>
                </div>
            </div>
            <div>
                {isTrackSong(track) ?
                    (<Fragment>
                        {displayBillboard ?
                            (<BillboardBox billboardInfo={billboardInfo} />) :
                            (<Fragment></Fragment>)}
                        <div className="track-logo-container">
                            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent((displayTrackText(track)))}`} target="_blank" rel="noreferrer" className="youtube-link" title="Youtube gyorskeresés"><FontAwesomeIcon icon={faYoutube} /></a>
                            <a href={`https://open.spotify.com/search/${encodeURIComponent(displayTrackText(track))}`} target="_blank" rel="noreferrer" className="spotify-link" title="Spotify gyorskeresés"><FontAwesomeIcon icon={faSpotify} /></a>
                            <a href={`https://search.azlyrics.com/search.php?q=${encodeURIComponent(displayTrackText(track))}`} target="_blank" rel="noreferrer" className="lyrics-link" title="Szöveg gyorskeresés"><FontAwesomeIcon icon={faScroll} /></a>
                            <a href={`https://www.google.com/search?q=${getFirstArtist(track)}`} target="_blank" rel="noreferrer" className="google-link"><FontAwesomeIcon icon={faUserAlt} title="Előadó gyorskeresés" /></a>
                            <Link to={`/radio/history?kereses=${encodeURIComponent(displayTrackText(track))}`} className="quick-search-link" ><FontAwesomeIcon icon={faSearchengin} /></Link>
                        </div>

                        {tracks.length > 0 ?
                            (<Fragment>
                                <WeeklyChart tracks={tracks} />
                            </Fragment>) :
                            (<Fragment></Fragment>)}

                    </Fragment>) :
                    (<Fragment></Fragment>)}
            </div>
            <button onClick={onClick} className="close-button"><FontAwesomeIcon icon={faChevronUp} /></button>
        </div>
    )
}

export default ExpandedTrack