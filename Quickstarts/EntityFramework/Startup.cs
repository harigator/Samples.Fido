using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace EntityFramework
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            services.AddFido(options =>
                {
                    options.Licensee = "";
                    options.LicenseKey = "";
                })
                .AddEntityFrameworkStore(options => options.UseSqlServer(
                    "<connection_string>", sql => sql.MigrationsAssembly(migrationsAssembly)));

            services.AddAuthentication("cookie")
                .AddCookie("cookie", options => { options.LoginPath = "/Home/StartLogin"; });
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseDeveloperExceptionPage();

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseStaticFiles();
            app.UseMvcWithDefaultRoute();
        }
    }
}
