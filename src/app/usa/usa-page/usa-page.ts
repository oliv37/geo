import { Component } from '@angular/core';
import { Exercice } from '@shared/exercice/exercice/exercice';
import { usaData } from '../usa-data';
import { UsaMap } from '../usa-map/usa-map';

@Component({
  imports: [Exercice],
  templateUrl: './usa-page.html',
})
export class UsaPage {
  UsaMap = UsaMap;
  usaData = usaData;
  fields = ['state', 'city'] as const;
}
