import unittest
from copy import deepcopy
from censusshell import *
from unittest.mock import Mock


class Census_Test_Normally(unittest.TestCase):
  def setUp(self):
    self.cvt = UScensus()
    self.cvt.add("New York", 62, 19.85).add("Texas", 961, 28.3)

  def tearDown(self):
    self.cvt = None  

  def test_state(self):
    self.assertEqual("Texas" , self.cvt.state(2))
    self.assertRaises(TypeError, self.cvt.state, 3)

  def test_totalpopulation(self):
    self.assertEqual(48.15 , self.cvt.totalpopulation())

  def test_len(self):
    self.assertEqual(2, len(self.cvt))



class CensusTestingByMock(unittest.TestCase):
    def test_fill_up_a_census_then_save_it_and_restore_it(self):
      # Create an empty census
      census = UScensus(DataAccess())

      # Add a couple of states
      census.add("California",482, 39.54)
      census.add("Arizona",440, 7.02)
      census.add("Nevada",19, 3 )

      self.assertEquals(3, len(census))
      self.assertRaises(IndexError, census.state, 4)

      # Create a clone of the cart for mocking
      # purposes.
      original_census = deepcopy(census)

      census.storer.store_census = Mock(return_value=1)
      census.storer.retrieve_census = Mock(return_value=original_census)

      id = census.store()

      self.assertEquals(1, id)

      # Add more items to census
      census.add("Washington", 281, 7.41)
      census.add("Oregon", 241, 4.14)

      self.assertEquals(5, len(census))

      # Restore the census to the last point in time
      census.restore(id)

      self.assertEquals(3, len(census))
      self.assertEquals(49.56 , census.totalpopulation())

      
      census.storer.store_census.assert_called_with(census)
      census.storer.retrieve_census.assert_called_with(1)

if __name__ == "__main__":
  unittest.main()


    