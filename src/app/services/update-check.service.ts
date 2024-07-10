import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, concat, interval, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateCheckService {
  checked = new BehaviorSubject<boolean | null>(null);
  checked$: Observable<boolean | null> = this.checked.asObservable();

  constructor(
    private appRef: ApplicationRef,
    private updates: SwUpdate,
    private messageService: MessageService,
  ) {}

  // Allow the app to stabilize first, before starting
  // polling for updates with `interval()`.
  checkForUpdate() {
    const appIsStable$ = this.appRef.isStable.pipe(
      first((isStable) => isStable === true),
    );

    // const everySixHours$ = interval(6 * 60 * 60 * 1000);
    // const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    const everyTenSeconds$ = interval(10 * 1000);
    const everyTenSecondsOnceAppIsStable$ = concat(
      appIsStable$,
      everyTenSeconds$,
    );

    everyTenSecondsOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.updates.checkForUpdate();
        updateFound
          ? this.sendErrorToast('A new version is available.')
          : this.sendToast('Already on the latest version.');
        this.checked.next(true);
      } catch (err) {
        this.sendToast('Failed to check for updates: ' + err);
        this.checked.next(false);
      }
    });
  }

  sendToast(msg: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Ping for updates',
      detail: msg,
    });
  }

  sendErrorToast(msg: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Ping for connection',
      detail: msg,
    });
  }
}
