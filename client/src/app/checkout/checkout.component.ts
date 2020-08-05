import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { Observable } from 'rxjs';
import { IBasketTotals } from '../shared/models/basket';
import { BasketService } from '../basket/basket.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
 basketTotals$: Observable<IBasketTotals>;
  checkoutForm: FormGroup;
  constructor(private fb: FormBuilder,private basketService: BasketService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
    this.basketTotals$ = this.basketService.basketTotal$;
  }
createCheckoutForm() {
  this.checkoutForm = this.fb.group({
    addressForm: this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      street: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zipCode: [null, Validators.required],
    }),
    deliveryForm: this.fb.group({
      deliveryMethod:[null, Validators.required]
    }),
    paymentForm: this.fb.group({
      nameOnCard: [null, Validators.required]
    })
  });
}
addressValid(){
  return this.checkoutForm.get('addressForm').valid;
}
deliveryValid(){
  return this.checkoutForm.get('deliveryForm').valid;
}
paymentValid(){
  return this.checkoutForm.get('paymentForm').valid;
}
getAddressFormValues(){
  this.accountService.getUserAddress().subscribe(address => {
    console.log(address);
    if (address){
        this.checkoutForm.get('addressForm').patchValue(address);
      }
  }, error =>{
    console.log(error);
  });
}
getDeliveryMethodValue() {
  const basket = this.basketService.getCurrentBasketValue();
  if (basket.deliveryMethodId !== null) {
    this.checkoutForm.get('deliveryForm').get('deliveryMethod').patchValue(basket.deliveryMethodId.toString());
  }
}
}
