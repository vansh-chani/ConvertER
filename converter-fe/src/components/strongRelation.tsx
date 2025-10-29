import React from "react";
import { type NodeProps, type Node, Handle, Position, useReactFlow, useStore } from "@xyflow/react";

export type StrongRelationNodeData = {
    Title: string;
    Attributes: string[];
};

export type StrongRelationData = Node<StrongRelationNodeData, 'strongRelation'>;

export function StrongRelation({ id, data }: NodeProps<StrongRelationData>) {
    const selectedNodes = useStore((state) =>
        state.nodes.filter((node) => node.selected)
    );
    const selectedNode = selectedNodes[0];

    return (
        <>
            <div
                className="strong-relation-container flex items-center justify-center px-5 py-2.5 rounded-md hover:bg-black/10 hover:shadow-[0_0_0_8px_rgba(161,161,161,0.25)]"
                style={
                    selectedNode && id === selectedNode.id
                        ? {
                            backgroundColor: 'rgba(100,100,100,0.25)',
                            clipPath: 'path("M71.3607 1.35742C73.1605 0.214143 75.4593 0.214143 77.2591 1.35742L145.569 44.749C148.97 46.9096 148.97 51.8736 145.569 54.0342L77.2591 97.4258C75.4593 98.5691 73.1605 98.5691 71.3607 97.4258L3.05109 54.0342C-0.350199 51.8736 -0.3502 46.9096 3.05109 44.749L71.3607 1.35742Z")',
                        }
                        : {
                            clipPath: 'path("M71.3607 1.35742C73.1605 0.214143 75.4593 0.214143 77.2591 1.35742L145.569 44.749C148.97 46.9096 148.97 51.8736 145.569 54.0342L77.2591 97.4258C75.4593 98.5691 73.1605 98.5691 71.3607 97.4258L3.05109 54.0342C-0.350199 51.8736 -0.3502 46.9096 3.05109 44.749L71.3607 1.35742Z")',
                        }
                }
            >
                
                <div className="strong-relation-shape h-20 w-28 flex items-center justify-center">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 149 99"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                        className="drop-shadow-md"
                    >
                        <path
                            d="M71.3607 1.35742C73.1605 0.214143 75.4593 0.214143 77.2591 1.35742L145.569 44.749C148.97 46.9096 148.97 51.8736 145.569 54.0342L77.2591 97.4258C75.4593 98.5691 73.1605 98.5691 71.3607 97.4258L3.05109 54.0342C-0.350199 51.8736 -0.3502 46.9096 3.05109 44.749L71.3607 1.35742Z"
                            fill="white"
                            stroke="#A1A1A1"
                            strokeWidth="1"
                        />
                    </svg>
                    <h1 className="strong-relation-title font-instrument-sans font-semibold text-[#6d6d6d] absolute text-sm ">{data.Title}</h1>
                </div>
            </div >
            <Handle type="source" position={Position.Right} className="!bg-gray-100 !w-2 !h-2 !rounded-full border !border-gray-400" />
            <Handle type="target" position={Position.Left} className="!bg-gray-100 !w-2 !h-2 !rounded-full border !border-gray-400" />
        </>
    );
}