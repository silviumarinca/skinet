using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification( ProductSpecParams productParams )
        :base(x =>
                (string.IsNullOrEmpty(productParams.Search)|| x.Name.ToLower()
                .Contains(productParams.Search)) &&
                (!productParams.BrandId.HasValue|| x.ProductTypeId == productParams.BrandId) &&
                (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)
         )
        {
            AddInclude(c=>c.ProductBrand);
            AddInclude(c=>c.ProductType);
            AddOrderBy(x=>x.Name);
            ApplyPaging((productParams.PageIndex-1)*productParams.PageSize,productParams.PageSize);

            if(!string.IsNullOrEmpty(productParams.Sort))
            {
                switch(productParams.Sort)
                {
                    case "priceAsc": AddOrderBy(p=>p.Price);break;
                    case "priceDesc": AddOrderByDescending(p=>p.Price);break;
                    default:
                    AddOrderBy(p=>p.Name);
                    break;
                }

            }
            
        }
        public ProductsWithTypesAndBrandsSpecification(int id) : 
        base(c=>c.Id==id)
        {
            AddInclude(c=>c.ProductBrand);
            AddInclude(c=>c.ProductType);
            
        }
    }
}