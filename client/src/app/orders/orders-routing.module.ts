import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { OrderdetailComponent } from './orderdetail/orderdetail.component';


const routes: Routes =[{path: '', component: OrdersComponent},
                       {path: ':id' , component: OrderdetailComponent, data: {breadcrumb: {alias: 'orderDetails'}
                      }}];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
