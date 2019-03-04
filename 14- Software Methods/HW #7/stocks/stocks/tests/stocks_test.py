import unittest
from stocks.MyStocks import *

class StockAssetTest(unittest.TestCase):
    def setUp(self):
        self.basket = StockAsset().add("Microsoft",5000,94).add("Apple",14000,178)

    def test_sharetotal(self):
        self.assertTrue(2962000,self.basket.totalasset())

    def test_netasset(self):
        self.assertEqual(2813900,self.basket.netasset(.05))

    def test_netasset1(self):
        self.assertFalse(self.basket.netasset(.05) > 2900000)

    def test_netasset_bad_input(self):
        self.assertRaises(TypeError,self.basket.netasset, None)

if __name__ == "__main__":
    unittest.main()

