import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  orderDetail: IOrder;
  constructor(   private bcService: BreadcrumbService, private orderService: OrderService, private activatedRoute: ActivatedRoute) {
    this.bcService.set('@orderDetails', '');
   }

  ngOnInit(): void {
     this.orderService.getOrderById( +this.activatedRoute.snapshot.paramMap.get('id'))
     .subscribe(o =>{ 
       this.bcService.set('@orderDetails', `Order#${o.id} - Pending`);
     //  this.orderDetail = o
      });
  }

}
