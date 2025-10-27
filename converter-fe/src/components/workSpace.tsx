"use client";
import { useState, useCallback } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
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
import { StrongEntity } from '@/components/strongEntity';
import { weakEntity } from './weakEntity';


const nodeTypes = {
    strongEntity: StrongEntity,
    weakEntity: weakEntity,
};

interface WorkSpaceProps {
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export default function WorkSpace({
    nodes,
    setNodes,
    edges,
    setEdges,
}: WorkSpaceProps) {

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
        </div>
    );
}
