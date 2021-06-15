/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

interface IAutoCompleteElement{
    text: string;
    selectedValue: string;
    onClick: (s: string)=>void;
}

export const AutoCompleteElement: React.FC<IAutoCompleteElement> = ({text, onClick, selectedValue})=> {
    const [mainClass, setMainClass] = useState("");
    useEffect(()=>{
        if(selectedValue === text){
            setMainClass("auto-selected");
        } else {
            setMainClass("");
        }
    }, [selectedValue])
    return (
        <div className={mainClass} onClick={()=>{ onClick(text) }}>
            {text}
        </div>
    )
}

export default AutoCompleteElement;