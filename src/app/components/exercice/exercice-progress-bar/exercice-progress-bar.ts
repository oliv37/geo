import { Component, input } from '@angular/core';

@Component({
  selector: 'app-exercice-progress-bar',
  templateUrl: './exercice-progress-bar.html',
})
export class ExerciceProgressBar {
  progressPercent = input.required<number>();
  className = input<string>(
    'h-1 bg-(--color-exercice) transition-all duration-500'
  );
}
