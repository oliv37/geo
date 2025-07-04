import {
  AfterViewInit,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  Type,
  viewChild,
} from '@angular/core';
import { Map } from '@components/map/map';
import type { Data } from '@models/data/data';
import type { ExerciceStateOpts } from '@models/exercice-state-opts';
import { ExerciceMapContainer } from '@components/exercice/exercice-container/exercice-map-container';
import { ExerciceState } from '@services/exercice-state';

@Directive()
export abstract class ExerciceLevel<T extends Data>
  implements OnInit, AfterViewInit
{
  exerciceState = inject(ExerciceState<T>);

  abstract exerciceStateOpts: ExerciceStateOpts<T>;

  data = input.required<readonly T[]>();
  fields = input.required<readonly (keyof T)[]>();
  Map = input.required<Type<Map>>();

  mapContainerRef = viewChild<ExerciceMapContainer, ElementRef<HTMLElement>>(
    'mapContainerRef',
    { read: ElementRef }
  );
  mapContainerEl = computed<HTMLElement | undefined>(
    () => this.mapContainerRef()?.nativeElement
  );

  readonly isClientSide = typeof window !== 'undefined';

  selectCurrentItemOnMapEffect = effect(() => {
    this.selectCurrentItemOnMap();
  });

  ngOnInit() {
    this.exerciceState.init(this.exerciceStateOpts);
  }

  ngAfterViewInit() {
    this.selectCurrentItemOnMap();
  }

  selectCurrentItemOnMap() {
    if (!this.isClientSide) {
      return;
    }

    this.mapContainerEl()
      ?.querySelectorAll('path.selected, g.selected')
      .forEach((path) => path.classList.remove('selected'));

    const id: string | number = this.exerciceState.currentItem().id;

    this.mapContainerEl()
      ?.querySelector(`path[id="${id}"], g[id="${id}"]`)
      ?.classList.add('selected');
  }
}
