/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { getCetTime } from '../model/dateHelper';
import { trackFactory } from '../model/track';
import Track from './Track';
import TrackRow, { DateType } from './TrackRow';
import dateFormat from "dateformat"
import { useGET } from '../customHooks';

interface IMostPopular {
    limit: number;
}

interface IFilterOption {
    name: string;
    date: string;
}

export const MostPopular: React.FC<IMostPopular> = ({ limit }) => {
    const fetchData = useGET("");
    const [mostPopular, setMostPopular] = useState([]);
    const [filterOptions, setFilterOptions] = useState<IFilterOption[]>([]);
    const [selectedFilter, setSelectedFilter] = useState("");

    useEffect(() => {
        if (selectedFilter.length > 0) requestMostPopular(limit, selectedFilter);
    }, [selectedFilter]);

    useEffect(() => {
        fillFilterOptions();
    }, []);
    const requestMostPopular = async (limit: number, from: string) => {
        const trackData = await fetchData(`/radio/api/mostplayedapi.php?limit=${limit}&from=${from}`);
        if (trackData) {
            setMostPopular(trackFactory(trackData));
        }
    }

    const fillFilterOptions = () => {
        const formatString = "yyyy-mm-dd";
        const monthAgo = getCetTime();
        const weekAgo = getCetTime();
        const yearAgo = getCetTime();
        const allTime = new Date("1970-01-01");
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        weekAgo.setDate(weekAgo.getDate() - 7);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        const options: IFilterOption[] =
            [
                {
                    name: "Héten",
                    date: dateFormat(weekAgo, formatString)
                },
                {
                    name: "Hónapban",
                    date: dateFormat(monthAgo, formatString)
                },
                {
                    name: "Évben",
                    date: dateFormat(yearAgo, formatString)
                },

                {
                    name: "Mindig",
                    date: dateFormat(allTime, formatString)
                },
            ];
        setFilterOptions(options);
        requestMostPopular(limit, dateFormat(weekAgo, formatString));
    }

    return (
        <div>
            <select value={selectedFilter} onChange={(e) => { setSelectedFilter(e.target.value) }} className="show-select">
                {filterOptions.map(o => {
                    return <option value={o.date} key={`pop-option-filter-${o.date}`} >{o.name}</option>
                })}
            </select>
            {mostPopular.filter(t => t.artist !== "Radio 1").slice(0, 1).map(t => {
                return <Track track={t} key={`track-row-${t.id}`} />
            })}
            {mostPopular.filter(t => t.artist !== "Radio 1").slice(1).map(t => {
                return <TrackRow track={t} key={`track-row-${t.id}`} dateType={DateType.none} />
            })}
        </div>
    )
}

export default MostPopular;