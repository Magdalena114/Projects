from neo4j.v1 import GraphDatabase

host = 'ec2-54-67-15-68.us-west-1.compute.amazonaws.com'
port = '9232'

uri = "bolt://" + host + ':' + port

driver = GraphDatabase.driver(uri, auth=("neo4j", "password"), encrypted=False)

session = driver.session()

# Delete the existing index on City nodes. This needs to happen in a separate transaction
try:
  with session.begin_transaction() as tx:
      tx.run('DROP INDEX ON :City(name)')
except Exception:
  print('ignored exception in drop index')

# Create the zip/city/county/state nodes and relationships and then query the data.
with session.begin_transaction() as tx:
    # Delete the existing nodes
    tx.run('MATCH (a:City{name:{city_name}}),(b:Zip{zipcode:{zipcode}}),(c:County{name: {county_name}}),(d:State{name:{state_name}}) DETACH DELETE a,b,c,d', zipcode='95014', city_name='Cupertino', county_name='Santa Clara', state_name='California')
    # Create new zip, city, county, and state nodes
    for record in tx.run('CREATE (a:City{name:{city_name},population:{population}}),(b:Zip{zipcode:{zipcode}}),(c:County{name: {county_name}}),(d:State{name:{state_name}}) return a,b,c,d', zipcode='95014', city_name='Cupertino', county_name='Santa Clara', state_name='California', population=50000):
        print(record)
    # Create the relationships between these nodes
    tx.run('MATCH (city:City{name:{city_name}}),(zip:Zip{zipcode:{zipcode}}),(county:County{name: {county_name}}),(state:State{name:{state_name}}) create (zip)-[:in_city]->(city)-[:in_county]->(county)-[:in_state]->(state)', zipcode='95014', city_name='Cupertino', county_name='Santa Clara', state_name='California')
    # Query the zip, city, county and state where the city.name is Cupertino
    for record in tx.run('match (zip:Zip)-[:in_city]->(city:City{name:{city_name}})-[:in_county]->(county:County)-[:in_state]->(state:State) return zip.zipcode,county.name,state.name;', city_name='Cupertino'):
        print(record)
    # Query the zip, city, county and state objects where the city.name is Cupertino
    for record in tx.run('match (zip:Zip)-[:in_city]->(city:City{name:{city_name}})-[:in_county]->(county:County)-[:in_state]->(state:State) return city, zip,county,state;', city_name='Cupertino'):
        print(record)
    # Query the zip, city, county and state objects where the state.name is California
    for record in tx.run('match (zip:Zip)-[:in_city]->(city:City)-[:in_county]->(county:County)-[:in_state]->(state:State{name:{state_name}}) return city, zip,county,state;', state_name='California'):
        print(record)

with session.begin_transaction() as tx:
    tx.run('CREATE INDEX ON :City(name)')

