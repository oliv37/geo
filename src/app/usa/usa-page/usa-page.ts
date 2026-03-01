import { Component } from '@angular/core';
import { usaTitle, usaData, usaFields } from '../usa-data';
import { UsaMap } from '../usa-map/usa-map';
import { MainPage } from '@shared/main-page/main-page';

@Component({
  imports: [MainPage],
  templateUrl: './usa-page.html',
})
export class UsaPage {
  usaTitle = usaTitle;
  UsaMap = UsaMap;
  usaData = usaData;
  usaFields = usaFields;
}
