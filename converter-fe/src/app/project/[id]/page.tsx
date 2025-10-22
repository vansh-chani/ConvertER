"use client";
import { useState, useCallback } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    Controls,
    BackgroundVariant,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
    type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LeftSidePanel from '@/components/leftSidePanel';
import RightSidePanel from '@/components/rightSidePanel';
import { StrongEntity } from '@/components/strongEntity';
import { parseERFileContent } from '../utils';


const profileUrl = 'https://avatars.githubusercontent.com/u/4866536?v=4';

const res = await fetch('http://127.0.0.1:8000/projects/demo');
const content = await res.text();
console.log('Fetched ER file content:', content);
const { nodes, edges } = parseERFileContent(content);
const initialNodes: Node[] = nodes;
const initialEdges: Edge[] = edges;


const nodeTypes = {
    strongEntity: StrongEntity,
};

export default function App() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
        [],
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
        [],
    );

    const onConnect: OnConnect = useCallback(
        (connection: Connection) => setEdges((es) => addEdge(connection, es)),
        [],
    );

    return (
        <div className='w-screen h-screen bg-[#f0f0f0]'>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Background variant={BackgroundVariant.Dots} gap={16} />
                </ReactFlow>
            </ReactFlowProvider>
            <LeftSidePanel />
            <RightSidePanel profileUrl={profileUrl} />
        </div>
    );
}
