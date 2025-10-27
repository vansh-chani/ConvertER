import React from "react";
import { type NodeProps, type Node, Handle, Position, useReactFlow } from "@xyflow/react";
import { IoIosAdd } from "react-icons/io";
import { IoIosClose } from "react-icons/io";

export type weakEntityNodeData = {
    Title: string;
    Attributes: string[];
};

export type weakEntityData = Node<weakEntityNodeData, 'weakEntity'>;

export function weakEntity({ id, data }: NodeProps<weakEntityData>) {
    const { setNodes } = useReactFlow();
    const [isInputVisible, setIsInputVisible] = React.useState(false);
    const [newAttribute, setNewAttribute] = React.useState("");

    function handleCloseInput() {
        setIsInputVisible(false);
        setNewAttribute("");
    }

    function handleAddAttribute() {
        if (!isInputVisible) {
            setIsInputVisible(true);
            return;
        }

        if (newAttribute.trim() === "") return;

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    const nodeData = node.data as weakEntityNodeData;
                    return {
                        ...node,
                        data: {
                            ...nodeData,
                            Attributes: [...nodeData.Attributes, newAttribute],
                        },
                    };
                }
                return node;
            })
        );



        setNewAttribute("");
        setIsInputVisible(false);
    }

    return (
        <div
            className="weak-entity-container flex items-center justify-center h-full w-full 
             hover:bg-black/10 border-white border-8 
             shadow-[0_0_0_0.5px_#a1a1a1,0_2px_6px_rgba(0,0,0,0.1)]
             hover:shadow-[0_0_0_10px_rgba(161,161,161,.3)]
             rounded-md"
        >   
            <div
                className="weak-entity h-full w-full min-w-36 rounded-[6px] bg-white"
                style={{
                    boxShadow: `0 0 0 0.5px #a1a1a1`
                }}
            >
                <div className="title font-instrument-sans bg-[#515151] h-7 rounded-t-[6px] flex items-center justify-start px-2">
                    <h1 className="text-white text-sm font-semibold">{data.Title}</h1>
                </div>

                <ul className="p-2 text-sm font-jetbrains-mono text-[#6D6D6D]">
                    {data.Attributes.map((attr, i) => (
                        <li key={i}>{attr}</li>
                    ))}
                </ul>

                {isInputVisible && (
                    <div className="add-attribute-input flex items-center justify-between border border-gray-300 rounded-[6px] mx-3">
                        <input
                            type="text"
                            className="w-24 text-[14px] text-gray-950 px-2 font-jetbrains-mono borderrounded-[6px] outline-none"
                            value={newAttribute}
                            onChange={(e) => setNewAttribute(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddAttribute()}
                            autoFocus
                        />
                        <button onClick={handleCloseInput} className="mx-1 hover:bg-gray-300 hover:rounded-full">
                            <IoIosClose color="black" />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-center">
                    <button
                        onClick={handleAddAttribute}
                        className="mt-2 mb-4 flex flex-row items-center justify-center bg-[#e2e2e2] font-instrument-sans font-semibold text-[12px] text-black py-1 px-3 rounded-[6px] hover:bg-[#d1d1d1]"
                    >
                        <h1 className="inline">{isInputVisible ? "Save Attribute" : "Add Attribute"}</h1>
                        <h1 className="mx-1">{isInputVisible ? "" : <IoIosAdd color="black" size={16} />}</h1>
                    </button>
                </div>

                <Handle type="source" position={Position.Right} className="!bg-gray-100 !w-2 !h-2 !rounded-full border !border-gray-400" />
                <Handle type="target" position={Position.Left} className="!bg-gray-100 !w-2 !h-2 !rounded-full border !border-gray-400" />
            </div>
        </div>
    );
}
