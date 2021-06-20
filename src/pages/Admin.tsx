/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from 'react'
import AutoCompleteInput from '../components/AutoCompleteInput';
import EditTrackRow from '../components/EditTrackRow';
import { useAsyncReference, useGET, useScroll } from '../customHooks';
import { uploadFile } from '../model/caller'
import { ITrack, trackFactory } from '../model/track';

export interface IEmitter{
    number: number;
    emit: number;
}

export default function Admin() {
    const [tracks, setTracks] = useAsyncReference<ITrack[]>([]);
    const fetchData = useGET("");
    const [keyword, setKeyword] = useAsyncReference<string>("");
    const [autoComplete, setAutoComplete] = useState<string[]>([]);
    const perPage = 50;
    const inputRef = useRef<HTMLInputElement>();
    const [selectedTrack, setSelectedTrack] = useState<ITrack>();
    const [lastUploadEmitter, setEmitter] = useState<IEmitter>({ number: 0, emit: 0 });
    const [addScrollListener, removeScrollListener] = useScroll(0.9, requestMoreTracks)
    const [showOnlyImageless, setShowOnlyImageless] = useState(false);

    useEffect(()=>{
        return ()=>{
            removeScrollListener();
        }
    }, []);

    useEffect(()=>{
        requestAutoComplete();
    }, [keyword.current]);

    useEffect(()=>{
        if(showOnlyImageless){
            requestImagelessTracks();
        } else {
            requestTracks(keyword.current);
        }
    }, [showOnlyImageless]);

    const requestTracks = async (search: string)=>{
        const requestedTracks = await fetchData(`/radio/api/searchbynameapi.php?term=${encodeURIComponent(search)}&limit=${perPage}&offset=${0}`);
        if(requestedTracks){
            const newTracks = trackFactory(requestedTracks);
            setTracks(newTracks);
            if(newTracks.length === perPage) addScrollListener();
        }
    }

    const requestImagelessTracks = async ()=>{
        const requestedTracks = await fetchData("/radio/api/noimgtracksapi.php");
        if(requestedTracks){
            setTracks(trackFactory(requestedTracks));
        }
    }

    async function requestMoreTracks(){
        removeScrollListener();
        const requestedTracks = await fetchData(`/radio/api/searchbynameapi.php?term=${encodeURIComponent(keyword.current)}&limit=${perPage}&offset=${tracks.current.length}`);
        if(requestedTracks){
            const newTracks = trackFactory(requestedTracks);
            setTracks([ ...tracks.current, ...newTracks ]);
            if(newTracks.length === perPage) addScrollListener();
        }
    }

    const requestAutoComplete = async ()=>{
        if(keyword.current != null && keyword.current.length > 3){
            const auto = await fetchData(`/radio/api/autocomplete.php?limit=${10}&keyword=${keyword.current}`); 
            if(auto != null) {
                const distinct = [...new Set(auto.records)] as string[]; //ts :))))
                setAutoComplete(distinct);
            }     
        } else {
            setAutoComplete([]);
        }
    }

    const inputFileChange = async (e)=> {
        if(e.target.files.length  === 0){
            return false;
        }
        const formData = new FormData();
        formData.append("trackImg", e.target.files[0], `${selectedTrack.trackId}.jpg`);
        const response = await uploadFile("/radio/api/uploadimg.php", formData);
        if(response.ok){
            setEmitter({ number: selectedTrack.trackId, emit: new Date().getTime() });
        } else {
            alert("Szerver hiba: sikertelen a mentés");
        }
    }

    return (
        <div className="admin-container"> 
            <div className="check-container">
                <input checked={showOnlyImageless} onChange={()=>{ setShowOnlyImageless(!showOnlyImageless); }} type="checkbox" /> 
                <label onClick={()=>{ setShowOnlyImageless(!showOnlyImageless) }} >Csak kép nélküliek mutatása</label>
            </div>
            {!showOnlyImageless ?
            (<AutoCompleteInput value={keyword.current} setValue={setKeyword} onSubmit={(s)=>{ requestTracks(s) }} stringList={autoComplete} />):
            (<Fragment></Fragment>)}  
            <input className="hidden" accept="image/jpeg" ref={inputRef} type="file" onChange={inputFileChange} />
            {tracks.current.map(t=> {
                return <EditTrackRow  key={`track-${t.trackId}`} track={t} onUploadClick={()=>{ inputRef.current.value = ""; setSelectedTrack(t); inputRef.current.click(); }} emitter={lastUploadEmitter} />
            })}
        </div>
    )
}
