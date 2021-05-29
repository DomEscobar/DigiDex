import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strength'
})
export class StrengthPipe implements PipeTransform {

  transform(strength: string | undefined, isStrongAgainst = true): unknown {
    const str = Number(strength || "0")

    return isStrongAgainst ? (str + (str / 2)) : str;
  }

}
