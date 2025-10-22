"use client";

import { useState, useEffect, useRef } from 'react';

export default function LeftSidePanel({ profileUrl }: { profileUrl: string }) {
    const [width, setWidth] = useState(320);
    const [dragging, setDragging] = useState(false);
    const rightSideBar = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            if (!dragging) {
                return;
            }
            const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 320), 500);
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
            className='bg-white h-full overflow-hidden absolute top-0 right-0 shadow-xl'
        >
            <div className='side-handle h-full cursor-ew-resize w-2 top-0 left-0 absolute'
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
            ></div>
            <div className='flex flex-row items-center justify-between border-b border-gray-300 pb-6'>
                <img
                    src={profileUrl || ''}
                    className='w-[30px] h-[30px] border-none rounded-full mt-6 ml-6'
                ></img>
                <div className='flex flex-row items-center justify-center'>
                    <button className='mt-6 mr-2 ml-auto text-[#333333] bg-white cursor-pointer font-instrument-sans text-sm font-bold py-2 px-4 rounded-full border border-[#333333] hover:bg-[#33333320]'>
                        Convert to SQL
                    </button>
                    <button className='mt-6 mr-6 ml-auto bg-[#333333] text-white cursor-pointer font-instrument-sans text-sm font-bold py-2 px-4 rounded-full border border-[#333333] hover:opacity-80'>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
