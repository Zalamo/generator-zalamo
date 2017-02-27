import { Pipe, PipeTransform } from '@angular/core';

/**
 * A fallback pipe. If the value provided is null or undefined, the fallback value is returned
 */
@Pipe({ name: 'fallback' })
export class FallbackPipe implements PipeTransform {
  public transform(value: any, fallback: any = ''): any {
    return value == null ? fallback : value;
  }
}
