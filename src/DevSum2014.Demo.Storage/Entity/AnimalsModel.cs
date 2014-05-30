using System;
using System.Collections.Generic;
using System.Linq;

namespace DevSum2014.Demo.Storage.Entity
{
    [Serializable]
    public class AnimalsModel : OrigoDB.Core.Model
    {
        private List<Animal> Animals { get; set; }
        private List<Species> Species { get; set; } 

        public AnimalsModel()
        {
            this.Animals = new List<Animal>();
            this.Species =new List<Species>();
        }

        #region Animals
        public void AddAnimal(Animal animal)
        {
            this.Animals.Add(animal);
        }
        public void AddAnimals(List<Animal> animals)
        {
            this.Animals.AddRange(animals);
        }

        public Animal UpdateAnimal(Animal modifiedAnimal)
        {
            var animal = this.Animals.SingleOrDefault(a => a.Id == modifiedAnimal.Id);

            if (animal != null)
            {
                animal.LastModfied = DateTime.Now;
                animal.Name = modifiedAnimal.Name;
                animal.Species = modifiedAnimal.Species;
                return animal;
            }
            return null;
        }

        public void RemoveAnimal(Animal animal )
        {
            this.Animals.Remove(animal);
        }
        public IEnumerable<Animal> GetAnimals()
        {
            return this.Animals;
        }
        public IEnumerable<Animal> TakeAnimals(int numOfAnimals = 10)
        {
            return this.Animals.Take(numOfAnimals);
        }
        public Animal GetAnimalById(Guid id)
        {
            return this.Animals.SingleOrDefault(a => a.Id == id);
        }
        #endregion


        #region Speices

        public void AddSpeices(Species species)
        {
            this.Species.Add(species);
        }

        public void RemoveSpeices(Species species)
        {
            
        }

        public IEnumerable<Species> GetSpecies()
        {
            return this.Species;
        }

        public Species GetSpeciesById(Guid id)
        {
            return this.Species.SingleOrDefault(s => s.Id == id);
        }


        #endregion
    }
}