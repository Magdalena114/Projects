# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

class StockAsset(object):
    def __init__(self):
        self.shares = []
        
    def add(self, name, quantity, price):
        self.shares.append(Share(name, quantity, price))
        return self
    
    def share(self, index):
        return self.shares[index-1].name

    def quantity(self, index):
        return self.shares[index-1].quantity
    
    def price(self, index):
        return self.shares[index-1].price

    def totalasset(self):
        sum_price = sum([share.sharetotal() for share in self.shares])
        return sum_price

    def __len__(self):
        return len(self.shares)

class Share(object):
    def __init__(self, name, quantity, price):
        self.name = name
        self.quantity = quantity
        self.price = price
        
    def sharetotal(self):
        return self.quantity * self.price
