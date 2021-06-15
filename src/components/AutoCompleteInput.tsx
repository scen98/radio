import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, Fragment, useRef} from 'react'
import AutoCompleteElement from './AutoCompleteElement';

interface IAutoCompleteInput{
    value: string;
    setValue: (s: string)=>void;
    stringList: string[];
    onSubmit: (selectedValue: string)=>void;
}

export const AutoCompleteInput: React.FC<IAutoCompleteInput> = ({value, setValue, stringList, onSubmit})=> {
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [selected, setSelected] = useState("");
    const wrapperRef = useRef<HTMLDivElement>();

    useEffect(()=>{
        addClickListener();
        return ()=>{
            removeClickListener();
        }
    }, []);

    useEffect(() => {
        if(!showAutoComplete) setSelected("");
    }, [showAutoComplete]);

    const addClickListener = ()=>{
        window.addEventListener("click", handleClickOutside);
    }

    const removeClickListener = ()=>{
        window.removeEventListener("click", handleClickOutside);
    }

    const handleClickOutside = (e)=>{
        if(wrapperRef.current != null && !wrapperRef.current.contains(e.target)){
            setShowAutoComplete(false);
        }
    }

    const onDivKeyDown = (e: React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === "Enter"){
            if(showAutoComplete) {
                if(selected !== "") {
                    onSubmit(selected);
                    setValue(selected);
                } else {
                    onSubmit(value);
                }
            } else {
                onSubmit(value);
            }
            setShowAutoComplete(false);
        }
        if(e.keyCode === 38){ //up
            if(showAutoComplete && stringList.length > 0) handleUpArrow();
        }
        if(e.keyCode === 40){ //down
            if(showAutoComplete && stringList.length > 0) handleDownArrow();
        }
        if(e.keyCode === 39){ //right
            if(showAutoComplete && stringList.length > 0 && selected !== "") {
                setValue(selected);
            }
        }
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            // Number
            setShowAutoComplete(true);
            setSelected("");
        } else if (e.keyCode >= 65 && e.keyCode <= 90) {
            // Alphabet upper case
            setShowAutoComplete(true);
            setSelected("");
        } else if (e.keyCode >= 97 && e.keyCode <= 122) {
            // Alphabet lower case
            setShowAutoComplete(true);
            setSelected("");
        }
    }

    const handleUpArrow = ()=>{
        if(selected === ""){
            setSelected(stringList[0]);
        } else {
            const currentIndex = stringList.indexOf(selected);
            if(currentIndex !== 0) setSelected(stringList[currentIndex-1]);
        }
    }

    const handleDownArrow = ()=>{
        if(selected === "" && stringList.length > 0){
            setSelected(stringList[0]);
        } else {
            const currentIndex = stringList.indexOf(selected);
            if(currentIndex !== stringList.length) setSelected(stringList[currentIndex+1]);
        }
    }

    return (
        <div ref={wrapperRef} className="autocomplete">
            <div className="search-grid">
                <input placeholder="Keresés" className="search-input" autoComplete="off" value={value} onKeyUp={(e)=>{ onDivKeyDown(e) }} onChange={(e)=>{ setValue(e.target.value) }} type="text" list="datalist" />
                <button className="search-btn" onClick={()=>{ onSubmit(value) }}><FontAwesomeIcon icon={faSearch} /></button>
            </div>
            <div className="autocomplete-items">
            {showAutoComplete ? 
            (<Fragment>
                {stringList.map(s=>{
                    return <AutoCompleteElement key={`auto-${s}`} text={s} onClick={(s)=>{ setValue(s); setShowAutoComplete(false); onSubmit(s); } } selectedValue={selected} />
                })
             }
            </Fragment> ):
            (<Fragment></Fragment>)}
            </div>                        
        </div>
    )
}

export default AutoCompleteInput;