import { Component, input } from '@angular/core';

@Component({
  selector: 'app-exercice-container',
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'className()',
  },
})
export class ExerciceContainer {
  className = input<string>(
    'min-h-48 flex flex-col gap-4 justify-between py-6 px-4'
  );
}
