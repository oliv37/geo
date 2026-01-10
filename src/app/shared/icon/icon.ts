import { Directive, input } from '@angular/core';

@Directive()
export abstract class Icon {
  iconClass = input('w-8 h-8');
}
