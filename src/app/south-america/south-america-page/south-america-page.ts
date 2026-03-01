import { Component } from '@angular/core';
import {
  southAmericaTitle,
  southAmericaData,
  southAmericaFields,
} from '../south-america-data';
import { SouthAmericaMap } from '../south-america-map/south-america-map';
import { MainPage } from '@shared/main-page/main-page';

@Component({
  imports: [MainPage],
  templateUrl: './south-america-page.html',
})
export class SouthAmericaPage {
  southAmericaTitle = southAmericaTitle;
  SouthAmericaMap = SouthAmericaMap;
  southAmericaData = southAmericaData;
  southAmericaFields = southAmericaFields;
}
