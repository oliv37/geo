import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  input,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import type { Data } from '@models/data/data';
import type { Level } from '@models/level';
import { Map } from '@components/map/map';
import { ExerciceLevel1 } from '@components/exercice-level/exercice-level-1/exercice-level-1';
import { ExerciceLevel2 } from '@components/exercice-level/exercice-level-2/exercice-level-2';
import { ExerciceLevel3 } from '@components/exercice-level/exercice-level-3/exercice-level-3';
import { ExerciceLevelBtnBar } from '../exercice-level/exercice-level-btn-bar/exercice-level-btn-bar';

@Component({
  selector: 'app-exercice',
  imports: [
    NgComponentOutlet,
    ExerciceLevel1,
    ExerciceLevel2,
    ExerciceLevel3,
    ExerciceLevelBtnBar,
  ],
  templateUrl: './exercice.html',
})
export class Exercice<T extends Data> {
  Map = input.required<Type<Map>>();
  data = input.required<readonly T[]>();
  fields = input.required<readonly (keyof T)[]>();

  readonly isClientSide = typeof window !== 'undefined';

  readonly mapInputs = {
    className: 'absolute top-0 left-0 w-full h-full stroke-gray-800 fill-white',
  };

  level = signal<Level>(1);
  progressPercent = signal<number>(0);

  mapContainerRef = viewChild<ElementRef<HTMLDivElement>>('mapContainerRef');
  mapContainerEl = computed<HTMLDivElement | undefined>(
    () => this.mapContainerRef()?.nativeElement
  );
}
