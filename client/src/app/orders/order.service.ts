import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IOrder } from '../shared/models/order';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.apiUrl;
  private orderSource = new Subject<IOrder[]>();
  orders$ = this.orderSource.asObservable();
  constructor(private httpClient: HttpClient) { }


  getOrders(){
    return this.httpClient.get<IOrder[]>(this.baseUrl + 'Orders');
 
  }
  getOrderById(id: number){ 
  return this.httpClient.get<IOrder>(this.baseUrl + `Orders/${id}` );
  }
  getOrdersForUser( ){
    return this.httpClient.get<IOrder[]>(this.baseUrl + `orders` );
    }
    getOrderDetailed(id: number){
      return this.httpClient.get<IOrder>(this.baseUrl + `Orders/${id}` );
      }
}
