/* 3rd party modules */
import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/operator/takeWhile';

/**
 * Class that monitors component lifecycle
 */
export class AliveState implements OnDestroy {
  /**
   * Is Alive?
   */
  private _alive = true;

  /**
   * Set alive flag to false when an element is destroyed
   */
  public ngOnDestroy(): void {
    this._alive = false;
  }

  /**
   * Subscribe the observable and automatically cancel subscription when element is destroyed
   */
  protected subscribeWhileAlive(...subjects: Array<Observable<any>>): void {
    subjects.forEach((subject) => subject.takeWhile(() => this._alive).subscribe());
  }
}
