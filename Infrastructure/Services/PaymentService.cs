using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using Product = Core.Entities.Product;
using Order = Core.Entities.OrderAggregate.Order;
namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public PaymentService(IBasketRepository basketRepository, IUnitOfWork unitOfWork, IConfiguration config)
        {
            this._basketRepository = basketRepository;
            this._unitOfWork = unitOfWork;
            this._config = config;
        }
        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];
            var basket= await _basketRepository.getBasketAsync(basketId);
            var shippingPrice = 0m;
            if(basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await _unitOfWork
                                        .Repository<DeliveryMethod>()
                                        .GetByIdAsync((int)basket.DeliveryMethodId);
              shippingPrice = deliveryMethod.Price;
            }
              foreach(var item in basket.Items){
                  var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                  if(item.Price != productItem.Price)
                  {
                      item.Price = productItem.Price;
                  }
              }
              var Service = new PaymentIntentService();
              PaymentIntent intent;
              if(string.IsNullOrEmpty(basket.PaymentIntentId))
              {
                  var options = new PaymentIntentCreateOptions
                  {
                      Amount = (long)basket.Items.Sum(intent=>intent.Quantity * (intent.Price*100))+((long)shippingPrice*100),
                      Currency="USD",
                      PaymentMethodTypes= new List<string>(){"card"}
                  };
                  intent = await Service.CreateAsync(options);
                  basket.PaymentIntentId=intent.Id;
                  basket.ClientSecret = intent.ClientSecret;
              }else
              {
                  var options = new PaymentIntentUpdateOptions
                                {
                                     Amount = (long)basket.Items.Sum(intent=>intent.Quantity * (intent.Price*100))+((long)shippingPrice*100)
                                };

                        await Service.UpdateAsync(basket.PaymentIntentId,options);
              }
               await _basketRepository.UpdateBasketAsync(basket);
               
          
            return basket;
            
        }

        public async Task<Order> UpdateOrderPaymentFailed(string paymentIntentId)
        {
                  var spec= new Core.Specifications.OrderByPaymentIntentIdSpecification(paymentIntentId);
                 var order =await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
                  if (order == null) return null;

                  order.Status = OrderStatus.PaymentFailed;
                  await _unitOfWork.Complete();
                  return order; 
        }

        public async Task<Order> UpdateOrderPaymentSuceeded(string paymentIntentId)
        {
            var spec= new Core.Specifications.OrderByPaymentIntentIdSpecification(paymentIntentId);
            var order =await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) return null;

            order.Status = OrderStatus.PaymentRecevied;
            _unitOfWork.Repository<Order>().Update(order);

            await _unitOfWork.Complete();
            return order;

        }
    }
}