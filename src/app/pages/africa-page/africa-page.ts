import { Component } from '@angular/core';
import { africaData } from '@datas/africa-data';
import { Exercice } from '@components/exercice/exercice';
import { AfricaMap } from '@components/map/africa-map/africa-map';

@Component({
  imports: [Exercice],
  templateUrl: './africa-page.html',
})
export class AfricaPage {
  AfricaMap = AfricaMap;
  africaData = africaData;
  fields = ['country', 'capital'] as const;
}
