from cassandra.cluster import Cluster
import json

host = 'ec2-54-67-15-68.us-west-1.compute.amazonaws.com'
port = 9220

cluster = Cluster([host], port = port)

session = cluster.connect()

session.set_keyspace('nosql')

# Example 1 - Insert population information in table with columns defined for each field
session.execute("INSERT INTO city_population (city, zipcodes, county, state_code, state, population) VALUES (%s, %s, %s, %s, %s, %s)", ("Cupertino", {95014, 95015}, "Santa Clara", "CA", "California", 50000 ))
session.execute("INSERT INTO city_population (city, zipcodes, county, state_code, state, population) VALUES (%s, %s, %s, %s, %s, %s)", ("Santa Clara", {95050, 95051, 95052, 95053, 95054, 95055, 95056}, "Santa Clara", "CA", "California", 100000 ))

rows = session.execute('Select * from city_population')

for row in rows:
    print(row)
    print('City Name :', row.city, ', City Population:', row.population)

# Select where city is Cupertino
city_stmt = session.prepare("Select * from city_population where city=?")
rows = session.execute(city_stmt, ['Cupertino'])

print('Select Cupertino')
for row in rows:
    print(row)
    print('City Name :', row.city, ', City Population:', row.population)

# Example 2 - Using aggregate functions
rows = session.execute('Select count(population), avg(population), sum(population), min(population), max(population) from city_population')
for row in rows:
    print(row)
    print('City Count', row.system_count_population)
    print('Total population', row.system_sum_population)
    print('Average Population', row.system_avg_population)
