import { Component, input } from '@angular/core';

@Component({
  selector: 'app-usa-state-map',
  imports: [],
  templateUrl: './usa-state-map.html',
})
export class UsaStateMap {
  className = input<string>('');
}
