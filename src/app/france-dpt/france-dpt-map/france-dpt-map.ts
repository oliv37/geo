import { Component, input } from '@angular/core';

@Component({
  selector: 'geo-france-dpt-map',
  templateUrl: './france-dpt-map.html',
})
export class FranceDptMap {
  svgClass = input<string>(
    'absolute top-0 left-0 w-full h-full fill-white stroke-gray-800'
  );
}
