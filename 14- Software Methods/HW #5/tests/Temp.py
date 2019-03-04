
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
        return sum([state.population  for state in self.states])
        
    def __len__(self):
        return len(self.states)

    def store(self):
        """This Mocked method is for storing census data.
        """
        return self.storer.store_census(self)

    def restore(self, id):
        """This Mocked method is for restoring census data.
        """
        self.states = self.storer.retrieve_census(id).states
        return self


class State(object):
    def __init__(self, name, num_of_cities, population):
        self.name = name
        self.num_of_cities = num_of_cities
        self.population = population

class DataAccess(object):
  def store_census(self, census):
    """This Mocking method is for calling the method of Store.
    """
    pass

  def retrieve_census(self, id):
    """ This Mocking method is for calling the method of restore.
    """
    pass
        


