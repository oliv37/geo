import { Component } from '@angular/core';
import { africaTitle, africaData, africaFields } from '../africa-data';
import { AfricaMap } from '../africa-map/africa-map';
import { MainPage } from '@shared/main-page/main-page';

@Component({
  imports: [MainPage],
  templateUrl: './africa-page.html',
})
export class AfricaPage {
  africaTitle = africaTitle;
  AfricaMap = AfricaMap;
  africaData = africaData;
  africaFields = africaFields;
}
