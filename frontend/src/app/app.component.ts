import { Component } from '@angular/core';
import { UpdateCheckService } from './services/update-check.service';
import { ApiService } from './services/api.service';
import { IHero } from './interfaces/hero';
import { ConnectionCheckService } from './services/connection-check.service';
import { DataService } from './services/data.service';
import { InputSwitchChangeEvent } from 'primeng/inputswitch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'serviceworker-demo';

  hasInit: boolean = false;

  data: IHero[] = [];

  hasConnection: boolean = true;

  updateTimer: number = 0;
  connectionTimer: number = 0;

  lastUpdate: boolean | null = null;
  lastConnection: boolean | null = null;

  usingCache: boolean | null = null;
  cacheAge: Date | null = null;

  constructor(
    private updateCheckService: UpdateCheckService,
    private connectionCheckService: ConnectionCheckService,
    private apiService: ApiService,
    private dataService: DataService,
  ) {
    this.updateCheckService.checkForUpdate();
    this.updateCheckService.checked$.subscribe((data) => {
      this.updateTimer = 0;
      this.lastUpdate = data;
    });

    this.connectionCheckService.checkForConnection();
    this.connectionCheckService.checked$.subscribe((data) => {
      this.connectionTimer = 0;
      this.lastConnection = data;
    });

    this.dataService.heroesData$.subscribe((data) => {
      this.data = data;
    });

    this.dataService.isCacheData$.subscribe((data) => (this.usingCache = data));
    this.dataService.cacheAge$.subscribe((data) => (this.cacheAge = data));
  }

  initTimer = () => {
    this.hasInit = true;
    setInterval(() => {
      this.updateTimer++;
      this.connectionTimer++;
    }, 1000);
  };

  getData = () => {
    this.dataService.updateHeroesData();
  };

  toggleConnection = () => {
    this.apiService.updateHasConnection(this.hasConnection);
  };

  getFormatedDateTime = (date: Date | null) => {
    if (!date) return '';

    try {
      const isoStringCorrectTime = new Date(
        date.valueOf() - date.getTimezoneOffset() * 60 * 1000,
      ).toISOString();

      return (
        isoStringCorrectTime.split('T')[0] +
        ' ' +
        isoStringCorrectTime.split('T')[1].slice(0, 8)
      );
    } catch (err) {
      console.error('getFormatedDateTime: ', date);
      return '';
    }
  };
}
