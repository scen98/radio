import React, { createContext, Fragment, useEffect, useState } from 'react'
import { getAllTimeArtists, getArtist100, getHot100, getTop200, IBillboard } from './model/billboardManager'

export interface IBillboardContext{
    hot: IBillboard[];
    top: IBillboard[];
    artists: IBillboard[];
    allTimeArtists: IBillboard[];
}

export const BillboardContext = createContext<IBillboardContext>({ hot: [], top: [], artists: [], allTimeArtists: [] });

export const BillboardProvider: React.FC<React.ReactNode> = ({children}) => {
    const [hot, setHot] = useState<IBillboard[]>([]);
    const [top, setTop] = useState<IBillboard[]>([]);
    const [artists, setArtists] = useState<IBillboard[]>([]);
    const [allTimeArtists, setAllTimeArtists] = useState<IBillboard[]>([]);

    useEffect(()=>{
        requestHot();
        requestTop();
        requestArtists();
        requestAllTimeArtists();
    }, []);

    async function requestHot(){
        setHot(await getHot100())
    }

    async function requestTop(){
        setTop(await getTop200())
    }

    async function requestArtists(){
        setArtists(await getArtist100())
    }

    async function requestAllTimeArtists(){
        setAllTimeArtists(await getAllTimeArtists())
    }

    const state = {
        hot,
        top,
        artists,
        allTimeArtists
    }

    return (
        <BillboardContext.Provider value={state} >
            {children}
        </BillboardContext.Provider>
    )
}

export default BillboardProvider;