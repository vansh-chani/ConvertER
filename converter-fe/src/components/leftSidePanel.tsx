"use client";

import { useState, useEffect, useRef } from 'react';

export default function LeftSidePanel() {
    const [width, setWidth] = useState(300);
    const [dragging, setDragging] = useState(false);
    const leftSideBar = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            if (!dragging) {
                return;
            }
            const newWidth = Math.min(Math.max(e.clientX, 150), 500);
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
            ref={leftSideBar}
            style={{ width }}
            className='bg-white h-full overflow-hidden absolute top-0 left-0 shadow-xl'
        >
            <div className='side-handle h-full cursor-ew-resize w-2 top-0 right-0 absolute'
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
            ></div>
            <h2 className='p-2 border-b text-black select-none'>Left Sidebar</h2>
            {/* Render your sidebar content here */}
        </div>
    );
}
