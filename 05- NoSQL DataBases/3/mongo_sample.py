from pymongo import MongoClient, ASCENDING, DESCENDING
import pprint

host = 'ec2-54-67-15-68.us-west-1.compute.amazonaws.com'
client = MongoClient(host, 9210)
db = client.nosql
db_names = db.list_collection_names()
pprint.pprint(db_names)

population_item = {'city':'Cupertino', 'zipcodes':[95014, 95015], 'county': 'Santa Clara', 'state':'CA', 'population':50000};
population = db.population
population_id = population.insert_one(population_item).inserted_id
print(population_id)

population.update_one({'city':'Cupertino'}, {'$set':{'population':60000} })
population.delete_one({'city':'Cupertino'})
population.delete_one({'_id':population_id})

population_items = [
	{'city':'Santa Clara', 'zipcodes':[95050, 95051, 95052, 95053, 95054, 95055, 95056], 'county': 'Santa Clara', 'state':'CA', 'population':100000},	
	{'city':'Sunnyvale', 'zipcodes':[94085, 94086, 94087, 94088, 94089], 'county': 'Santa Clara', 'state':'CA', 'population':150000},	
	{'city':'Mountain View', 'zipcodes':[94035, 94039, 94040, 94041, 94042, 94043], 'county': 'Santa Clara', 'state':'CA', 'population':120000}
]
population_ids = population.insert_many(population_items)

print(population_ids.inserted_ids)

population_document = population.find_one({'city':'Cupertino'})
print('Find one document')
pprint.pprint(population_document)

population_documents = population.find({'city': {'$in':['Cupertino', 'Santa Clara']} })
print('Total count of documents = ', population.estimated_document_count())

for item in population_documents:
  pprint.pprint(item)

for index in population.list_indexes():
  pprint.pprint(index)

population.create_index([('city', ASCENDING)])

print('Created Index')
pprint.pprint(population.index_information())

population.drop_index('city_1')

print('Dropped Index')
pprint.pprint(population.index_information())
