using System;
using DevSum2014.Demo.Realtime.Models;
using DevSum2014.Demo.Storage.Entity;
using OrigoDB.Core;
using XSockets.Core.Common.Socket.Event.Arguments;
using XSockets.Core.XSocket;
using XSockets.Core.XSocket.Helpers;

namespace DevSum2014.Demo.Realtime.Controllers
{
    public class AnimalsRealtimeController : XSocketController
    {

        private Guid AnimalLocked { get; set; }

        public void UpdatedAnimal(Animal animal)
        {
           this.SendToAll(animal, "UpdatedAnimal");
        
        }

     

        
        private static IEngine<AnimalsModel> DbEngine { get; set; }


        static AnimalsRealtimeController()
        {
            DbEngine = OrigoDB.Core.Engine.For<AnimalsModel>(); 
        }

        public AnimalsRealtimeController()
        {
            this.OnClose += AnimalsRealtimeController_OnClose;
        }

        void AnimalsRealtimeController_OnClose(object sender, OnClientDisconnectArgs e)
        {
            this.SendToAllExceptMe(new { AnimalId = this.AnimalLocked, ClientId = this.ClientGuid, Locked = false }, "NotifyLock");
        }

        public void NotifyLock(LockModel lockModel)
        {
            // set the state of what animal locked..
            this.AnimalLocked = lockModel.AnimalId;     
            // notify all excep
            this.SendToAllExceptMe(lockModel, "NotifyLock");
        }
    }
}