import { Component, OnInit } from '@angular/core'; 
import { IOrder } from 'src/app/shared/models/order';
import { OrderService } from './order.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public orders: IOrder[];
  constructor(private orderService: OrderService, private router: Router) {
    this.orderService.getOrders();
   }

  ngOnInit() {
     this.getOrders();
  }
  getOrders() {
    this.orderService.getOrdersForUser().subscribe((orders: IOrder[]) => {
      this.orders = orders;
    }, err => console.log(err));
  }
  viewOrder(order: IOrder) {
    this.router.navigateByUrl(`orders/${order.id}`);
  }
}
