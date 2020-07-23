import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IBasket, IBasketItem, Basket, IBasketTotals } from '../shared/models/basket';
import { map } from 'rxjs/operators';
import { IProduct } from '../shared/models/product';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal = this.basketTotalSource.asObservable();
  shipping = 0;
  constructor(private httpClient: HttpClient) { }


  setShippingPrice(deliveryMethod: IDeliveryMethod){
    this.shipping = deliveryMethod.price;
    this.calculateTotals();
  }
  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal});
  }

  incrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);

  }
  decrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if(basket.items[foundItemIndex].quantity > 1)
    {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item)
    }
    this.setBasket(basket);

  }
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(c => c.id === item.id)) {
      basket.items = basket.items.filter(c => c.id !== item.id);
      if(basket.items.length > 0) {
        this.setBasket(basket);
      }else{
        this.deleteBasket(basket);
      }
    }
  }
  deleteBasket(basket: IBasket) {
    return this.httpClient.delete(this.baseUrl + 'basket?id=' + basket.id)
    .subscribe(s => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, err => console.log(err));
  }
  getBasket(id: string) {
    return this.httpClient.get(this.baseUrl + 'basket?id=' + id)
    .pipe(map((basket: IBasket) => {
      this.basketSource.next(basket);
      console.log(this.getCurrentBasketValue());
    }));
  }
  setBasket(basket: IBasket) {
    return this.httpClient.post(this.baseUrl + 'basket', basket)
    .subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals();
    }, error => console.log(error));
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }
  addItemToBasket(item: IProduct, quantity = 1){
    const itemToAdd: IBasketItem = this.mapProductToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }
  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
        items[index].quantity += quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
     const basket = new Basket();
     localStorage.setItem('basket_id', basket.id);
     return basket;

  }
  mapProductToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
       id: item.id,
       productName: item.name,
       price: item.price,
       pictureUrl: item.pictureUrl,
       quantity,
       brand: item.productBrand,
       type: item.productType
    };
  }
  deleteLocalBasket(id: string){
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basketId');
  }
}
