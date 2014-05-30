using System;

namespace DevSum2014.Demo.Storage.Entity
{
    [Serializable]
    public class Animal: PersistentEntity
    {
        public Species Species { get; set; }
        public string Name { get; set; }
        public Animal()
        {
            
        }
    }
}