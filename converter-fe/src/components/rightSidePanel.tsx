"use client";

import { useState, useEffect, useRef } from 'react';

export default function LeftSidePanel() {
    const [width, setWidth] = useState(300);
    const [dragging, setDragging] = useState(false);
    const rightSideBar = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            if (!dragging) {
                return;
            }
            const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 150), 500);
            setWidth(newWidth);
        }
        function handleMouseUp() {
            setDragging(false);
        }

        if (dragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);


    return (
        <div
            ref={rightSideBar}
            style={{ width }}
            className='bg-white h-full overflow-hidden absolute top-0 right-0 border-l-[.5px] border-l-[#a1a1a1] shadow-xl'
        >
            <div className='side-handle h-full cursor-ew-resize w-2 top-0 left-0 absolute'
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
            ></div>
            <h2 className='p-2 border-b text-black select-none'>Right Sidebar</h2>
            {/* Render your sidebar content here */}
        </div>
    );
}
