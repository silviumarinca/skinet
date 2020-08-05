import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from 'src/app/shared/models/basket';
import { FormGroup } from '@angular/forms';
import { IOrder } from 'src/app/shared/models/order';
import { Router, NavigationExtras } from '@angular/router';


declare var Stripe;
@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements  AfterViewInit, OnDestroy {
@Input() checkoutForm: FormGroup;
@ViewChild('cardNumber', {static: true}) cardNumberElement: ElementRef;
@ViewChild('cardExpiry', {static: true}) cardExpiryElement: ElementRef;
@ViewChild('cardCvc', {static: true}) cardCvcElement: ElementRef;
stripe: any;
cardNumber: any;
cardExpiry: any;
cardCvc: any;
cardErrors: any;
cardHandler = this.onChange.bind(this);
loading = false;
cardNumberValid = false;
cardExpiryValid = false;
cardCvcValid = false;

  constructor(private basketService: BasketService, private checkoutService: CheckoutService,
              private toaster: ToastrService, private router: Router) { }

onChange(event) {


  if (event.error) {
    this.cardErrors = event.error.message;
  } else {
    this.cardErrors = null;
  }
  switch (event.elementType){
    case 'cardNumber':
      this.cardNumberValid = event.complete; break;
    case 'cardExpiry':
      this.cardExpiryValid = event.complete; break;
    case 'cardCvc':
      this.cardCvcValid = event.complete;
      break;
  }
}

  ngAfterViewInit(): void {
    this.stripe = Stripe(`pk_test_doaltQ5ylvOYQ4UIBLw54e1w007Z6pftY7`);
    const elemets = this.stripe.elements();
    this.cardNumber = elemets.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);
    this.cardExpiry = elemets.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);


    this.cardCvc = elemets.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);

  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }
  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    try{
    const createdOrder = await this.createOrder(basket);
    const paymentResult = await this.confirmPaymentWithStripe(basket);
    if (paymentResult.paymentIntent) {
            this.basketService.deleteBasket(basket);
            const navigationExtras: NavigationExtras = {state: createdOrder};
            this.router.navigate(['checkout/success'], navigationExtras);
      } else {
            this.toaster.error(paymentResult.error.message);
      }
    this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  private async createOrder(basket: IBasket){
    const orderToCreate = this.getorderToCreate(basket);
    return   this.checkoutService.createOrder(orderToCreate).toPromise();
  }
  private async confirmPaymentWithStripe(basket: IBasket){
    return   this.stripe.confirmCardPayment(basket.clientSecret, {payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm').get('nameOnCard').value
        }
      }
    });
  }



  private getorderToCreate(basket: IBasket) {
    return {
            basketId: basket.id,
            deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
            shipToAddress: this.checkoutForm.get('addressForm').value
          };
  }

}
