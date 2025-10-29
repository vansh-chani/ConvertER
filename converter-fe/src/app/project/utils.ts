export function parseERFileContent(content: string) {
    try {
        const parsed = JSON.parse(content.trim());
        const { Nodes: nodes, Edges: edges } = parsed;
        if (!nodes || !edges) throw new Error('Missing Nodes or Edges');
        return { nodes, edges };
    } catch (err) {
        console.error('Failed to parse ER file:', err);
        throw new Error('Invalid ER file format');
    }
}


export function writeERFileContent(nodes: any[], edges: any[]) {
    const content = {
        Nodes: nodes,
        Edges: edges,
    };
    return JSON.stringify(content, null, 2);
}