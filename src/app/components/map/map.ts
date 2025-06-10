import { Directive, input } from '@angular/core';

@Directive()
export abstract class Map {
  className = input<string>(
    'absolute top-0 left-0 w-full h-full stroke-gray-800 fill-white'
  );
}
