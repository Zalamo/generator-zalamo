import {
  camelCase, capitalize, deburr, escape, escapeRegExp, kebabCase, lowerCase, lowerFirst, pad, padEnd, padStart,
  snakeCase, startCase, truncate, unescape, upperCase, upperFirst
} from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * String format pipe, uses lodash string transform methods
 */
@Pipe({ name: 'stringFormat' })
export class StringFormatPipe implements PipeTransform {
  public transform(value: any, method: string, ...args: Array<any>): string {
    switch (method) {
      case 'camelCase':
        return camelCase(value);
      case 'capitalize':
        return capitalize(value);
      case 'deburr':
        return deburr(value);
      case 'escape':
        return escape(value);
      case 'escapeRegExp':
        return escapeRegExp(value);
      case 'kebabCase':
        return kebabCase(value);
      case 'lowerCase':
        return lowerCase(value);
      case 'lowerFirst':
        return lowerFirst(value);
      case 'pad':
        return (<any> pad)(value, ...args);
      case 'padEnd':
        return (<any> padEnd)(value, ...args);
      case 'padStart':
        return (<any> padStart)(value, ...args);
      case 'snakeCase':
        return snakeCase(value);
      case 'startCase':
        return startCase(value);
      case 'truncate':
        return (<any> truncate)(value, ...args);
      case 'unescape':
        return unescape(value);
      case 'upperCase':
        return upperCase(value);
      case 'upperFirst':
        return upperFirst(value);
      default:
        return value;
    }
  }
}
