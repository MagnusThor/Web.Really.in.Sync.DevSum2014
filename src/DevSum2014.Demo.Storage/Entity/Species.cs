using System;
using System.Text;
using System.Threading.Tasks;

namespace DevSum2014.Demo.Storage.Entity
{
    [Serializable]
    public class Species : PersistentEntity
    {
        public string Name { get; set; }
    }
}
