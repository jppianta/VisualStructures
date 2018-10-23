export class Step {
    nodes = {};
    edges = [];

    constructor(info) {
        this.setUp(info);
    }

    setUp(info) {
        this.operation = info.operation;
        this.functionName = info.functionName;
        (info.nodes || []).forEach(node => {
            this.nodes[node.id] = {
                prop: node.prop,
            };
            delete node.prop;
            this.nodes[node.id].info = node;
        });
        (info.edges || []).forEach(edge => {
            this.edges.push(edge);
            this.nodes[edge.from].edge = {
                to: edge.to
            };
        });
    }

    getEdges() {
        return this.edges;
    }

    getNodes() {
        return Object.keys(this.nodes).map(key => this.nodes[key].info);
    }

    getVisualStep() {
        return {
            nodes: this.getNodes(),
            edges: this.getEdges()
        }
    }
}