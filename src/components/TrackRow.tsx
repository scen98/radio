/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from 'react'
import { displayTrackText, getThumbnailPath, ITrack } from '../model/track'
import dateFormat from "dateformat"
import ExpandedTrack from './ExpandedTrack';
import styled from 'styled-components'

interface ITrackRow {
    track: ITrack;
    dateType?: DateType;
    textLength?: number;
    alt?: boolean;
}

export enum DateType {
    full,
    partial,
    none
}

const TrackRowTitle = styled.div`
    color: ${props => props.theme.color};
    background: ${props => props.theme.secondaryRow};
    word-wrap: break-word;
    font-weight: bolder;
    height: 60px;
    overflow: hidden;
    position: relative;
    overflow: hidden;
    position: relative;
    p{
        width: 100%;
        padding: 3px;
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        font-size: 18px;
    }
`;

const SimpleTrackRow = styled.div`
   color: ${props => props.theme.color};
    background: ${props => props.theme.secondaryRow};
    word-wrap: break-word;
    text-align: center;
    font-weight: bolder;
    height: 60px;
    overflow: hidden;
    position: relative;
    padding-left: 8px;
    padding-right: 8px;
    overflow: hidden;
    height: 90px;
    position: relative;
    p{
        width: 100%;
        padding: 3px;
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        font-size: 18px;
    }
`;

const TrackRowTime = styled.div`
    height: 30px;
    color: #fff;
    text-align: center;
    font-style: italic;
    background: ${props => props.theme.time};
    p{
        padding-top: 5px;
        font-size: 18px;
    }
`;

export const TrackRow: React.FC<ITrackRow> = ({ track, dateType }) => {
    const [imgSrc, setImgSrc] = useState("/radio/page_elements/logo.png");
    const [isExpanded, setIsExpanded] = useState(false);
    const [mainClass, setMainClass] = useState("track-row");

    useEffect(() => {
        const newSrc = getThumbnailPath(track);
        setImgSrc(newSrc);
    }, [track.trackId]);

    useEffect(() => {
        if (dateType === DateType.none) {
            setMainClass("track-row-title simple-track-row")
        } else {
            setMainClass("track-row-title");
        }
    }, [dateType]);

    return (
        <Fragment>
            {isExpanded ?
                (<ExpandedTrack track={track} onClick={() => { setIsExpanded(false) }} />) :
                (<div onClick={() => { setIsExpanded(true) }} className="track-row">
                    <img src={imgSrc} alt={"album_art"} onError={() => { setImgSrc("/radio/page_elements/logo.png") }} />
                    <div className="track-row-table">
                        {dateType === DateType.none ?
                            (<SimpleTrackRow>
                                <p>{displayTrackText(track)}</p>
                            </SimpleTrackRow>) :
                            (<TrackRowTitle className={mainClass}>
                                <p >{displayTrackText(track)}</p>
                            </TrackRowTitle>)}

                        {dateType !== DateType.none ?
                            (<Fragment> {track != null ?
                                (<TrackRowTime><p>
                                    {dateType === DateType.partial ?
                                        (<Fragment>{track.datePlayed != null ? dateFormat(track.datePlayed, "HH:MM") : dateFormat(track.dateAdded, "HH:MM")}</Fragment>) :
                                        (<Fragment>{track.datePlayed != null ? dateFormat(track.datePlayed, "yyyy. mm. dd. HH:MM") : dateFormat(track.dateAdded, "yyyy. mm. dd. HH:MM")}</Fragment>)}
                                </p></TrackRowTime>) :
                                (<TrackRowTime className="track-row-time"><p>...</p></TrackRowTime>)}</Fragment>) :
                            (<Fragment></Fragment>)}
                    </div>
                </div>)}
        </Fragment>
    )
}

export default TrackRow;