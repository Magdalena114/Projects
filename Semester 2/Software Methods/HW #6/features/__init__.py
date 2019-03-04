from aloe import step, world
from Finalcensus import *

@step("an empty census")
def an_empty_census(step):
  world.census = UScensus()

@step("looking up the second state causes an error")
def looking_up_second_state(step):
  try:
    world.census.state(2)
    raise AssertionError("Expected IndexError")
  except IndexError as e:
    pass

@step("looking up the fourth state causes an error")
def looking_up_second_state(step):
  try:
    world.census.state(4)
    raise AssertionError("Expected IndexError")
  except IndexError as e:
    pass

@step("looking up a negative state causes an error")
def looking_up_negative_state(step):
  try:
    world.census.state(-2)
    raise AssertionError("Expected IndexError")
  except IndexError as e:
    pass


@step("looking up a float state causes an error")
def looking_up_float_state(step):
  try:
    world.census.state(1.5)
    raise AssertionError("Expected TypeError")
  except TypeError as e:
    pass

@step(r"the total population is (.*)")
def total_population(step, total):
  assert world.census.totalpopulation() == float(total)

@step(r"I add California with population of (.*)")
def add_California_with_population(step, population):
  world.census.add("California", 489, float(population))

@step(r"I add another California with population of (.*)")
def add_another_California(step, population):
  world.census.add("California", 489, float(population))

@step("the first state is California")
def check_first_state(step):
  assert world.census.state(1) == "California"

@step(r"the census has (.*) states")
def check_size_census(step, num_states):
  assert len(world.census) == float(num_states)

@step("I add California")
def add_California_without_population(step):
  world.census.add("California", 489, 39.56)

@step("I add Arizona")
def add_Arizona_without_population(step):
  world.census.add("Arizona",440, 7.02)

@step("the second state is Arizona")
def check_the_second_sate(step):
  assert world.census.state(2) == "Arizona"









