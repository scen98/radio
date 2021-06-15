export interface IApiTrackResponse{
    records: IApiTrackData[];
}

interface IApiTrackData{
    ID: number;
    trackID: number;
    artist: string;
    title: string;
    image: string;
    date_played: string;
    date_added: string;
    value: number;
}

export interface ITrack {
    id: number;
    trackId: number;
    artist: string;
    title: string;
    datePlayed?: Date;
    dateAdded: Date;
    playCount: number;
}

export interface ITrackStat{
    date: Date;
    dayName: string;
    count: number;
}

export interface ILyricsCall {
    songImg: string;
    songImgSm: string;
    artistImg: string;
    url: string;
    trackTitle: string;
    artistName: string;
    lyrics: string;
}

const defaultIds = [1, 2];

export const isTrackDefault = (track: ITrack) =>{
    return defaultIds.includes(track.trackId);
}

export const trackFactory = (rawData: IApiTrackResponse): ITrack[] => {
    return rawData.records.map(t=> {
        return { 
            id: t.ID,
            trackId: t.trackID,
            artist: t.artist,
            title: t.title,
            imageSrc: "/radio/" + t.image,
            datePlayed: t.date_played != null ? new Date(t.date_played.replace(" ", "T")) : null,
            dateAdded: t.date_added != null ? new Date(t.date_added.replace(" ", "T")) : null,
            playCount: t.value,
         }
    });
}

export const getAlbumArt = (track: ITrack): string =>{
    if(isTrackDefault(track)){
        return `/radio/page_elements/logo.png`;
    }
    return `/radio/album_art/${track.trackId}.jpg`;
}

export const getThumbnailPath = (track: ITrack): string =>{
    if(isTrackDefault(track)){
        return `/radio/page_elements/logo.png`;
    }
    return `/radio/album_art_thumbnail/${track.trackId}.jpg`;
}

export const getFirstArtist = (track: ITrack)=>{
    const artistString = track.artist.toLowerCase();
    if(artistString.includes("feat.")){
        const split = artistString.split("feat");
        return split[0].trim();
    }
    if(artistString.includes("&")){
        const split = artistString.split("&");
        return split[0].trim();
    }
    return artistString;
}

export const displayTrackText = (track: ITrack): string =>{
    if(track == null) return "";
    if(track.artist != null){
        return `${track.artist} - ${track.title}`;
    }
    return track.title;
}

export function isTrackSong(track: ITrack){
    return track.artist !== "" && track.artist !== "Rádio 1" && track.artist !== "Radio 1"
}