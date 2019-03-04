from memcache import Client
import pandas as pd

memcached_port = '9150'
hostname = 'ec2-54-183-15-168.us-west-1.compute.amazonaws.com'

mc = Client([hostname + ':' + memcached_port], debug=0)      #defining memcached client

df = pd.read_csv("SO2 Emissions Key Value Cache.csv")       # reading csv file to a pandas dataframe

for key in range(len(df)):
    mc.set(str(key) + 'Ali', df.loc[key,])                #writing each row of a dataframe as key-value pair in memcached
    

read_df=pd.DataFrame(mc.get('0Ali')).transpose()        #reading first item of database in a new pandas dataframe

for key in range(1,len(df)):
    read_df=read_df.append(mc.get(str(key) + 'Ali'))    #reading all remaining items in respective dataframe
    

read_df.to_csv("New_SO2 Emissions Key Value Cache.csv")  #writling new dataframe into a new csv file