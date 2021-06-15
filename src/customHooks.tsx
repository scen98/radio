/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, MutableRefObject, useEffect } from "react";
export function useAsyncReference<T>(value: T) {
    const ref: React.MutableRefObject<any> = useRef(value);
    const [, forceRender] = useState(false);
    const updateState = (newState) => {
        if (!Object.is(ref.current, newState)) {
            ref.current = newState;
            forceRender(s => !s);
        }
    }
    return [ref, updateState] as const;
}

export function useBinder(value: any): [any, (any: any) => void, (event: any) => void] {
    const [get, set] = useState(value);
    const bind = (event) => {
        set({ ...get, [event.target.name]: event.target.value });
    }
    return [get, set, bind];
}

export function useAsyncBinder(value: any): [React.MutableRefObject<any>, (any: any) => void, (event: any) => void] {
    const ref: React.MutableRefObject<any> = useRef(value);
    const [, forceRender] = useState(false);
    const updateState = (newState) => {
        if (!Object.is(ref.current, newState)) {
            ref.current = newState;
            forceRender(s => !s);
        }
    }
    const bind = (event) => {
        updateState({ ...ref.current, [event.target.name]: event.target.value });
    }
    return [ref, updateState, bind];
}

export function useCutter(defaultText: string, defaultCutPos = 0): readonly [string, boolean, (text: string, custPos?: number) => void] {
    const [firstText, firstCut] = getCutText(defaultText, defaultCutPos > 0, defaultCutPos);
    const [isCut, setIsCut] = useState(firstCut);
    const [outputText, setOutputText] = useState(firstText);

    const cut = (text: string, cutPos = 0) => {
        const [newText, didCut] = getCutText(text, cutPos > 0, cutPos);
        setOutputText(newText);
        setIsCut(didCut);
    }

    return [outputText, isCut, cut] as const;
}

function getCutText(text: string, toCut: boolean, cutPos: number): [string, boolean] {
    if (toCut && text.length > cutPos) {
        return [text.substring(0, cutPos) + "...", true];
    }
    return [text, false];
}

export function setBinder(event, object, setter: (any) => void) {
    setter({ ...object.current, [event.target.name]: event.target.value });
}

export function onEnter(event, callback) {
    if (event.key === 'Enter') {
        callback();
    }
}

export function useScroll(pos: number, callback: () => any): readonly [() => void, () => void] {
    let newPos = pos;
    if (pos > 1 || pos < 0) newPos = 0.8;
    const position = useRef(newPos);
    const listener = () => {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * position.current)) {
            callback();
        }
    }
    const addListener = () => {
        window.addEventListener("scroll", listener);
    }
    const removeListener = () => {
        window.removeEventListener("scroll", listener);
    }
    return [addListener, removeListener] as const;
}

export enum ESize {
    Normal = "",
    Medium = "medium-",
    Small = "small-",
}

export function useImage(path: string, fileName: string, size = ESize.Normal, tryAgain = false) {
    const [imgSrc, setImgSrc] = useState<string>(`${path}/${size}${fileName}`);
    const tryAgainRef = useRef(tryAgain);
    const onError = () => {
        if (tryAgainRef.current) {
            setImgSrc(`${path}/${ESize.Normal}${fileName}`);
            tryAgainRef.current = false;
        } else {
            setImgSrc(`${path}/${size}0.jpg`);
        }
    }
    const imgSrcSetter = (newPath: string, newFileName: string) => {
        setImgSrc(`${newPath}/${size}${newFileName}`);
    }
    return [imgSrc, onError, imgSrcSetter] as const;
}

export interface IWindowState {
    name: string;
    maxValue: number;
}

export function useWidth(defWindowStates: IWindowState[]) {
    const windowsStates = useRef(defWindowStates.sort(compareWindowStates));
    const [currentWindowState, setCurrentWindowState] = useState(windowsStates.current.find(w => w.maxValue > window.innerWidth));
    const listen = () => {
        window.addEventListener("resize", () => {
            windowStateSetter();
        });
    }
    const cleanUpListener = () => {
        window.removeEventListener("resize", () => {
            windowStateSetter();
        });
    }
    const windowStateSetter = () => {
        setCurrentWindowState(windowsStates.current.find(w => w.maxValue > window.innerWidth));
    }
    return [currentWindowState, listen, cleanUpListener] as const;
}

function compareWindowStates(wstate1: IWindowState, wstate2: IWindowState) {
    if (wstate1.maxValue < wstate2.maxValue) return -1;
    if (wstate1.maxValue > wstate2.maxValue) return 1;
    return 0;
}

export function useHeight(defWindowStates: IWindowState[]) {
    const windowsStates = useRef(defWindowStates.sort(compareWindowStates));
    const [currentWindowState, setCurrentWindowState] = useState(windowsStates.current.find(w => w.maxValue > window.innerHeight));
    const listen = () => {
        window.addEventListener("resize", () => {
            windowStateSetter();
        });
    }
    const cleanUpListener = () => {
        window.removeEventListener("resize", () => {
            windowStateSetter();
        });
    }
    const windowStateSetter = () => {
        setCurrentWindowState(windowsStates.current.find(w => w.maxValue > window.innerHeight));
    }
    return [currentWindowState, listen, cleanUpListener] as const;
}

export function useRatio<T>(ratio: number) {
    const ref = useRef<T>();

    const trySetheight = () => {
        try {
            setHeight();
        } catch {
            console.log("Resize of undefined object.")
        }
    }

    const listen = () => {
        setHeight();
        window.addEventListener("resize", trySetheight);
    }

    const cleanUp = () => {
        window.removeEventListener("resize", trySetheight);
    }

    const setHeight = () => {
        const width = (ref as unknown as MutableRefObject<HTMLDivElement>).current.offsetWidth;
        (ref as unknown as MutableRefObject<HTMLDivElement>).current.style.height = (width * ratio).toString() + "px"; /* what the fuck is this? */
    }
    return [ref as MutableRefObject<T>, listen, cleanUp, setHeight] as const;
}

export function useFetch<T>(url: string, onError: () => void) {
    const [data, setData] = useState<T>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setData(null);
        const signal = new AbortController();

        async function fetchData() {
            setIsLoading(true);
            const result = await fetch(url, signal);
            if (result.ok) {
                setData(await result.json());
            } else {
                onError();
                setIsError(true);
            }
            setIsLoading(false);
        }
        fetchData();
        return () => {
            signal.abort();
        }
    }, [url]);

    return { data, isLoading, isError };
}