import { ApplicationRef, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, concat, first, interval, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionCheckService {
  checked = new BehaviorSubject<boolean | null>(null);
  checked$: Observable<boolean | null> = this.checked.asObservable();

  constructor(
    private appRef: ApplicationRef,
    private messageService: MessageService,
    private apiService: ApiService,
  ) {}

  // Allow the app to stabilize first, before starting
  // polling for updates with `interval()`.
  checkForConnection() {
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
        this.apiService.ping().subscribe({
          next: () => {
            this.sendToast('Connection successful.');
            this.checked.next(true);
          },
          error: () => {
            this.sendErrorToast('Connection unsuccessful.');
            this.checked.next(false);
          },
        });
      } catch (err) {
        this.sendToast('Failed to check for connection: ' + err);
        this.checked.next(false);
      }
    });
  }

  sendToast(msg: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Ping for connection',
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
