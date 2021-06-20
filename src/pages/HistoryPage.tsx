/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react'
import TrackRow, { DateType } from '../components/TrackRow';
import { useAsyncReference, useGET, useScroll, useWindow } from '../customHooks'
import { ITrack, trackFactory } from '../model/track';
import dateFormat from "dateformat"
import AutoCompleteInput from '../components/AutoCompleteInput';
import MostPopular from '../components/MostPopular';
import { changeParam, getParameter, removeParam } from '../urlManager';
import Latest from '../components/Latest';

interface ISearchParams {
    keyword: string;
    date: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useAsyncReference([]);
    const [addScroll, removeScroll] = useScroll(0.8, () => { requestHistory(searchParams.current.keyword, searchParams.current.date, tracksPerPage, history.current.length) });
    const tracksPerPage = 20;
    const [autoComplete, setAutoComplete] = useState<string[]>([]);
    const [searchParams, setSearchParams] = useAsyncReference<ISearchParams>({ keyword: getParameter("kereses"), date: getParameter("datum") });
    const mobile = useWindow(800);
    const [numberOfTracks, setNumberOfTracks] = useState<number>(0);
    const fetchData = useGET("");

    useEffect(() => {
        requestNumberOfTracks();
        return () => {
            removeScroll();
            removeScroll();
        }
    }, []);

    useEffect(() => {
        requestAutoComplete();
        changeParam({ name: "kereses", value: searchParams.current.keyword });
    }, [searchParams.current.keyword]);

    useEffect(() => {
        setHistory([]);
        requestHistory(searchParams.current.keyword, searchParams.current.date, tracksPerPage, history.current.length);
        if (searchParams.current.date != null) {
            changeParam({ name: "datum", value: searchParams.current.date })
        } else {
            removeParam("datum");
        }
    }, [searchParams.current.date]);

    const requestAutoComplete = async () => {
        if (searchParams.current.keyword != null && searchParams.current.keyword.length > 3) {
            const auto = await fetchData(`/radio/api/autocomplete.php?limit=${10}&keyword=${searchParams.current.keyword}`);
            if (auto != null) {
                const distinct = [...new Set(auto.records)] as string[];
                setAutoComplete(distinct);
            }
        } else {
            setAutoComplete([]);
        }
    }

    const requestNumberOfTracks = async () => {
        const num = await fetchData("/radio/api/numberoftracksapi.php");
        if (num != null) {
            setNumberOfTracks(num.numberOfTracks.value);
        }
    }

    const requestHistory = async (keyword: string, date: string, limit: number, offset: number) => {
        removeScroll();
        const trackData = await fetchData(`/radio/api/historyapi.php?limit=${limit}&offset=${offset}&keyword=${encodeURIComponent(keyword)}&date=${date}`);
        if (trackData != null) {
            const newTracks: ITrack[] = trackFactory(trackData);
            setHistory([...history.current, ...newTracks]);
            if (newTracks.length === tracksPerPage) {
                addScroll();
            }
        }
    }

    return (
        <Fragment>
            {!mobile ?
                (<div className="history-grid">
                    <div className="history-div">
                        <h1 className="title">Új a műsoron</h1>
                        <Latest limit={20} />
                    </div>
                    <div className="history-div main-history">
                        <h1 className="title">Korábban szólt</h1>
                        <p className="number-of-tracks-text">Keress a <span>{numberOfTracks}</span> zenénk között:</p>
                        <AutoCompleteInput value={searchParams.current.keyword} setValue={(s) => { setSearchParams({ ...searchParams.current, keyword: s }) }} onSubmit={(s) => { setHistory([]); requestHistory(s, searchParams.current.date, tracksPerPage, history.current.length); }} stringList={autoComplete} />
                        <br />
                        {searchParams.current.date != null && searchParams.current.date !== "null" ?
                            (<Fragment>
                                <input required className="date-input" type="date" value={searchParams.current.date} onChange={(e) => { setSearchParams({ ...searchParams.current, date: dateFormat(new Date(e.target.value), "yyyy-mm-dd") }) }} />
                                <button onClick={() => { setSearchParams({ ...searchParams.current, date: null }) }} className="date-btn" >Minden nap</button>
                            </Fragment>) :
                            (<button onClick={() => { setSearchParams({ ...searchParams.current, date: dateFormat(new Date(), "yyyy-mm-dd") }) }} className="date-btn" >Dátum alapján</button>)}
                        {history.current.map(t => {
                            return <TrackRow track={t} key={`track-row-${t.id}-${t.datePlayed.getTime()}`} dateType={DateType.full} alt={false} />
                        })}
                    </div>
                    <div className="history-div">
                        <h1 className="title">Népszerű</h1>
                        <MostPopular limit={20} />
                    </div>
                </div>) :
                (<div className="main">
                    <h2 className="title">Korábban</h2>
                    <p className="number-of-tracks-text">Keress a <span>{numberOfTracks}</span> zenénk között:</p>
                    <AutoCompleteInput value={searchParams.current.keyword} setValue={(s) => { setSearchParams({ ...searchParams.current, keyword: s }) }} onSubmit={(s) => { setHistory([]); requestHistory(s, searchParams.current.date, tracksPerPage, history.current.length); (document.activeElement as any).blur(); }} stringList={autoComplete} />
                    <br />
                    {searchParams.current.date != null && searchParams.current.date !== "null" ?
                        (<Fragment>
                            <input required className="date-input" type="date" value={searchParams.current.date} onChange={(e) => { setSearchParams({ ...searchParams.current, date: dateFormat(new Date(e.target.value), "yyyy-mm-dd") }) }} />
                            <button onClick={() => { setSearchParams({ ...searchParams.current, date: null }) }} className="date-btn" >Minden nap</button>
                        </Fragment>) :
                        (<button onClick={() => { setSearchParams({ ...searchParams.current, date: dateFormat(new Date(), "yyyy-mm-dd") }) }} className="date-btn" >Dátum alapján</button>)}
                    {history.current.map(t => {
                        return <TrackRow track={t} key={`track-row-${t.id}-${t.datePlayed.getTime()}`} dateType={DateType.full} alt={false} />
                    })}
                </div>)}
        </Fragment>
    )
}
