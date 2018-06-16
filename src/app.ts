import { parse } from './grammar/grammar';
import { inject } from 'aurelia-framework';
import { Editor } from 'editor/editor';
import { Visualizer } from 'visualizer/visualizer';
import { IClass, IFunction } from './interfaces';
import { Player } from './player';


@inject(Editor, Visualizer)
export class App {
  styleVisualizer: object; 
  styleEditor:object
  styleContainer:object;
  styleLogo: object;
  styleButton: object;
  styleBar: object;
  styleLogoDiv: object;
  private selected: string;
  private errorMessage: string;
  private functions: IFunction[];
  private player: Player;

  constructor(private editor: Editor, private visualizer: Visualizer) {
    this.initStyle();
    this.attachTools();
    this.errorMessage = '';
    this.functions = [];
  }

  initStyle() {
    this.styleVisualizer = {
      'width': '100%',
      'height': '83.6vh',
      'border-style': 'solid',
      'border-color': 'rgba(0, 0, 0, 0.07)'
    }

    this.styleEditor = {
      'width': '100%',
      'height': '83.6vh',
      'border-bottom': 'solid',
      'border-top': 'solid',
      'border-color': 'rgba(0, 0, 0, 0.07)'
    }

    this.styleContainer = {
      'display': 'flex',
      'grid-template-columns': '50% 50%'
    }

    this.styleLogoDiv = {
      'width': '100%',
      'height': '10vh'
    }

    this.styleLogo = {
        'width': 'auto',
        'height': '90%',
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto'
    }

    this.styleBar = {
      'width': '100%',
      'height': '4vh',
    }

    this.styleButton = {
      'float': 'left'
    }

  }

  async attachTools() {
    setTimeout(() => {
      this.editor.attach();
      this.visualizer.attach();
    }, 0)
  }

  onCompileClick() {
    try {
      const result = parse(this.editor.getInput().getSession().getValue());
      this.functions = result.functions;
      this.player = new Player(result, this.visualizer);
      this.errorMessage = 'Compile Success';
    } catch(error) {
      this.errorMessage = error.message;
    }    
  }

  play() {
    if (this.player && this.selected) {
      this.player.executeFunction(this.selected);
    }
  }
}
