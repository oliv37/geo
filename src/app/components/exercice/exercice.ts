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
import type { Data } from '@models/data';
import { LEVELS, type Level } from '@models/level';
import { Map } from '@components/map/map';
import { ExerciceLevel1 } from '@components/exercice-level/exercice-level-1/exercice-level-1';
import { ExerciceLevel2 } from '@components/exercice-level/exercice-level-2/exercice-level-2';
import { ExerciceLevel3 } from '@components/exercice-level/exercice-level-3/exercice-level-3';
import { Icon } from '@components/icon/icon';
import { OneCircleIcon } from '@components/icon/1-circle-icon/1-circle-icon';
import { OneCircleFillIcon } from '@components/icon/1-circle-fill-icon/1-circle-fill-icon';
import { TwoCircleIcon } from '@components/icon/2-circle-icon/2-circle-icon';
import { ThreeCircleIcon } from '@components/icon/3-circle-icon/3-circle-icon';
import { TwoCircleFillIcon } from '@components/icon/2-circle-fill-icon/2-circle-fill-icon';
import { ThreeCircleFillIcon } from '@components/icon/3-circle-fill-icon/3-circle-fill-icon';

@Component({
  selector: 'app-exercice',
  imports: [NgComponentOutlet, ExerciceLevel1, ExerciceLevel2, ExerciceLevel3],
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

  readonly levels = LEVELS;
  readonly levelIcons: Record<Level, Type<Icon>> = {
    1: OneCircleIcon,
    2: TwoCircleIcon,
    3: ThreeCircleIcon,
  };
  readonly levelFillIcons: Record<Level, Type<Icon>> = {
    1: OneCircleFillIcon,
    2: TwoCircleFillIcon,
    3: ThreeCircleFillIcon,
  };
  readonly iconInputs: Record<string, unknown> = {
    className: 'w-6 h-6',
  };

  level = signal<Level>(1);
  progressPercent = signal<number>(0);

  mapContainerRef = viewChild<ElementRef<HTMLDivElement>>('mapContainerRef');
  mapContainerEl = computed<HTMLDivElement | undefined>(
    () => this.mapContainerRef()?.nativeElement
  );
}
