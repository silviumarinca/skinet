using Core.Entities;

namespace Core.Specifications
{
    public class ProductWithFiltersForCount: BaseSpecification<Product>
    {
        public ProductWithFiltersForCount(ProductSpecParams productParams)
          :base(x =>
                (string.IsNullOrEmpty(productParams.Search)|| x.Name.ToLower()
                .Contains(productParams.Search)) &&
                (!productParams.BrandId.HasValue|| x.ProductTypeId == productParams.BrandId) &&
                (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)
         )
        {
            
        }
    }
}