export const days = [ 
    "Vasárnap", 
    "Hétfő", 
    "Kedd", 
    "Szerda", 
    "Csütörtök", 
    "Péntek", 
    "Szombat"
];

export const orderedDays = [  
    "Hétfő", 
    "Kedd", 
    "Szerda", 
    "Csütörtök", 
    "Péntek", 
    "Szombat",
    "Vasárnap"
];

export const getCetTime = ()=>{
    const now = new Date();
    const cetOffset = now.getTimezoneOffset() + 120;
    now.setMinutes(now.getMinutes() + cetOffset);
    return now;
}

export const getLast7Days = (date: Date)=>{
    const week: Date[] = [date];
    let i;
    for(i = 1; i < 7; i++){    
        const newDate = new Date(date.getTime());
        newDate.setDate(newDate.getDate() - i);
        week.push(newDate);
    }
    return week.reverse();
}

export const getLastXWeekEndings = (x: number) =>{
    const today = new Date();
    const week: Date[] = [today];
    let i;
    for(i = 1; i < x; i++){    
        const newDate = new Date(today.getTime());
        newDate.setDate(newDate.getDate() - i * 7);
        week.push(newDate);
    }
    return week.reverse();
}

export const areDatesOnTheSameDay = (date1: Date, date2: Date) =>{
    if(date1 == null || date2 == null){
        return false;
    }
    if(date1.getDate() !== date2.getDate()){
        return false;
    }
    if(date1.getMonth() !== date2.getMonth()){
        return false;
    }
    if(date1.getFullYear() !== date2.getFullYear()){
        return false;
    }
    return true;
}

export const getCurrentDay = (): string=>{
    return days[getCetTime().getDay()];
}