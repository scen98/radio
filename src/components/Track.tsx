import React, { useState, useEffect, Fragment } from 'react'
import { displayTrackText, getAlbumArt, ITrack } from '../model/track'
import dateFormat from "dateformat"
import ExpandedTrack from './ExpandedTrack'
import { DateType } from './TrackRow'
import styled from 'styled-components'


interface ITrackCompontent {
    track: ITrack;
    dateType?: DateType;
}

const TrackImg = styled.img`
     width: 100%;
    box-shadow: 0 0 15px ${props => props.theme.shadow};
    cursor: pointer;
    transition: 0.4s ease;
  :hover{
   box-shadow: 0 0 45px ${props => props.theme.shadow};
   transform: scale(1.01);
   z-index: 100;;
  }
`;

const TrackTitleBox = styled.h2`
    padding-left: 1%;
    padding-right: 1%;
    margin: 0;
    color: ${props => props.theme.color};
    background: ${props => props.theme.mainRow};   
    padding-top: 10px;
    padding-bottom: 10px;
    word-wrap: break-word;
    text-align: center;
    font-size: 18px;
`;

const TrackRowTime = styled.h2`
    margin: 0;
    color: #fff;
    height: 20px;
    padding-top: 7px;
    padding-bottom: 7px;
    text-align: center;
    font-size: 19px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    background: ${props => props.theme.time};
`;

export const Track: React.FC<ITrackCompontent> = ({ track, dateType }) => {
    const [imgSrc, setImgSrc] = useState("/radio/page_elements/logo.png");
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (track != null) setImgSrc(getAlbumArt(track));
    }, [track]);

    return (
        <Fragment>
            {isExpanded ?
                (<ExpandedTrack track={track} onClick={() => { setIsExpanded(false) }} />) :
                (<div className="track-box">
                    <TrackImg onClick={() => { setIsExpanded(true) }} src={imgSrc} onError={() => { setImgSrc("/radio/page_elements/logo.png") }} className="track-img" alt="Logo" />
                    {track != null ?
                        (<Fragment>
                            <TrackTitleBox className="track-title-box">{displayTrackText(track)}</TrackTitleBox>
                            {track.datePlayed != null ?
                                (<TrackRowTime>
                                    {dateType === DateType.partial ?
                                        (<Fragment>{dateFormat(track.datePlayed, "HH:MM")}</Fragment>) :
                                        (<Fragment>{dateFormat(track.datePlayed, "yyyy. mm. dd. HH:MM")}</Fragment>)}
                                </TrackRowTime>) :
                                (<Fragment></Fragment>)}
                        </Fragment>) :
                        (<Fragment></Fragment>)}
                </div>)}
        </Fragment>

    )
}

export default Track;