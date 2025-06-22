import { Component, input } from '@angular/core';

@Component({
  selector: 'app-exercice-page-container',
  template: `
    <main [class]="className()">
      <ng-content></ng-content>
    </main>
  `,
})
export class ExercicePageContainer {
  className = input<string>('h-screen flex flex-col min-h-[28rem]');
}
