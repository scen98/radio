/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react'
import ShowRow from '../components/ShowRow';
import ShowSelector from '../components/ShowSelector';
import Track from '../components/Track';
import { DateType } from '../components/TrackRow';
import { useWidth } from '../customHooks';
import { getCaller } from '../model/caller'
import { getCetTime, getCurrentDay } from '../model/dateHelper';
import { IShow, showFactory } from '../model/show';
import { ITrack } from '../model/track';

interface IShowPage{
    pageData: ITrack[];
}

export const ShowPage: React.FC<IShowPage> = ({pageData})=> {
    const [currentState, listen, cleanUp] = useWidth([{ name: "mobile", maxValue: 800 }, { name: "desktop", maxValue: 100000 }]);
    const [showCaller, signal] = getCaller("/radio/api/show.json");
    const [shows, setShows] = useState<IShow[]>([]);
    const today = getCurrentDay();

    useEffect(()=>{
        requestShows();
        getCetTime();
        listen();
        return ()=>{
            signal.abort();
            cleanUp();
        }
    }, []);

    const requestShows = async ()=>{
        const showData = await showCaller();
        if(showData){
            setShows(showFactory(showData));
        }
    }
    return (
        <Fragment>
            {currentState.name === "desktop" ?
            (<div className="show-page-grid">
                <div>
                    <h1 className="title">Mai műsor</h1>
                        {shows.filter(s=> s.days.includes(today)).map(s=> {
                            return <ShowRow show={s} live={true} key={`live-show-row-${s.name}${s.start}${s.end}`} />
                    })}
                </div>
                <div className="main-show">
                    <ShowSelector shows={shows} />
                </div>
                <div>
                    <div className="side-container">
                        <h1 className="title">Következik</h1>
                        {pageData != null ?
                        (<Track track={pageData[0]} dateType={DateType.partial} />):
                        (<Fragment></Fragment>)} 
                    </div>
                </div>
            </div>):
            (<div className="main">
                   <h1 className="title">Mai műsor</h1>
                        {shows.filter(s=> s.days.includes(today)).map(s=> {
                            return <ShowRow show={s} live={true} key={`live-show-row-${s.name}${s.start}${s.end}`} />
                    })}
                    <ShowSelector shows={shows} />
                    <h1 className="title">Következik</h1>
                        {pageData != null ?
                        (<Track track={pageData[0]} dateType={DateType.partial} />):
                    (<Fragment></Fragment>)} 
            </div>)}
        </Fragment>
       
    )
}

export default ShowPage;