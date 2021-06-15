import React from 'react'
import { ITrack } from '../model/track'

interface IMiniPlayer{
    currentTrack: ITrack;

}

export const MiniPlayer: React.FC<IMiniPlayer> = ({currentTrack}: IMiniPlayer) => {
    return (
        <div className="mini-container">
            
        </div>
    )
}

export default MiniPlayer;