using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DevSum2014.Demo.Storage.Entity;
using OrigoDB.Core;
using OrigoDB.Core.Proxy;
using XSockets.Core.XSocket.Helpers;

namespace DevSum2014.Demo.Web.Controllers
{
    public class AnimalsController : ApiController
    {
        private static IEngine<AnimalsModel> DbEngine { get; set; }
        static AnimalsController()
        {
            DbEngine = Engine.For<AnimalsModel>();
           
        }
        // GET api/<controller>
        public IList<Animal> Get()
        {
           var proxy = DbEngine.GetProxy();
           return  proxy.GetAnimals().OrderByDescending(o => o.Created).Take(5).ToList();
        }
        // GET api/<controller>/5
        public Animal Get(Guid id)
        {
            var proxy = DbEngine.GetProxy();
            return proxy.GetAnimalById(id);
        }
        // POST api/<controller>
        public Animal Post(Animal animal)
        {
            var proxy = DbEngine.GetProxy();
            try
            {
                if (animal.Id == Guid.Empty)
                {
                animal.Id = Guid.NewGuid();
                animal.Created = DateTime.Now;
                animal.LastModfied = DateTime.Now;
                proxy.AddAnimal(animal);
                }
                else
                {
                 
                    proxy.UpdateAnimal(animal);
                }


                var n = XSockets.Client40.ClientPool.GetInstance("ws://127.0.0.1:4502/AnimalsRealtime", "*");

                n.Send(animal,"updatedanimal");
             
                return animal;


             

            }
            catch
            {
                return null;
                // do stuff
            }
           
           

        }

      
    }
}































                //var notifyer = XSockets.Client40.ClientPool.GetInstance("ws://127.0.0.1:4502/AnimalsRealtime", "*");
                //notifyer.Send(animal, "UpdatedAnimal");