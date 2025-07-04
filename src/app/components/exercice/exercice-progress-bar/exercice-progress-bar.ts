import { Component, effect, inject, input, signal } from '@angular/core';
import { ExerciceState } from '@services/exercice-state';

@Component({
  selector: 'app-exercice-progress-bar',
  templateUrl: './exercice-progress-bar.html',
})
export class ExerciceProgressBar {
  exerciceState = inject(ExerciceState);

  className = input<string>(
    'h-1 bg-(--color-exercice) transition-all duration-700'
  );

  progressPercentDeffered = signal<number>(0);

  progressPercentEffect = effect(() => {
    const progressPercent = this.exerciceState.progressPercent();
    setTimeout(() => this.progressPercentDeffered.set(progressPercent));
  });
}
