import { Component } from '@angular/core';
import { FranceDptMap } from '../france-dpt-map/france-dpt-map';
import {
  franceDptTitle,
  franceDptData,
  franceDptFields,
} from '../france-dpt-data';
import { MainPage } from '@shared/main-page/main-page';

@Component({
  imports: [MainPage],
  templateUrl: './france-dpt-page.html',
})
export class FranceDptPage {
  franceDptTitle = franceDptTitle;
  FranceDptMap = FranceDptMap;
  franceDptData = franceDptData;
  franceDptFields = franceDptFields;
}
