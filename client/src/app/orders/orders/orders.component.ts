import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from 'src/app/shared/models/order';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public orders: Observable<IOrder[]>;
  constructor(private orderService: OrderService, private router:Router) {
    this.orderService.getOrders();
   }

  ngOnInit() {
    this.orders = this.orderService.orders$;
  }
  viewOrder($event: IOrder){
    console.log($event);
    this.router.navigate(['/orders', $event.id ]);

  }
}
