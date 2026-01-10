import { Component, inject } from '@angular/core';
import type { Data } from '@shared/data';
import { ExerciceState } from '@shared/exercice/exercice-state';

@Component({
  selector: 'geo-exercice-head',
  templateUrl: './exercice-head.html',
})
export class ExerciceHead<T extends Data> {
  exerciceState = inject(ExerciceState<T>);
}
