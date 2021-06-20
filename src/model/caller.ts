const def: string = "";
export async function GETAsynch(url: string): Promise<Response>{
    const response = await fetch(def + url, {
        method: "GET",
        cache: "no-cache",
        credentials: "include"
    });
    return response;
}

export async function uploadFile(url?: string, data?: FormData): Promise<Response>{
    const response = await fetch(def +url, {
        method: "POST",
        cache: 'no-cache',
        body: data
    });
    if(response.ok){
        return response;
    } else {
        console.log(response);
        return response;
    }
}

export function uploadCaller(url: string, data: FormData): [(newUrl: string, newData: FormData)=> Promise<boolean>, AbortController]{
    const abortController = new AbortController();
    const fetchData = async (newUrl = url, newData = data)=>{
        if(newUrl) url = newUrl;
        if(newData) data = newData;
        try{
            return await uploadCall(url, data);
        } catch(err){
            console.log(err);
            return null;
        }
    }

    return [fetchData, abortController];
}

async function uploadCall(url: string, data: FormData): Promise<boolean>{
    const response = await fetch(def +url, {
        method: "POST",
        cache: 'no-cache',
        body: data
    });
    if(response.ok){
        return true;
    }
}

async function handleSelect(response: Response): Promise<any>{
    if(response.ok){
        return await response.json();
    }
    return null;
}

async function handleInsert(response: Response): Promise<number | null>{
    if(response.ok){
        return (await response.json()).newId;
    }
    return null;
}

function handleDelete(response: Response): boolean{
    if(response.ok){
        return true;
    }
    return false;
}

export interface IRequestInfo{
    url: string;
    data: any;
}

export function IsSuccessful(json: string){
    if(JSON.parse(json).msg === "success"){
        return true;
    }
    console.log(json);
    return false;
}

export function isResponse200(response: string){
    try{
        if(JSON.parse(response).response === 200) return true;
    } catch(err){
        console.log(err);
        console.log(response);
    }
}

export function tryParse(response: string){
    try{
        return JSON.parse(response).object;
    }catch(err) {
        console.log(err);
        console.log(response);
    }
    return null;
}

export function getNewId(object: any, response: string){
    try{
        object.id = JSON.parse(response).newId;
        if(object.id != null) return true;
        console.log(response);
    } catch(err){
        console.log(err);
        console.log(response);
    }
    return false;
}

export function parseId(response: string): number{
    try{
        return JSON.parse(response).newId;
    } catch(err){
        console.log(err);
        console.log(response);
    }
    return null;
}
