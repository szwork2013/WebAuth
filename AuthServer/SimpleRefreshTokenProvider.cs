using Microsoft.Owin.Security.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace AuthServer
{
    public class SimpleRefreshTokenProvider : IAuthenticationTokenProvider
    {
        public static Dictionary<string, RefreshToken> repo = new Dictionary<string, RefreshToken>();

        public class RefreshToken
        {
            public string Id { get; set; }
            public string ClientId { get; set; }
            public DateTime IssuedUtc { get; set; }
            public DateTime ExpiresUtc { get; set; }
            public string ProtectedTicket { get; set; }
        }

        public void Create(AuthenticationTokenCreateContext context)
        {
            throw new NotImplementedException();
        }

        public async Task CreateAsync(AuthenticationTokenCreateContext context)
        {
            var clientid = context.Ticket.Identity.Name;
            var refreshTokenId = Guid.NewGuid().ToString("n");

            var token = new RefreshToken()
            {
                Id = refreshTokenId,
                ClientId = clientid,
                IssuedUtc = DateTime.UtcNow,
                ExpiresUtc = DateTime.UtcNow.AddSeconds(15)
            };

            context.Ticket.Properties.IssuedUtc = token.IssuedUtc;
            context.Ticket.Properties.ExpiresUtc = token.ExpiresUtc;
            token.ProtectedTicket = context.SerializeTicket();

            repo.Add(refreshTokenId, token);
            await Task.Delay(1);

            context.SetToken(refreshTokenId);

            //var allowedOrigins = context.OwinContext.Get<List<string>>("as:clientAllowedOrigins");
            //context.OwinContext.Response.Headers.Add(
            //    "Access-Control-Allow-Origin",
            //    allowedOrigins.Select(x => x.ToString()).ToArray()
            //    //new[] { "*" }
            //    );

            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

        }

        public void Receive(AuthenticationTokenReceiveContext context)
        {
            throw new NotImplementedException();
        }

        public async Task ReceiveAsync(AuthenticationTokenReceiveContext context)
        {

            var tokenId = context.Token;
            RefreshToken storedToken;
            repo.TryGetValue(tokenId, out storedToken);

            var allowedOrigins = context.OwinContext.Get<List<string>>("as:clientAllowedOrigins");
            context.OwinContext.Response.Headers.Add(
                "Access-Control-Allow-Origin", allowedOrigins.ToArray());

            await Task.Delay(2);
            if (DateTime.UtcNow > storedToken.ExpiresUtc)
            {
                //    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                //    context.Response.ReasonPhrase = "The rtoken has expired";
                //    return;
                var a = 1;
            }
            context.DeserializeTicket(storedToken.ProtectedTicket);
            var aasd = context.Ticket;
            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            //repo.Remove(tokenId);
        }
    }
}