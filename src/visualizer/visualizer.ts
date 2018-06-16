import { Network } from "vis/index";

export class Visualizer {
    styleObject: object;
    styleContainer: object;
    styleStats: object;

    ele: HTMLElement;
    nodes = {};
    edges;
    options;
    network;
    selected = -1;

    constructor() {
        this.styleContainer = {
            'width': '100%',
            'height': '100%',
        }

        this.styleObject = {
            'width': '100%',
            'height': '80%',
        }

        this.styleStats = {
            'height': '20%',
            'width': '100%'
        }
    }

    get select() {
        return this.selected;
    }

    createData() {
        this.options = {
            physics: false,
            autoResize: true
        }
    }

    editData(data) {
        data.nodes.forEach(element => {
            this.nodes[element.id] = (Object.values(element.prop)[0] as any).value;
        });
        this.network.setData(data);
    }

    private onSelected = (properties) => {
        this.selected = properties.nodes[0];
    }

    async attach() {
        this.ele = document.getElementById('visu');
        this.network = new Network(this.ele, this.createData(), this.options);
        this.network.on('selectNode', this.onSelected.bind(this));
    }

    getNetwork() {
        return this.network;
    }
}