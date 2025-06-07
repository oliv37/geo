import { Directive, input } from '@angular/core';

@Directive()
export abstract class Map {
  className = input<string>('');
}
