import { days } from "./dateHelper";

export interface IShowsJson{
    shows: IShowJson[];
    days: string[];
}


interface IShowJson{
    name: string;
    desc: string;
    start: number;
    end: number;
    days: number[];
}

export interface IShow{
    name: string;
    desc: string;
    start: number;
    end: number;
    days: string[];
}

export const showFactory = (showsJson: IShowsJson): IShow[] =>{
    const shows = showsJson.shows.map(s=> {
        return {
            name: s.name,
            desc: s.desc,
            start: s.start,
            end: s.end,
            days: s.days.map(d=> days[d])
        }
    });
    shows.sort(compareShowsByStart);
    return shows;
}

const compareShowsByStart = (show1: IShow, show2: IShow): number =>{
    if(show1.start > show2.start) return 1;
    if(show1.start < show2.start) return -1;
    return;
}