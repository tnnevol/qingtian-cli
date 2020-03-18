import { useEffect, useState, useCallback } from 'react';

export default function {{name}}() {
    const [size, setSize] = useState({
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth
    });

    const onResize = useCallback(() => {
        setSize({
            height: document.documentElement.clientHeight,
            width: document.documentElement.clientWidth
        });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [onResize]);

    return size;
}
