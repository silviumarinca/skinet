import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
@Input() checkoutForm: FormGroup;
deliveryMethod: IDeliveryMethod[];
  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods()
    .subscribe((dm: IDeliveryMethod[]) => {
        this.deliveryMethod = dm;
    },
    err => console.log(err));
  }
setShippingPrice(deliveryMethod: IDeliveryMethod){
  this.basketService.setShippingPrice(deliveryMethod);
}
}
