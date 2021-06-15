export interface IBillboardPosition {
    positionLastWeek?: number;
    peakPosition: number;
    weeksOnChart: number;
}

export interface IBillboard {
    rank: number;
    title: string;
    artist: string;
    cover: string;
    position: IBillboardPosition;
}

export interface IBillboardInfo {
    hot: IBillboard | undefined;
    top: IBillboard | undefined;
    artist: IBillboard | undefined;
    allTimeArtist: IBillboard | undefined;
}

export async function getHot100(): Promise<IBillboard[]>{
    return await requestBillboard("hot-100");
}

export async function getTop200(){
    return await requestBillboard("top-200");
}

export async function getArtist100(){
    return await requestBillboard("artist-100");
}

export async function getAllTimeArtists(){
    return await requestBillboard("greatest");
}

export async function requestBillboard(urlPart: string): Promise<IBillboard[]>{
    const response = await fetch(`/billboard/${urlPart}`);
    if(!response.ok){
        return [];
    }
    return await response.json();
}

export function getBillboardByTitle(billboards: IBillboard[], query: string){
    const search = cleanAccents(query);
    return billboards.find(b=> b.title.toLowerCase() === search.toLowerCase());  
}

export function searchBillboard(billboards: IBillboard[], title: string, artist: string){
    const searchTitle = cleanAccents(title);
    const searchArtist = cleanAccents(artist);
    return billboards.find(b=> b.title.toLowerCase().includes(searchTitle.toLowerCase()) && b.artist.toLowerCase().includes(searchArtist.toLowerCase()));
}

function cleanAccents(s: string){
    let r=s.toLowerCase();
    r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
    r = r.replace(new RegExp("æ", 'g'),"ae");
    r = r.replace(new RegExp("ç", 'g'),"c");
    r = r.replace(new RegExp("[èéêë]", 'g'),"e");
    r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
    r = r.replace(new RegExp("ñ", 'g'),"n");                            
    r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
    r = r.replace(new RegExp("œ", 'g'),"oe");
    r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
    r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
    return r;
};