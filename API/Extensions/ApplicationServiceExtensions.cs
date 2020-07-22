using System.Linq;
using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices( this IServiceCollection services)
        {
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IProductRepository,ProductRepository>();
            services.AddScoped<IBasketRepository,BaskeRepository>();
            services.AddScoped(typeof(IGenericRepository<>),typeof(GenericRepository<>));
            services.AddScoped<IOrderService,OrderService>();
             services.AddScoped<IUnitOfWork,UnitOfWork>();
             services.Configure<ApiBehaviorOptions>(options=>
            {
                options.InvalidModelStateResponseFactory = actionContext =>{
                        var errors= actionContext.ModelState.Where(errors=>errors.Value.Errors.Count >0)
                        .SelectMany(x=>x.Value.Errors)
                        .Select(x=>x.ErrorMessage).ToArray();

                        var errorResponse = new ApiValidationErrorResponse{
                            Errors =errors
                        };
                    return new BadRequestObjectResult(errorResponse);
                }; 
            });
            return services;
        }
    }
}