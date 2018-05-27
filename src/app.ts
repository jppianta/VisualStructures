import { parse } from './grammar/grammar';
import { inject } from 'aurelia-framework';
import { Editor } from 'editor/editor';
import { Visualizer } from 'visualizer/visualizer';
import { IFunction } from './interfaces';

interface IProgram {
  attributions: object[],
  functions: object[],

}

@inject(Editor, Visualizer)
export class App {
  styleVisualizer: object; 
  styleEditor:object
  styleContainer:object;
  styleLogo: object;
  styleLogoDiv: object;
  styleBar:object;
  styleBarDiv: object;
  private errorMessage: string;
  private functions: string[];
  private program: object;

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
      'display': 'grid',
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

  }

  async attachTools() {
    setTimeout(() => {
      this.editor.attach();
      this.visualizer.attach();
    }, 0)
  }

  setFunctions(funcs: IFunction[]) {
    this.functions = [];
    funcs.forEach(f => {
      this.functions.push(f.name);
    });
  }

  onCompileClick() {
    try {
      const result = parse(this.editor.getInput().getSession().getValue());
      this.setFunctions(result.functions)
      this.errorMessage = '';
      console.log(result);
    } catch(error) {
      this.errorMessage = error.message;
    }    
  }
}
