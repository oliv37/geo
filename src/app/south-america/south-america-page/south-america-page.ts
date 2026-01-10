import { Component } from '@angular/core';
import { Exercice } from '@shared/exercice/exercice/exercice';
import { southAmericaData } from '../south-america-data';
import { SouthAmericaMap } from '../south-america-map/south-america-map';

@Component({
  imports: [Exercice],
  templateUrl: './south-america-page.html',
})
export class SouthAmericaPage {
  SouthAmericaMap = SouthAmericaMap;
  southAmericaData = southAmericaData;
  fields = ['country', 'city'] as const;
}
