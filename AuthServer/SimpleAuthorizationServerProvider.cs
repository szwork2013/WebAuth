using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace AuthServer
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            if (context.ClientId == null)
            {
                List<string> allowedOrigins = new List<string>() { "*" };
                context.OwinContext.Set<List<string>>("as:clientAllowedOrigins", allowedOrigins);

                context.Validated();
                return Task.FromResult<object>(null);
            }


            context.SetError("invalid_clientId", "Client secret is invalid.");
            return Task.FromResult<object>(null);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {

            if (context.UserName != context.Password)
            {
                context.SetError("invalid_grant", "wrong username or password");
                return;
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
            identity.AddClaim(new Claim(ClaimTypes.Role, "Peters Role"));

            for (int i = 0; i < 5; i++)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, "TheRole " + i.ToString()));
            }

            List<Claim> roles = identity.Claims.Where(x => x.Type == ClaimTypes.Role).ToList();
            var props = new AuthenticationProperties(new Dictionary<string, string>
            {
                { "as:client_id", (context.ClientId == null) ? string.Empty : context.ClientId },
                { "userName", context.UserName },
                { "roles", JsonConvert.SerializeObject(roles.Select(x=>x.Value)) }
            });

            await Task.Delay(1);

            var ticket = new AuthenticationTicket(identity, props);
            context.Validated(ticket);

            var allowedOrigins = context.OwinContext.Get<List<string>>("as:clientAllowedOrigins");
            context.OwinContext.Response.Headers.Add(
                "Access-Control-Allow-Origin", allowedOrigins.ToArray());
            var a = 1;

        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }
            return Task.FromResult<object>(null);
        }

    }
}