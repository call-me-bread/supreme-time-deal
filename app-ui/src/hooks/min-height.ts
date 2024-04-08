import {useEffect, useRef} from "react";

export function useMinHeight() {
    const mainRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        const setMinHeight = () => {
            if (!mainRef.current) return;
            mainRef.current.style.minHeight = `${window.innerHeight}px`;
        };
        setMinHeight();
    }, []);

    return mainRef
}
