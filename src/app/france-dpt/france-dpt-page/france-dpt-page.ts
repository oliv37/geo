import { Component } from '@angular/core';
import { FranceDptMap } from '../france-dpt-map/france-dpt-map';
import { franceDptData } from '../france-dpt-data';
import { ReadView } from '@shared/read-view/read-view';

@Component({
  imports: [ReadView],
  templateUrl: './france-dpt-page.html',
})
export class FranceDptPage {
  FranceDptMap = FranceDptMap;
  franceDptData = franceDptData;
  fields = ['department', 'city', 'id'] as const;
}
