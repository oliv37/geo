import { Component } from '@angular/core';
import { Exercice } from '@shared/exercice/exercice/exercice';
import { africaData } from '../africa-data';
import { AfricaMap } from '../africa-map/africa-map';

@Component({
  imports: [Exercice],
  templateUrl: './africa-page.html',
})
export class AfricaPage {
  AfricaMap = AfricaMap;
  africaData = africaData;
  fields = ['country', 'city'] as const;
}
