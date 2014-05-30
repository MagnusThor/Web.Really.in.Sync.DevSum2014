using System;

namespace DevSum2014.Demo.Storage.Entity
{
    [Serializable]
    public class PersistentEntity
    {
        public Guid Id { get; set; }   
        public DateTime Created
        {
            get; set;
        }
        public DateTime LastModfied { get; set; }
    }
}