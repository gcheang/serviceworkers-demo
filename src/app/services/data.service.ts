import { Injectable } from '@angular/core';
import { IHero } from '../interfaces/hero';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CacheHero, db } from '../db';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private heroesData = new BehaviorSubject<IHero[]>([]);
  heroesData$: Observable<IHero[]> = this.heroesData.asObservable();

  private isCacheData = new BehaviorSubject<boolean | null>(null);
  isCacheData$: Observable<boolean | null> = this.isCacheData.asObservable();

  private cacheAge = new BehaviorSubject<Date | null>(null);
  cacheAge$: Observable<Date | null> = this.cacheAge.asObservable();

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  updateHeroesData() {
    // try to update
    this.apiService.getHeroes().subscribe({
      next: async (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Length: ' + data.length,
        });
        this.heroesData.next(data);
        this.isCacheData.next(false);
        this.cacheAge.next(null);

        // save heroesData in cache
        db.transaction('rw', [db.cacheMetadataTbl, db.cacheHeroesTbl], (tx) => {
          db.cacheMetadataTbl.add({ cacheDate: new Date() }).then((cacheId) => {
            data.forEach(
              async (entry: CacheHero) =>
                await db.cacheHeroesTbl.add({
                  cacheId: cacheId,
                  heroId: entry.heroId,
                  heroName: entry.heroName,
                }),
            );
          });
        })
          .then((result) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Successfully cached new data.',
            });

            this.clearOldCaches();
          })
          .catch((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'Could not cache data',
            });
          });
      },
      error: (err) => {
        // console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: err.body.error,
        });
        // if fail, prompt to try again or get cached data
        this.prompt();
      },
    });
  }

  prompt() {
    this.confirmationService.confirm({
      message: 'Fetch failed. Would you like to retry?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'none',
      acceptLabel: 'Retry',
      rejectIcon: 'none',
      rejectLabel: 'Use cached data',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        setTimeout(() => this.updateHeroesData(), 500);
      },
      reject: () => {
        this.useCached();
      },
    });
  }

  useCached() {
    const now = new Date();

    db.cacheMetadataTbl
      .where('cacheDate')
      .aboveOrEqual(new Date(now.getTime() - 60 * 1000))
      .reverse()
      .sortBy('cacheDate')
      .then((data) => {
        if (data.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'Cache is empty!',
          });
        } else {
          db.cacheHeroesTbl
            .where({ cacheId: data[0].id })
            .toArray()
            .then((res) => {
              this.heroesData.next(res);
              this.isCacheData.next(true);
              this.cacheAge.next(data[0].cacheDate);
            });

          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Using cached data.',
          });
        }
      });
  }

  clearOldCaches() {
    const now = new Date();

    db.cacheMetadataTbl
      .reverse()
      .sortBy('cacheDate')
      .then((data) => {
        data.forEach((entry, i) => {
          if (i != 0) {
            db.cacheHeroesTbl
              .where('cacheId')
              .equals(entry.id ?? -1)
              .delete();
            db.cacheMetadataTbl.delete(entry.id ?? -1);
          }
        });
      });
  }
}
