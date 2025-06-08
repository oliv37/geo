import { Directive, input } from '@angular/core';

@Directive()
export abstract class Icon {
  className = input('w-7 h-7');
}
