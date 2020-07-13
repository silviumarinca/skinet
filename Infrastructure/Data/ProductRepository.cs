using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly StoreContext _ctx;
        public ProductRepository(StoreContext ctx)
        {
            _ctx = ctx;

        }
        public async Task<IReadOnlyList<Product>> GetProductAsync()
        {
          return await _ctx.Products 
                    .Include(p => p.ProductType)  
                    .Include(p=>p.ProductBrand)
                    .ToListAsync();
        }

        public async Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync()
        {
            return await _ctx.ProductBrands.ToListAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _ctx.Products  
                        .Include(p => p.ProductType)  
                        .Include(p=>p.ProductBrand)
                        .FirstOrDefaultAsync(p=>p.Id == id);
        }

        public async Task<IReadOnlyList<ProductType >> GetProductTypesAsync()
        {
            return await _ctx.ProductTypes.ToListAsync();
        }
    }
}