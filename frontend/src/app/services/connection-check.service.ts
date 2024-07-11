import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionCheckService {
  checked = new BehaviorSubject<boolean | null>(null);
  checked$: Observable<boolean | null> = this.checked.asObservable();

  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
  ) {}

  checkForConnection() {
    // const everyMinute$ = interval(60 * 1000);
    const everyTenSeconds$ = interval(10 * 1000);

    everyTenSeconds$.subscribe(async () => {
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
