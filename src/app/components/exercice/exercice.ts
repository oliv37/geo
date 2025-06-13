import { Component, input, signal, Type } from '@angular/core';
import type { Data } from '@models/data/data';
import type { Level } from '@models/level';
import { Map } from '@components/map/map';
import { ExerciceLevel1 } from '@components/exercice/exercice-level-1/exercice-level-1';
import { ExerciceLevel2 } from '@components/exercice/exercice-level-2/exercice-level-2';
import { ExerciceLevel3 } from '@components/exercice/exercice-level-3/exercice-level-3';

@Component({
  selector: 'app-exercice',
  imports: [ExerciceLevel1, ExerciceLevel2, ExerciceLevel3],
  templateUrl: './exercice.html',
})
export class Exercice<T extends Data> {
  Map = input.required<Type<Map>>();
  data = input.required<readonly T[]>();
  fields = input.required<readonly (keyof T)[]>();

  level = signal<Level>(1);
}
