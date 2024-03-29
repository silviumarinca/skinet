import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { BaskerRoutingModule } from './basker-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [BasketComponent],
  imports: [
    CommonModule,
    BaskerRoutingModule,
    SharedModule
  ]
})
export class BasketModule { }
