export class App {
  styleVisualizer: object; 
  styleEditor:object
  styleContainer:object;
  styleLogo: object;
  styleLogoDiv: object;

  constructor() {
    this.styleVisualizer = {
      'width': '100%',
      'height': '87.6vh',
      'border-style': 'solid',
      'border-color': 'rgba(0, 0, 0, 0.07)'
    }

    this.styleEditor = {
      'width': '100%',
      'height': '87.6vh',
      'border-bottom': 'solid',
      'border-top': 'solid',
      'border-color': 'rgba(0, 0, 0, 0.07)'
    }

    this.styleContainer = {
      display: 'grid',
      'grid-template-columns': '50% 50%'
    }

    this.styleLogoDiv = {
      width: '100%',
      height: '10vh'
    }

    this.styleLogo = {
        'width': 'auto',
        'height': '90%',
        'display': 'block',
        'margin-left': 'auto',
        'margin-right': 'auto'
    }
  }
}
