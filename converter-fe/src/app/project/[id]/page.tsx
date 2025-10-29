"use client";
import { useState } from 'react';
import LeftSidePanel from '@/components/leftSidePanel';
import RightSidePanel from '@/components/rightSidePanel';
import { parseERFileContent } from '../utils';
import { type Node, type Edge, ReactFlowProvider } from "@xyflow/react"
import WorkSpace from '@/components/workSpace';


const profileUrl = 'https://avatars.githubusercontent.com/u/4866536?v=4';

const res = await fetch('http://127.0.0.1:8000/projects/demo');
const content = await res.text();
// console.log('Fetched ER file content:', content);
const { nodes, edges } = parseERFileContent(content);
const Nodes: Node[] = nodes;
const Edges: Edge[] = edges;

export default function App() {
    const [nodes, setNodes] = useState<Node[]>(Nodes);
    const [edges, setEdges] = useState<Edge[]>(Edges);

    return (
        <div className='w-screen h-screen bg-[#f0f0f0]'>
            <ReactFlowProvider>
                <WorkSpace
                    nodes={nodes}
                    setNodes={setNodes}
                    edges={edges}
                    setEdges={setEdges} />
                <LeftSidePanel projectTitle='Untitled' group='Work' nodes={nodes} />
                <RightSidePanel profileUrl={profileUrl} />
            </ReactFlowProvider>
        </div>
    );
}
