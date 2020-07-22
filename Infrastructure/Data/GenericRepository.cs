using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class GenericRepository<T> : IGenericRepository<T> where T:BaseEntity
    {
          private readonly StoreContext _ctx;

        
      

        public GenericRepository(StoreContext ctx)
        {
            this._ctx = ctx;
            
        }
      public async Task<T>  GetByIdAsync(int id)
        {
           return await _ctx.Set<T>().FindAsync(id);
        }

    
        public async  Task<IReadOnlyList<T>>  ListAllAsync()
        {
           return await _ctx.Set<T>().ToListAsync();
        }
      public async Task<T> GetEntityWithSpec(ISpecification<T> spec)
        {
              return  await this.ApplySpecifiation(spec).FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
        {
             return await  this.ApplySpecifiation(spec).ToListAsync();
        }
      public async Task<int> CountAsync(ISpecification<T> spec)
        {
           return await ApplySpecifiation(spec).CountAsync();
        }
        private IQueryable<T> ApplySpecifiation(ISpecification<T> spec){


              return    SpecificationEvaluator<T>.GetQuery(_ctx.Set<T>().AsQueryable(),spec);
        }

        public void Add(T entity)
        {
            _ctx.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {   
            _ctx.Set<T>().Attach(entity);
            _ctx.Entry(entity).State= EntityState.Modified;
        }

        public void Delete(T entity)
        {
            _ctx.Set<T>().Remove(entity);
        }
    }
}