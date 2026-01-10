import {
  AfterViewInit,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  Type,
  viewChild,
} from '@angular/core';
import { Map } from '@shared/map/map';
import type { Data } from '@shared/data';
import type { StateOpts } from '@shared/exercice/exercice';
import { ExerciceMapContainer } from '../exercice-container/exercice-map-container';
import { ExerciceState } from '@shared/exercice/exercice-state';
import { isPlatformBrowser } from '@angular/common';

@Directive()
export abstract class ExerciceLevel<T extends Data>
  implements OnInit, AfterViewInit
{
  exerciceState = inject(ExerciceState<T>);
  platformId = inject(PLATFORM_ID);

  abstract exerciceStateOpts: StateOpts<T>;

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

  readonly isClientSide = isPlatformBrowser(this.platformId);

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
