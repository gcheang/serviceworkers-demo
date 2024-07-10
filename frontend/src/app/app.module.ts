import { NgModule, isDevMode } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';

// import { InMemoryDataService } from './services/in-memory-data.service';
import { ApiService } from './services/api.service';
import { AppComponent } from './app.component';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    // HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
    //   delay: 100,
    // }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ButtonModule,
    ToastModule,
    SelectButtonModule,
    ConfirmDialogModule,
  ],
  providers: [
    provideAnimations(),
    MessageService,
    ApiService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
