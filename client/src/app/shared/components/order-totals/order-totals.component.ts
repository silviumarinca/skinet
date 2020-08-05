import { Component, OnInit, Input } from '@angular/core';
import { IBasketTotals } from '../../models/basket';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {
basketTotals$: Observable<IBasketTotals>;
@Input() shippingPrice: number;
@Input() subtotal: number;
@Input() total: number;
  constructor(private basketService: BasketService) {
   }

  ngOnInit(): void {
    this.basketTotals$ = this.basketService.basketTotal$;
  }

}
