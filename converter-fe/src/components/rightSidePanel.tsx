"use client";
import { useStore, useReactFlow } from '@xyflow/react';
import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa6';
import { writeERFileContent } from '@/app/project/utils';


function SelectedNodeInfo() {
    const { setNodes } = useReactFlow();
    const selectedNodes = useStore((state) => state.nodes.filter((node) => node.selected));
    const selectedNode = selectedNodes[0];

    const [isEditing, setIsEditing] = useState(false);
    const [Titletext, setTitleText] = useState(selectedNode ? (selectedNode.data as any)?.Title || '' : '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedNode) {
            setTitleText((selectedNode.data as any)?.Title || '');
        } else {
            setTitleText('');
        }
    }, [selectedNode]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const onRename = (newTitle: string) => {
        if (!selectedNode) return;
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            Title: newTitle,
                        },
                    };
                }
                return node;
            })
        );
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (Titletext !== selectedNode ? (selectedNode.data as any)?.Title : '') {
            onRename(Titletext);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            inputRef.current?.blur();
        } else if (e.key === "Escape") {
            setTitleText(selectedNode ? (selectedNode.data as any)?.Title || '' : '');
            setIsEditing(false);
        }
    };


    if (!selectedNode) return <div className='text-gray-400 font-medium font-instrument-sans text-[12px] text-center'>No node selected</div>;
    return (
        <div className="PropertiesPanel">
            <p className='text-sm font-semibold font-instrument-sans text-gray-800 px-6'>Title</p>
            <div className='flex flex-row my-1 items-center justify-start border-b border-gray-300 pb-4 px-6'>
                <input className="font-jetbrains-mono text-xs bg-gray-200 px-1 w-[200px] rounded-[4px] py-1 text-gray-900"
                    ref={inputRef}
                    value={Titletext}
                    onChange={(e) => setTitleText(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
                <p className="text-gray-500 mx-2 text-[10px] font-jetbrains-mono">{selectedNode.type}</p>
            </div>
            <div className="attributes-section my-4 border-b border-gray-300 pb-4">
                <p className='text-sm font-semibold font-instrument-sans text-gray-800 px-6 mb-[10px]'>Attributes</p>
                <ul className="list-inside px-6">
                    {((selectedNode.data as any)?.Attributes || []).map((attr: string, index: number) => (
                        <li key={index}>
                            <input className="font-jetbrains-mono text-xs bg-gray-200 px-1 w-[200px] rounded-[4px] py-1 text-gray-900 my-2" placeholder={attr} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default function RightSidePanel({ profileUrl }: { profileUrl: string }) {
    const [width, setWidth] = useState(320);
    const [dragging, setDragging] = useState(false);
    const rightSideBar = useRef<HTMLDivElement>(null);
    const [propertiesIsExpanded, setPropertiesIsExpanded] = useState(true);
    const ReactFlowInstance = useReactFlow();

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

    async function saveProject() {
        const project = ReactFlowInstance.toObject();
        const erFileContent = writeERFileContent(project.nodes, project.edges);

        try {
            const response = await fetch('http://127.0.0.1:8000/project/demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: erFileContent,
            });

            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            alert('Project saved....');
        } catch (error) {
            console.error('Error saving project:', error);
        }
    }

    return (
        <div
            ref={rightSideBar}
            style={{ width }}
            className='bg-white h-full overflow-hidden absolute top-0 right-0 shadow-xl select-none'
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
                    <button onClick={saveProject} className='mt-6 mr-6 ml-auto bg-[#333333] text-white cursor-pointer font-instrument-sans text-sm font-bold py-2 px-4 rounded-full border border-[#333333] hover:opacity-80'>
                        Save
                    </button>
                </div>
            </div>
            <div onClick={() => setPropertiesIsExpanded(!propertiesIsExpanded)} className='properties-heading flex flex-row items-center justify-start space-x-2 p-6  hover:cursor-pointer '>
                {propertiesIsExpanded ? <FaChevronDown size={12} color='#000' /> : <FaChevronRight size={12} color='#000' />}
                <h1 className='font-instrument-sans font-semibold text-[14px] text-gray-950'>Properties</h1>
            </div>
            <div className={`properties-content ${propertiesIsExpanded ? 'block' : 'hidden'}`}>
                <SelectedNodeInfo />
            </div>
        </div >
    );
}
