using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
          IBasketRepository _basketRepo;
          IUnitOfWork _unitOfWork;
        public OrderService( IBasketRepository basketRepo,IUnitOfWork unitOfWork)
        {
            this._basketRepo= basketRepo;
            this._unitOfWork = unitOfWork;
        }
        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAdress)
        {
             var basket = await _basketRepo.getBasketAsync(basketId);
                var items = new List<OrderItem>();
            foreach( var item in basket.Items){
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id,productItem.Name,productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered,productItem.Price, item.Quantity);
                items.Add(orderItem);
            
            }
            var deliveryMethod = await  _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            var subtotal = items.Sum(c=>c.Price * c.Quantity);
            var order = new Order(items,buyerEmail,shippingAdress,deliveryMethod,subtotal);
                _unitOfWork.Repository<Order>().Add(order);

            var result = await _unitOfWork.Complete();

            if(result >= 0) return null;

            //delete Basket
            await _basketRepo.DeleteBasketAsync(basketId);
            return order;
        }

 
        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
                    var spec = new OrderWithItemsAndOrderingSpecification(id,buyerEmail);
           return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrderForUserAsync(string buyerEmail)
        {
           var spec = new OrderWithItemsAndOrderingSpecification(buyerEmail);
           return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}