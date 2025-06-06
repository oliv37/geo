import { Component, input } from '@angular/core';
import { Exercice } from '@components/exercice/exercice';
import { UsaStateMap } from '@components/maps/usa-state-map/usa-state-map';
import { usaStateData } from '@datas/usa-state-data';

@Component({
  imports: [Exercice],
  templateUrl: './usa-state-page.html',
})
export class UsaStatePage {
  UsaStateMap = UsaStateMap;
  usaStateData = usaStateData;
  fields = ['state', 'capital'] as const;
}
