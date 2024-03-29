import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {   IBasketItem } from '../../models/basket';
import { IOrderItem } from '../../models/order';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
@Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
@Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
@Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
@Input() isBasket = true;
@Input() items: IBasketItem[] |IOrderItem[] = [];
@Input() isOrder = false;
  constructor( ) { }

  ngOnInit(): void {
  }
 decrementItemQuantity(item: IBasketItem) {
   this.decrement.next(item);
 }
 incrementItemQuantity(item: IBasketItem) {
  this.increment.next(item);
 }
 removeBasketItem(item: IBasketItem) {
  this.remove.next(item);
 }
}
