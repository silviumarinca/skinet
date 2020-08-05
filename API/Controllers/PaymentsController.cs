using System.IO;
using System.Threading.Tasks;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;

namespace API.Controllers
{
    public class PaymentsController : BaseController
    {
        private readonly IPaymentService _paymentService;
        private const string WhSecret = "←[1mwhsec_5aUrBMPxLrO52EutXd0hpz72uzRfrHnY←[0m";
        private ILogger<IPaymentService> _logger;

        public PaymentsController(IPaymentService paymentService,ILogger<IPaymentService> logger)
        {
            this._paymentService= paymentService;
            this._logger = logger;
        }
        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
           var basket =  await _paymentService.CreateOrUpdatePaymentIntent(basketId);
            if(basket == null) return BadRequest(new ApiResponse(400, "Problem with your basket"));
            return basket;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility
                    .ConstructEvent(json,
                Request.Headers["Stripe-Signature"],
                WhSecret);
                PaymentIntent intent;
                Order order;
                switch (stripeEvent.Type)
                {
                    case "payment_intent.succeeded":
                        intent= (PaymentIntent) stripeEvent.Data.Object;
                        _logger.LogInformation("Payment succeded: ", intent.Id );
                        //Todo update order with new Status
                          order = await _paymentService.UpdateOrderPaymentSuceeded(intent.Id);
                        _logger.LogInformation("Order updated to payment recieved " + order.Id);
                        break;
                    case "payment_intent.payment_failed":
                     intent = (PaymentIntent)(stripeEvent.Data.Object);
                     _logger.LogInformation("Payment Failed", intent.Id);
                     order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                    _logger.LogInformation("Payment Failed", intent.Id);
                    break;

                }
                return new EmptyResult();
        }

        
    }
}