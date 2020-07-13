using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification()
        {
            AddInclude(c=>c.ProductBrand);
            AddInclude(c=>c.ProductType);
            
        }
        public ProductsWithTypesAndBrandsSpecification(int id) : 
        base(c=>c.Id==id)
        {
            AddInclude(c=>c.ProductBrand);
            AddInclude(c=>c.ProductType);
            
        }
    }
}