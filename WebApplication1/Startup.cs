using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

[assembly: OwinStartup(typeof(WebApplication1.Startup))]
namespace WebApplication1
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration httpConfig = new HttpConfiguration();

            httpConfig.MapHttpAttributeRoutes();

            var jsonFormatter = httpConfig.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions()
            {
                Provider = new MyProvider()
                //AuthenticationType = OAuthDefaults.AuthenticationType,
            });

            app.UseWebApi(httpConfig);
        }

    }
    // IOAuthBearerAuthenticationProvider
    public class MyProvider : IOAuthBearerAuthenticationProvider
    {
        
        public Task ApplyChallenge(OAuthChallengeContext context)
        {
            return Task.FromResult<object>(null);
        }

        public Task RequestToken(OAuthRequestTokenContext context)
        {
            return Task.FromResult<object>(null);
        }

        public Task ValidateIdentity(OAuthValidateIdentityContext context)
        {
            return Task.FromResult<object>(null);
        }
    }
}
