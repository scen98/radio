import React, { Fragment, useEffect } from 'react'
import Track from '../components/Track'
import TrackRow, { DateType } from '../components/TrackRow'
import { useWidth } from '../customHooks'
import { ITrack } from '../model/track'

interface IHome{
    pageData: ITrack[];
}

export const Home: React.FC<IHome> = ({pageData})=> {
    const [currentState, listen, cleanUp] = useWidth([{ name: "mobile", maxValue: 800 }, { name: "desktop", maxValue: 100000 }]);
    useEffect(() => {
        listen();
        return ()=>{
            cleanUp();
        }
    }, [])
    return (
        <Fragment>
            {currentState.name === "desktop" ?
            (<div className="home-grid">
                <div className="main-container">
                    <h1 className="title">Most szól</h1>
                    {pageData != null ?
                    (<Track track={pageData[1]} dateType={DateType.partial} />):
                    (<Fragment></Fragment>)}               
                </div>
                <div className="side-container">
                    <h1 className="title">Következik</h1>
                    {pageData != null ?
                    (<Track track={pageData[0]} dateType={DateType.partial} />):
                    (<Fragment></Fragment>)} 
                </div>
                <div className="side-container">
                    <h1 className="title" >Korábban</h1>
                    {pageData.length > 0 ?
                    (<Fragment>{pageData.slice(2).map(t=>{
                        return <TrackRow track={t} key={`track-row-${t.id}`} dateType={DateType.partial} />
                    })}</Fragment>):
                    (<Fragment></Fragment>)}
                </div>
            </div>):
            (<div className="main">
                 <h1 className="title">Most szól</h1>
                    {pageData != null ?
                    (<Track track={pageData[1]} dateType={DateType.partial} />):
                    (<Fragment></Fragment>)}
                 <h1 className="title">Következik</h1>
                    {pageData != null ?
                    (<Track track={pageData[0]} dateType={DateType.partial} />):
                    (<Fragment></Fragment>)}
                <h1 className="title" >Korábban</h1>
                    {pageData.length > 0 ?
                    (<Fragment>{pageData.slice(2).map(t=>{
                        return <TrackRow track={t} key={`track-row-${t.id}`} dateType={DateType.partial} />
                    })}</Fragment>):
                    (<Fragment></Fragment>)}  
            </div>)}
        </Fragment>
        
        
    )
}

export default Home;