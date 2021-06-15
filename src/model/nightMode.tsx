export function isNightModeOn(){
    const storage: string | null = window.localStorage.getItem("nightMode");
    if(storage == null){
        return false;
    }
    return JSON.parse(storage)
}

export function saveNightMode(mode: boolean){
    window.localStorage.setItem("nightMode", JSON.stringify(mode));
}