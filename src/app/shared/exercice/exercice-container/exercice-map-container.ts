import { Component, input } from '@angular/core';

@Component({
  selector: 'geo-exercice-map-container',
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'className()',
  },
})
export class ExerciceMapContainer {
  className = input<string>('flex-1 relative');
}
