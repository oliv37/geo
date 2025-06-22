import { Component } from '@angular/core';
import { Exercice } from '@components/exercice/exercice';
import { FraDptMap } from '@components/map/fra-dpt-map/fra-dpt-map';
import { fraDptData } from '@datas/fra-dpt-data';

@Component({
  imports: [Exercice],
  templateUrl: './fra-dpt-page.html',
})
export class FraDptPage {
  FraDptMap = FraDptMap;
  fraDptData = fraDptData;
  fields = ['department', 'city', 'id'] as const;
}
