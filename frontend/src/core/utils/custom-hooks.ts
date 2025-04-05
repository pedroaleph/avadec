import { useEffect, useState } from 'react';

export const useResponsiveSidebar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAbsolute, setIsAbsolute] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsVisible(window.innerWidth > 1200);
            setIsAbsolute(window.innerWidth <= 1200);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsVisible((prev) => !prev);
    };

    return {
        isVisible,
        isAbsolute,
        toggleSidebar,
    };
};

