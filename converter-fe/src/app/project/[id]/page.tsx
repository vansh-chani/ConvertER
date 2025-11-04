"use client";
import { use, useEffect, useState } from 'react';
import LeftSidePanel from '@/components/leftSidePanel';
import RightSidePanel from '@/components/rightSidePanel';
import { parseERFileContent } from '../utils';
import { type Node, type Edge, ReactFlowProvider } from "@xyflow/react"
import WorkSpace from '@/components/workSpace';
import { apiRequest } from '@/lib/utils';


// const res = await fetch('http://127.0.0.1:8000/project/demo');
// const content = await res.text();
// // console.log('Fetched ER file content:', content);
// const { nodes, edges } = parseERFileContent(content);
// const Nodes: Node[] = nodes;
// const Edges: Edge[] = edges;

export default function App({ params }: { params: Promise<{ id: string }> }) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [title, setTitle] = useState<string>('Untitled');
    const [group, setGroup] = useState<string>('Personal');
    const profileUrl = 'https://res.cloudinary.com/dx4rxpukt/image/upload/v1762150785/Ellipse_7_ths3ev.svg';
    const { id } = use(params);
    useEffect(() => {
        async function fetchERFile() {
            try {
                const res = await apiRequest(`/project/get_project/${id}`);

                setTitle(res.title || 'Untitled');
                setGroup(res.group || 'Personal');
                setNodes(res.nodes || []);
                setEdges(res.edges || []);

                document.title = `${res.title || "Untitled"} - ConvertER`;
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        }

        fetchERFile();
    }, [id]);

    return (
        <div className='w-screen h-screen bg-[#f0f0f0]'>
            <ReactFlowProvider>
                <WorkSpace
                    nodes={nodes}
                    setNodes={setNodes}
                    edges={edges}
                    setEdges={setEdges} />
                <LeftSidePanel 
                projectTitle={title} 
                group={group} 
                nodes={nodes}
                setNodes={setNodes} />
                <RightSidePanel profileUrl={profileUrl} />
            </ReactFlowProvider>
        </div>
    );
}
