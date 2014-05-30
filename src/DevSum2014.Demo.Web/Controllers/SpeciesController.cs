using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DevSum2014.Demo.Storage.Entity;
using OrigoDB.Core;
using OrigoDB.Core.Proxy;

namespace DevSum2014.Demo.Web.Controllers
{
    public class SpeciesController : ApiController
    {

        private static IEngine<AnimalsModel> DbEngine { get; set; }


        static SpeciesController()
        {
            DbEngine = Engine.For<AnimalsModel>();
        }

        // GET api/<controller>
        public IEnumerable<Species> Get()
        {
            var proxy = DbEngine.GetProxy();
            return proxy.GetSpecies();
        }

        // GET api/<controller>/5
        public Species Get(Guid id)
        {
            var proxy = DbEngine.GetProxy();
            return proxy.GetSpeciesById(id);
        }

        // POST api/<controller>
        public Species Post(Species species)
        {
            try
            {
                species.Id = Guid.NewGuid();
                species.Created = DateTime.Now;
                species.LastModfied = DateTime.Now;
                var proxy = DbEngine.GetProxy();
                proxy.AddSpeices(species);
                return species;
            }
            catch (Exception exception)
            {

                return null;
                // do stuff
            }
        }

      
    }
}