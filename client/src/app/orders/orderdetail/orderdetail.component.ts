import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  order: IOrder;
  constructor(   private bcService: BreadcrumbService, private orderService: OrderService, private activatedRoute: ActivatedRoute) {
    this.bcService.set('@orderDetails', '');
   }

  ngOnInit(): void {
   const id = this.activatedRoute.snapshot.paramMap.get('id');
   this.orderService.getOrderById(+id)
        .subscribe((order: IOrder) => {
            this.order = order;
            this.bcService.set('@orderDetails', `Order-#${id}-${order.status}`);
        }, err => console.log(err));
  }

}
