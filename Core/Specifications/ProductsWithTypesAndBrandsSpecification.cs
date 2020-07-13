using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification(int? brandId ,int? typeId,string sort=null)
        {
            AddInclude(c=>c.ProductBrand);
            AddInclude(c=>c.ProductType);
            AddOrderBy(x=>x.Name);

            if(!string.IsNullOrEmpty(sort))
            {
                switch(sort)
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