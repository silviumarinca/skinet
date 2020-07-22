
using System.Reflection;
using Core.Entities;
using Infrastructure.Data.Config;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Core.Entities.OrderAggregate;
using System;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
         //       modelBuilder.ApplyConfiguration( )
              base.OnModelCreating(modelBuilder);
             modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
         if(this.Database.ProviderName =="Microsoft.EntityFrameworkCore.Sqlite" )
         {

     
        
            var  entityTypes  =  modelBuilder.Model.GetEntityTypes();
           foreach(var item in entityTypes)
           { 
               var props = item.ClrType.GetProperties().Where(c=>c.PropertyType ==typeof(decimal));
                
                foreach(var prop in props){ 
                 modelBuilder.Entity(item.Name).Property(prop.Name).HasConversion<double>();
                } 



                 var dtoffset = item.ClrType.GetProperties().Where(c=>c.PropertyType ==typeof(DateTimeOffset));
                
                foreach(var prop in dtoffset){ 
                 modelBuilder.Entity(item.Name).Property(prop.Name).HasConversion(new DateTimeOffsetToBinaryConverter());
                } 
           }
            //   foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            //     {
            //         var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));
                  

            //         foreach (var property in properties)
            //         {
            //             modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
            //         }

             //     modelBuilder.Entity<Address>().HasNoKey();
            //     }

         }



            // foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            //     {
            //         var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));
            //         var dateTimeProperties = entityType.ClrType.GetProperties()
            //             .Where(p => p.PropertyType == typeof(DateTimeOffset));

            //         foreach (var property in properties)
            //         {
            //             modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
            //         }

            //         foreach (var property in dateTimeProperties)
            //         {
            //             modelBuilder.Entity(entityType.Name).Property(property.Name)
            //                 .HasConversion(new DateTimeOffsetToBinaryConverter());
            //         }
            //     }

        }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }
        
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<DeliveryMethod> DeliveryMethods { get; set; }
    }
}