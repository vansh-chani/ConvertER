"use client";
import { useState, useEffect, useRef } from 'react';
import { LuLibraryBig } from "react-icons/lu";
import { FiSidebar } from "react-icons/fi";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { type Node } from '@xyflow/react';
import Image from 'next/image';
import strongEntityImg from '../assets/strongEntity.svg';
import weakEntityImg from '../assets/weakEntity.svg';
import strongRelationImg from '../assets/strongRel.svg';
import weakRelationImg from '../assets/weakRel.svg';
import strongEntityIcon from '../assets/strongEntityIcon.svg';
import strongRelationIcon from '../assets/StrongRelationIcon.svg';
import weakEntityIcon from "../assets/weakEntityIcon.svg"

type LeftPanelProps = {
    projectTitle: string;
    group?: string;
    nodes: Node[];
};

export default function LeftSidePanel({ projectTitle, group, nodes }: LeftPanelProps & { nodes: Node[] }) {
    const [width, setWidth] = useState(360);
    const [dragging, setDragging] = useState(false);
    const leftSideBar = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(projectTitle);
    const inputRef = useRef<HTMLInputElement>(null);
    const [EntitiesIsExpanded, setEntitiesIsExpanded] = useState(true);
    const [RelationsIsExpanded, setRelationsIsExpanded] = useState(true);
    const [ElementsIsExpanded, setElementsIsExpanded] = useState(true);
    const [availableHeight, setAvailableHeight] = useState(0);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const updateHeight = () => {
            if (leftSideBar.current) {
                const totalHeight = leftSideBar.current.clientHeight;
                const headerHeight = leftSideBar.current.querySelector('.title-section')?.clientHeight ?? 0;
                const entitiesHeight = leftSideBar.current.querySelector('.Entities')?.clientHeight ?? 0;
                const relationsHeight = leftSideBar.current.querySelector('.Relations')?.clientHeight ?? 0;

                setAvailableHeight(totalHeight - (headerHeight + entitiesHeight + relationsHeight));
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

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

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const onRename = (newTitle: string) => void 0;
    const handleBlur = () => {
        setIsEditing(false);
        if (text !== projectTitle) {
            onRename(text);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            inputRef.current?.blur();
        } else if (e.key === "Escape") {
            setText(projectTitle);
            setIsEditing(false);
        }
    };

    function NodeIcon({ type }: { type: string | undefined }) {
        // No hydration mismatch — deterministic icon mapping
        const iconMap: Record<string, any> = {
            strongEntity: strongEntityIcon,
            strongRelation: strongRelationIcon,
            weakEntity: weakEntityIcon,
        };

        const altMap: Record<string, string> = {
            strongEntity: "Strong Entity Icon",
            strongRelation: "Strong Relation Icon",
            weakEntity: "Weak Entity Icon",
        };

        const icon = iconMap[type || ''];
        if (!icon) return null;

        return (
            <Image
                src={icon}
                alt={altMap[type || '']}
                width={16}
                height={16}
                className="inline-block mr-2"
                priority
            />
        );
    }

    return (
        <div className='container flex flex-row'>
            <div
                ref={leftSideBar}
                style={{ width }}
                className='bg-white h-screen overflow-hidden absolute z-10 top-0 left-0 shadow-xl'
            >
                <div className='side-handle h-full cursor-ew-resize w-2 top-0 right-0 absolute'
                    onMouseDown={() => setDragging(true)}
                    onMouseUp={() => setDragging(false)}
                ></div>
                <div className='title-section p-6 border-b border-gray-300 select-none'>
                    <div className='flex flex-row items-center justify-between mb-4'>
                        <button className='Library cursor-pointer'>
                            <LuLibraryBig size={16} color='#515151' />
                        </button>
                        <button className='collapse-sidebars cursor-pointer'>
                            <FiSidebar size={16} color='#515151' className='ml-4' />
                        </button>
                    </div>
                    <div>
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                className='font-instrument-sans font-semibold text-gray-600 text-md border px-1 py-0.5 rounded outline-1'
                            />
                        ) : (
                            <h1 onClick={() => setIsEditing(true)} className='font-instrument-sans font-semibold text-lg text-gray-950'>{text}</h1>
                        )}
                        <p className='font-instrument-sans w-fit font-semibold text-[12px] text-[#2d2d2d] mt-1 bg-[#D9D9D9] rounded-full px-3 py-1'>{group}</p>
                    </div>
                </div>
                <div className='Entities p-6 min-h-12 border-b border-gray-300 select-none'>
                    <div onClick={() => setEntitiesIsExpanded(!EntitiesIsExpanded)} className='entities-heading flex flex-row items-center justify-start space-x-2 hover:cursor-pointer '>
                        {EntitiesIsExpanded ? <FaChevronDown size={12} color='#000' /> : <FaChevronRight size={12} color='#000' />}
                        <h1 className='font-instrument-sans font-semibold text-[14px] text-gray-950'>Entities</h1>
                    </div>
                    <div className='Entities-options'>
                        {EntitiesIsExpanded && (
                            <div className='py-6 flex flex-row flex-wrap gap-4 justify-start items-center '>
                                <Image src={strongEntityImg} alt="Strong Entity" className='p-2 rounded-[10px] cursor-pointer hover:bg-gray-200' />
                                <Image src={weakEntityImg} alt="Weak Entity" className='p-2 rounded-[10px] cursor-pointer hover:bg-gray-200' />
                            </div>
                        )}
                    </div>
                </div>

                <div className='Relations p-6 min-h-12 border-b border-gray-300 select-none'>
                    <div onClick={() => setRelationsIsExpanded(!RelationsIsExpanded)} className='entities-heading flex flex-row items-center justify-start space-x-2 hover:cursor-pointer'>
                        {RelationsIsExpanded ? <FaChevronDown size={12} color='#000' /> : <FaChevronRight size={12} color='#000' />}
                        <h1 className='font-instrument-sans font-semibold text-[14px] text-gray-950'>Relations</h1>
                    </div>
                    <div className='Entities-options ml-3 mr-1'>
                        {RelationsIsExpanded && (
                            <div className='py-6 flex flex-row flex-wrap gap-8 justify-start items-center '>
                                <Image src={strongRelationImg} alt="Strong Relation" className='p-2 rounded-[10px] cursor-pointer hover:bg-gray-200' />
                                <Image src={weakRelationImg} alt="Weak Relation" className='p-2 rounded-[10px] cursor-pointer hover:bg-gray-200' />
                            </div>
                        )}
                    </div>
                </div>
                <div className='Elements p-6 min-h-12 select-none'>
                    <div onClick={() => setElementsIsExpanded(!ElementsIsExpanded)} className='entities-heading flex flex-row items-center justify-start space-x-2 hover:cursor-pointer'>
                        {ElementsIsExpanded ? <FaChevronDown size={12} color='#000' /> : <FaChevronRight size={12} color='#000' />}
                        <h1 className='font-instrument-sans font-semibold text-[14px] text-gray-950'>Elements</h1>
                    </div>
                    <div className='Elements-list ml-3 mr-1 mt-2 overflow-y-auto scrollbar-thin'
                        style={{ maxHeight: mounted ? availableHeight - 70 : 'auto' }}
                    >
                        {mounted && ElementsIsExpanded && (
                            <>
                                {nodes.map((node) => (
                                    <div
                                        key={node.id}
                                        className='Element-item p-1 pl-2 text-[#686868] font-instrument-sans text-sm rounded-[6px] cursor-pointer hover:bg-gray-100'
                                    >
                                        <NodeIcon type={node.type} />
                                        {String((node.data as any)?.Title ?? '')}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="Instructions text-gray-500 z-12 font-jetbrains-mono absolute bottom-3 text-[12px] bg-[#f0f0f015] p-2 rounded-2xl backdrop-blur-[1px] select-none"
                style={{ left: `${width + 20}px` }}>
                <p className=''><span className='font-bold'>Shift + Mouse</span> to select multiple</p>
                <p className=''><span className='font-bold'>Backspace</span> to delete</p>
            </div>
        </div>
    );
}
