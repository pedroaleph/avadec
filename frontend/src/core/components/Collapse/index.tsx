import { useRef, useState, useEffect } from 'react';

const Collapse = ({
    title,
    children,
}: {
    title: string;
    children?: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen ? contentRef.current.scrollHeight : 0);
        }
    }, [isOpen]);

    return (
        <div className="overflow-hidden transition-all duration-300">
            <div className='w-100 border-bottom border-primary'>
                <button
                    type='button'
                    className="btn border-0 d-flex align-items-center w-100"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span className='fw-bold fs-4'>{title}</span>
                    <span className="material-icons fw-bold pt-1 ps-1">
                        {isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </span>
                </button>
            </div>

            <div
                style={{
                    height: height,
                    transition: 'height 0.3s ease',
                }}
            >
                <div ref={contentRef} className="overflow-hidden p-3 pb-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Collapse;
