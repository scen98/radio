/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react'
import { useCutter } from '../customHooks';
import { displayTrackText, getThumbnailPath, ITrack } from '../model/track'
import ExpandedTrack from './ExpandedTrack';
import { DateType } from './TrackRow';
import dateFormat from "dateformat"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { IEmitter } from '../pages/Admin';

interface IEditTrackRow{
    track: ITrack;
    onUploadClick: ()=>any;
    emitter: IEmitter;
    dateType?: DateType;
    textLength?: number;
}

export const EditTrackRow: React.FC<IEditTrackRow> = ({track, onUploadClick, emitter, dateType, textLength}: IEditTrackRow)=> {
    const [imgSrc, setImgSrc] = useState("/radio/page_elements/logo.png");
    const [displayText, isDisplayCut, cutDisplayText] = useCutter("", textLength);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(()=>{
        const src = getThumbnailPath(track) + `?${new Date().getTime()}`;
        if(src !== imgSrc) {
                setImgSrc(src);
                cutDisplayText(displayTrackText(track), textLength);
        }
    }, [track]);

    useEffect(()=>{
        if(emitter.number > 0 && emitter.number === track.trackId){
            setImgSrc(getThumbnailPath(track) + `?${new Date().getTime()}`);
            console.log(track.trackId)
        }
    }, [emitter.emit]);

    return (
        <Fragment>
        {isExpanded ?
        (<ExpandedTrack track={track} onClick={()=>{ setIsExpanded(false) }} />):
        (<div className="track-row">
            <div onClick={onUploadClick} className="upload-container">
                <img className="upload-img" src={imgSrc} alt={"album_art"} onError={()=>{ setImgSrc("/radio/page_elements/logo.png") }} />
                <FontAwesomeIcon className="upload-icon" icon={faCloudUploadAlt} />         
            </div> 
            <div className="track-row-table">
                <div onClick={()=>{ setIsExpanded(true) }} className="track-row-title edit-track">
                    <p>{displayText}</p>
                </div>
                <div className="track-row-time"><p>
                    {track.datePlayed != null ? dateFormat(track.datePlayed, "yyyy. mm. dd. HH:MM") : dateFormat(track.dateAdded, "yyyy. mm. dd. HH:MM")}
                </p></div>
            </div>         
        </div>)}
        </Fragment>
    )
}

export default EditTrackRow;
