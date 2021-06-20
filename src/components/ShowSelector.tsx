import React, { useState, useEffect } from 'react'
import { days, getCetTime, orderedDays } from '../model/dateHelper';
import { IShow } from '../model/show'
import ShowRow from './ShowRow';

interface IShowSelector {
    shows: IShow[];
}

export const ShowSelector: React.FC<IShowSelector> = ({ shows }) => {
    const [selectedDay, setSelectedDay] = useState("");
    useEffect(() => {
        const newTime = getCetTime();
        newTime.setDate(newTime.getDate() + 1);
        setSelectedDay(days[newTime.getDay()]);

    }, []);
    return (
        <div>
            <select value={selectedDay} onChange={(e) => { setSelectedDay(e.target.value) }} className="show-select" >
                {orderedDays.map(d => {
                    return <option value={d} key={d} >{d}</option>
                })}
            </select>
            {shows.filter(s => s.days.includes(selectedDay)).map(s => {
                return <ShowRow show={s} live={false} key={`selected-show-${s.name}${s.start}${s.end}`} />
            })}
        </div>
    )
}

export default ShowSelector;