using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseController
    {
        private IBasketRepository _basketRepository;
        public BasketController(IBasketRepository basket)
        {
            this._basketRepository= basket;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            var basket = await _basketRepository.getBasketAsync(id);

            return Ok(basket?? new CustomerBasket(id));
            
        }
        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBaket(CustomerBasket basket) 
        {
            var UpdateBaket = await _basketRepository.UpdateBasketAsync(basket);
            return Ok(UpdateBaket); 
        }
        [HttpDelete]
        public async Task  DeleteBasketAsync(string id) 
        {
            var UpdateBaket = await _basketRepository.DeleteBasketAsync(id);
            
        }
    }


}