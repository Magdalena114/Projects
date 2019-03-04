
class UScensus(object):
    def __init__(self, storer=None):
        self.states = []
        self.storer = storer

    def add(self, name, num_of_cities, population):
        for state in self.states:
            if state.name == name:
                state.num_of_cities = num_of_cities
                state.population = population
                return self
        self.states.append(State(name, num_of_cities, population))
        return self

    def state(self, index):
        return self.states[index - 1].name
    
    def totalpopulation(self):
        pass
        
    def __len__(self):
        pass

    def store(self):
        return self.storer.store_census(self)

    def restore(self, id):
        self.items = self.storer.retrieve_census(id).states
        return self


class State(object):
    def __init__(self, name, num_of_cities, population):
        self.name = name
        self.num_of_cities = num_of_cities
        self.population = population

class DataAccess(object):
  def store_census(self, census):
    pass

  def retrieve_census(self, id):
    pass
        


