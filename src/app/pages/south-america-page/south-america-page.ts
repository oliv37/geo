import { Component } from '@angular/core';
import { southAmericaData } from '@datas/south-america-data';
import { Exercice } from '@components/exercice/exercice';
import { SouthAmericaMap } from '@components/map/south-america-map/south-america-map';

@Component({
  imports: [Exercice],
  templateUrl: './south-america-page.html',
})
export class SouthAmericaPage {
  SouthAmericaMap = SouthAmericaMap;
  southAmericaData = southAmericaData;
  fields = ['country', 'city'] as const;
}
