import { Component, computed, inject, input, Type } from '@angular/core';
import type { Data } from '@models/data/data';
import { Map } from '@components/map/map';
import { ExerciceLevel1 } from '@components/exercice/exercice-level/exercice-level-1/exercice-level-1';
import { ExerciceLevel2 } from '@components/exercice/exercice-level/exercice-level-2/exercice-level-2';
import { ExerciceLevel3 } from '@components/exercice/exercice-level/exercice-level-3/exercice-level-3';
import { ExerciceLevel } from '@services/exercice-level';

@Component({
  selector: 'app-exercice',
  imports: [ExerciceLevel1, ExerciceLevel2, ExerciceLevel3],
  templateUrl: './exercice.html',
  providers: [ExerciceLevel],
  host: {
    '[style.--color-exercice]': 'colorExercice()',
  },
})
export class Exercice<T extends Data> {
  exerciceLevel = inject(ExerciceLevel);

  Map = input.required<Type<Map>>();
  data = input.required<readonly T[]>();
  fields = input.required<readonly (keyof T)[]>();

  colorExercice = computed<string>(
    () => `var(--color-exercice-level-${this.exerciceLevel.level()})`
  );
}
