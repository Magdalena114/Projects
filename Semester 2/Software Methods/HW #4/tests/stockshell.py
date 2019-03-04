
class StockAsset(object):
    def __init__(self):
        self.shares = []

    def add(self, name, quantity, price):
        self.shares.append(Share(name, quantity, price))
        pass

    def totalasset(self):
        pass
    
    def netasset(self,coef): 
        net_total = totalasset(self)*(1-coef)
        pass

    def __len__(self):
        pass


class Share(object):
    def __init__(self, name, quantity, price):
        self.name = name
        self.quantity = quantity
        self.price = price
        
    def sharetotal(self):
        return self.quantity * self.price

