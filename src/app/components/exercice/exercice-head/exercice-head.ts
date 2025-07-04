import { Component, inject } from '@angular/core';
import type { Data } from '@models/data/data';
import { ExerciceState } from '@services/exercice-state';

@Component({
  selector: 'app-exercice-head',
  templateUrl: './exercice-head.html',
})
export class ExerciceHead<T extends Data> {
  exerciceState = inject(ExerciceState<T>);
}
