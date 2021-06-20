/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ITrack, ITrackStat } from '../model/track'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { areDatesOnTheSameDay, days, getLastXWeekEndings, getLast7Days } from '../model/dateHelper';
import { useRatio } from '../customHooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import dateformat from "dateformat";


interface IWeeklyChart {
    tracks: ITrack[];
}

interface IWeekSelection {
    lastDayOfWeek: Date;
    title: any;
}

const getOneWeekBefore = (date: Date) => {
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() - 7);
    return newDate;
}

const generateWeekSelection = () =>{
    const weekEndings = getLastXWeekEndings(8);
    const addedWeeks: IWeekSelection[] = [];
    for(let i = 0; i < weekEndings.length; i++){
        addedWeeks.push(createWeekSelection(i, weekEndings));
    }
    addedWeeks[addedWeeks.length - 1].title = <Fragment>a héten</Fragment>;
    return addedWeeks;
}

const createWeekSelection = (index: number, weekEndings: Date[]) => {
    const before = getOneWeekBefore(weekEndings[index]);
    const selection: IWeekSelection = {
        lastDayOfWeek: weekEndings[index],
        title: <Fragment><span>{`${weekEndings.length - index - 1} hete`}</span><br/><span>{`${dateformat(before, "mm. dd.")} - ${dateformat(weekEndings[index], "mm. dd.")}`}</span></Fragment>
    }
    return selection;
}

export const WeeklyChart: React.FC<IWeeklyChart> = ({ tracks }) => {
    const [trackStats, setTrackStats] = useState<ITrackStat[]>([]);
    const [chart, listen, cleanup] = useRatio<HTMLDivElement>(0.565);
    const weeks = useRef<IWeekSelection[]>(generateWeekSelection())
    const [selectedWeek, setSelectedWeek] = useState<IWeekSelection>(null)

    useEffect(() => {
        listen();
        setSelectedWeek(weeks.current[weeks.current.length - 1]);
        return () => {
            cleanup();
        }
    }, []);
   
    useEffect(() => {
        if (selectedWeek == null || tracks.length < 1) {
            return;
        }
        const week: Date[] = getLast7Days(selectedWeek.lastDayOfWeek);
        const stats = week.map(d => {
            return {
                date: d,
                dayName: days[d.getDay()].slice(0, 3),
                count: tracks.filter(t => areDatesOnTheSameDay(t.datePlayed, d)).length
            }
        });
        setTrackStats(stats);
    }, [tracks, selectedWeek]);

    const getMaxValue = () => {
        const counts = trackStats.map(t => t.count);
        const max = Math.max(...counts);
        return max + 1;
    }

    const CustomTooltip = ({ payload, label, active }) => {
        if (active) {
            const dayName = days.find(d => d.includes(label));
            const relevantDate = payload[0].payload.date;
            const playTimes = tracks
                                .filter(t=> areDatesOnTheSameDay(relevantDate, t.datePlayed))
                                .map(d=> dateformat(d.datePlayed, "HH:MM"))
                                .reverse();
            return (
                <div style={{ textAlign: "center" }}>
                    {dayName}: {payload[0].value}
                    <br/>
                    {playTimes.map(p=>{
                        return <Fragment key={`played-${p}`}><span>({p})</span><br/></Fragment>
                    })}
                </div>
            );
        }
        return null;
    }

    const nextWeek = () =>{
        const index = weeks.current.indexOf(selectedWeek);
        if(index === weeks.current.length - 1){         
            setSelectedWeek(weeks.current[0]);
        } else {
            setSelectedWeek(weeks.current[index + 1]);
        }
    }

    const prevWeek = () => {
        const index = weeks.current.indexOf(selectedWeek);
        if(index === 0){
            setSelectedWeek(weeks.current[weeks.current.length - 1]);
        } else {
            setSelectedWeek(weeks.current[index - 1]);
        }
    }

    return (
        <Fragment>
            <div className="dia-title">
                <button onClick={prevWeek}><FontAwesomeIcon icon={faChevronLeft} /></button>
                <div>Lejátszások {selectedWeek == null ? "" : selectedWeek.title}</div>
                <button onClick={nextWeek}><FontAwesomeIcon icon={faChevronRight} /></button>
                </div>
            <div ref={chart} className="dia-container">
                {selectedWeek != null && tracks.length > 0 ?
                    (<ResponsiveContainer height="100%" width="100%" className="dia" >
                        <BarChart style={{ marginLeft: "-30px"}} data={trackStats} >
                            <XAxis dataKey="dayName" stroke="white" />
                            <YAxis type="number" domain={[0, getMaxValue()]} allowDecimals={false} stroke="white" />
                            <Bar dataKey="count" fill="rgba(255, 255, 255, 0.5)" />
                            <Tooltip content={CustomTooltip} wrapperStyle={{ width: 100, backgroundColor: '#23acd6', padding: 2, borderRadius: 10 }} cursor={{ fill: 'rgba(52, 52, 215, 0.3)' }} />
                        </BarChart>
                    </ResponsiveContainer>) :
                    (<Fragment></Fragment>)}

            </div>
        </Fragment>
    )
}

export default WeeklyChart;