using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseController
    {
        private IBasketRepository _basketRepository;
        private readonly IMapper _mapper;
        public BasketController(IBasketRepository basket,IMapper mapper)
        {
            this._basketRepository = basket;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasketDto>> GetBasketById(string id)
        {
            var basket = await _basketRepository.getBasketAsync(id);
             var basketItem=    basket?? new CustomerBasket(id);
             var basketdtd=_mapper.Map<CustomerBasket,CustomerBasketDto>(basketItem);
            return Ok(basketdtd);
            
        }
        [HttpPost]
        public async Task<ActionResult<CustomerBasketDto>> UpdateBaket(CustomerBasketDto basket) 
        {
            var basketdtd=_mapper.Map<CustomerBasketDto,CustomerBasket>(basket);
            var UpdateBaket = await _basketRepository.UpdateBasketAsync(basketdtd);
            return Ok(_mapper.Map<CustomerBasket,CustomerBasketDto>(UpdateBaket)); 
        }
        [HttpDelete]
        public async Task  DeleteBasketAsync(string id) 
        {
            var UpdateBaket = await _basketRepository.DeleteBasketAsync(id);
            
        }
    }


}