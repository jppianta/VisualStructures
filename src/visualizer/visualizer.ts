import { Network } from "vis/index";

export class Visualizer {
    styleObject: object;
    ele: HTMLElement;
    nodes;
    edges;
    options;
    network;

    constructor() {
        this.styleObject = {
            'width': '100%',
            'height': '100%' 
        }
    }

    createData() {
        this.edges = [];
        this.nodes = [];
        for (var i = 0; i < 15; i++) {
            this.nodes.push({id: i, label: String(i)});
        }
        this.edges.push({from: 0, to: 1});
        this.edges.push({from: 0, to: 6});
        this.edges.push({from: 0, to: 13});
        this.edges.push({from: 0, to: 11});
        this.edges.push({from: 1, to: 2});
        this.edges.push({from: 2, to: 3});
        this.edges.push({from: 2, to: 4});
        this.edges.push({from: 3, to: 5});
        this.edges.push({from: 1, to: 10});
        this.edges.push({from: 1, to: 7});
        this.edges.push({from: 2, to: 8});
        this.edges.push({from: 2, to: 9});
        this.edges.push({from: 3, to: 14});
        this.edges.push({from: 1, to: 12});
        this.nodes[0]["level"] = 0;
        this.nodes[1]["level"] = 1;
        this.nodes[2]["level"] = 3;
        this.nodes[3]["level"] = 4;
        this.nodes[4]["level"] = 4;
        this.nodes[5]["level"] = 5;
        this.nodes[6]["level"] = 1;
        this.nodes[7]["level"] = 2;
        this.nodes[8]["level"] = 4;
        this.nodes[9]["level"] = 4;
        this.nodes[10]["level"] = 2;
        this.nodes[11]["level"] = 1;
        this.nodes[12]["level"] = 2;
        this.nodes[13]["level"] = 1;
        this.nodes[14]["level"] = 5;

        this.options = {
            physics: false,
            autoResize: true
        }

        return {
            nodes: this.nodes,
            edges: this.edges
        }
    }

    async attach() {
        this.ele = document.getElementById('visu');
        this.network = new Network(this.ele, this.createData(), this.options);
    }

    getNetwork() {
        return this.network;
    }
}