
"""
This StockAsset python script is for keeping record of daily shares of a person. 
It could calculate totalasset and netasset by consideration of some coefficient
from taxing bracket of person.
"""

class StockAsset(object):
    def __init__(self):
        self.shares = []

    def add(self, name, quantity, price):
        self.shares.append(Share(name, quantity, price))
        return self

    def totalasset(self):
        total_price = sum([share.sharetotal() for share in self.shares])
        return total_price
    
    def netasset(self,coef): 
        """This method is calculating net value after deduction of tax.
        >>> StockAsset().add("Google",1000,1130).netasset(.05)
        1073500.0
        """
        net_total = sum([share.sharetotal() for share in self.shares])*(1-coef)
        return net_total

    def __len__(self):
        return len(self.shares)


class Share(object):
    def __init__(self, name, quantity, price):
        self.name = name
        self.quantity = quantity
        self.price = price
        
    def sharetotal(self):
        return self.quantity * self.price
       




