import React, { Fragment, useEffect, useState } from 'react'
import { getCetTime } from '../model/dateHelper';
import { IShow } from '../model/show';

interface IShowRow {
    show: IShow;
    live: boolean;
}

export const ShowRow: React.FC<IShowRow> = ({ show, live }) => {
    const [containerClass, setContainerClass] = useState("show-container");
    const [dateClass, setDateClass] = useState("show-date");
    const [titleClass, setTitleClass] = useState("show-title");
    const [descClass, setDescClass] = useState("show-desc");

    useEffect(() => {
        if (live) {
            setClassess();
        }
    }, []);

    const setClassess = () => {
        const cetHour = getCetTime().getHours();
        if (show.start <= cetHour && show.end > cetHour) {
            setCurrent();
        } else if (show.end <= cetHour) {
            setPrevious()
        }
    }

    const setPrevious = () => {
        setContainerClass("show-container previous-show");
        if (show.desc != null && show.desc.length > 0) {
            setDateClass("show-date previous-date");
            setTitleClass("show-title previous-title");
        } else {
            setDateClass("show-date previous-date descless-date");
            setTitleClass("show-title previous-title descless-title");
        }
    }

    const setCurrent = () => {
        setContainerClass("show-container current-show");
        if (show.desc != null && show.desc.length > 0) {
            setDateClass("show-date current-date");
            setTitleClass("show-title current-title");
            setDescClass("show-desc current-desc")
        } else {
            setDateClass("show-date current-date descless-date");
            setTitleClass("show-title current-title descless-title");
        }

    }

    return (
        <div className={containerClass}>
            <div className="show-grid">
                <div className={dateClass}>
                    {show.start}:00 - {show.end}:00
                </div>
                <div className={titleClass}>
                    {show.name}
                </div>
            </div>
            <div>
                {show.desc != null && show.desc.length > 0 ?
                    (<div className={descClass}>
                        {show.desc}
                    </div>) :
                    (<Fragment></Fragment>)}
            </div>
        </div>
    )
}

export default ShowRow;