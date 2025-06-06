import { Component } from '@angular/core';
import { AbstractMap } from '@components/maps/abstract-map';

@Component({
  selector: 'app-usa-state-map',
  templateUrl: './usa-state-map.html',
})
export class UsaStateMap extends AbstractMap {}
