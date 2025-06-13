import { Component, input } from '@angular/core';

@Component({
  selector: 'app-exercice-layout',
  templateUrl: './exercice-layout.html',
})
export class ExerciceLayout {
  className = input<string>('h-screen flex flex-col min-h-[28rem]');
}
