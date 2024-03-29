import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptors } from './core/interceptors/loading.interceptors';
import { JwtInterceptor } from './core/interceptors/jwtInterceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    HomeModule,
    NgxSpinnerModule
  ],
  providers: [
              {
                provide: HTTP_INTERCEPTORS,
                useClass: ErrorInterceptor,
                multi: true
              },
              {
                provide: HTTP_INTERCEPTORS,
                useClass: LoadingInterceptors,
                multi: true
              },
              {
                provide: HTTP_INTERCEPTORS,
                useClass: JwtInterceptor,
                multi: true
              }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
