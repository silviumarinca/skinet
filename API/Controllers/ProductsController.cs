using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseController
    {
          private readonly IGenericRepository<Product>   _productsRepo;
          private readonly IGenericRepository<ProductBrand>  _productBrandRepo;
          private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> productsRepo,
        IGenericRepository<ProductBrand> productBrandRepo,
        IGenericRepository<ProductType> productTypeRepo,
        IMapper mapper
        )
        {
          
               _productsRepo = productsRepo;
           _productBrandRepo = productBrandRepo;
            _productTypeRepo = productTypeRepo ;
                     _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts(string sort, int? brandId, int? typeId)
        {
            var spec  = new ProductsWithTypesAndBrandsSpecification(brandId,typeId,sort);
            var products = await this._productsRepo.ListAsync(spec);

            return  Ok(_mapper.Map<IReadOnlyList<Product>,IReadOnlyList<ProductToReturnDto>>(products));
        }
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
          [ProducesResponseType(typeof(ApiResponse),StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> getProduct(int id)
        {
            var spec  = new ProductsWithTypesAndBrandsSpecification(id);
            
            var product = await    this._productsRepo.GetEntityWithSpec(spec);
            if(product == null) return NotFound( new ApiResponse(404));
            return _mapper.Map<Product,ProductToReturnDto>(product);
        }

          [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            var brands = await _productBrandRepo.ListAllAsync();

            return Ok(brands);
        }
            [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            var types =await _productTypeRepo.ListAllAsync();
            return Ok(types);
        }
    }
}