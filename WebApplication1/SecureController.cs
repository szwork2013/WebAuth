using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace WebApplication1
{
    [Authorize(Roles = "Peters Role")]
    [RoutePrefix("api/secure")]
    public class SecureController : ApiController
    {
        [HttpGet]
        [Route("")]
        public IHttpActionResult Get()
        {
            var a = User;

            string[] result = new string[] { "a", "b", "c", DateTime.Now.ToString() };

            return Ok(result);
        }

    }

    

}
