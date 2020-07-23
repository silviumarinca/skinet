import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderdetailComponent } from './orderdetail/orderdetail.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [OrderdetailComponent, OrdersComponent],
  imports: [
    OrdersRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class OrderModule { }
