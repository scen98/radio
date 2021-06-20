/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState} from 'react'
import { useGET } from '../customHooks';
import { ITrack, trackFactory } from '../model/track';
import Track from './Track';
import TrackRow from './TrackRow';

interface ILatest{
    limit: number;
}

export const Latest: React.FC<ILatest> = ({limit}) => {
    const fetchData = useGET(`/radio/api/newesttracksapi.php?limit=${limit}`);
    const [latest, setLatest] = useState<ITrack[]>([]);
    
    useEffect(()=>{
        requestLatest();
    }, []);

    const requestLatest = async ()=>{
        const trackData = await fetchData();
        if(trackData){
            setLatest(trackFactory(trackData));
        }
    }
    return (
        <div>
            {latest.slice(0, 1).map(t=>{
                return <Track track={t} key={`latest-track-highlight-${t.trackId}`} />
            })}
            {latest.slice(1).map(t=>{
                return <TrackRow key={`latest-track-${t.trackId}-${t.dateAdded.getTime()}-${t.id}`} track={t} />
            })}
        </div>
    )
}

export default Latest;