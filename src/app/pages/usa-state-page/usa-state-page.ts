import { Component } from '@angular/core';
import { usaStateData } from '@datas/usa-state-data';
import { Exercice } from '@components/exercice/exercice';
import { UsaStateMap } from '@components/map/usa-state-map/usa-state-map';

@Component({
  imports: [Exercice],
  templateUrl: './usa-state-page.html',
})
export class UsaStatePage {
  UsaStateMap = UsaStateMap;
  usaStateData = usaStateData;
  fields = ['state', 'capital'] as const;
}
