from pymongo import MongoClient, ASCENDING, DESCENDING
import pprint

host = 'ec2-54-67-15-68.us-west-1.compute.amazonaws.com'
client = MongoClient(host, 9210)

db = client.nosql
# db.create_collection('population_Ali')   #defining a new collection
population_Ali.delete_many({})    #Removing all existed documents in population_Ali
db_names = db.list_collection_names()
print('List of collections in db')
pprint.pprint(db_names)

population_item = {'city':'Cupertino', 'zipcodes':[95014, 95015], 'county': 'Santa Clara', 'state':'CA', 'population':50000};
population_Ali=db.population_Ali
population_id = population_Ali.insert_one(population_item).inserted_id
print('\nFirst id\n', population_id)

population_Ali.update_one({'city':'Cupertino'}, {'$set':{'population':60000} })
#population_Ali.delete_one({'city':'Cupertino'})
population_Ali.delete_one({'_id':population_id})

population.update_one({'city':'Cupertino'}, {'$set':{'population':60000} })
population.delete_one({'city':'Cupertino'})
population.delete_one({'_id':population_id})

population_items = [
	{'city':'Santa Clara', 'zipcodes':[95050, 95051, 95052, 95053, 95054, 95055, 95056], 'county': 'Santa Clara', 'state':'CA', 'population':100000},	
	{'city':'Sunnyvale', 'zipcodes':[94085, 94086, 94087, 94088, 94089], 'county': 'Santa Clara', 'state':'CA', 'population':150000},	
	{'city':'Mountain View', 'zipcodes':[94035, 94039, 94040, 94041, 94042, 94043], 'county': 'Santa Clara', 'state':'CA', 'population':120000},
]
population_ids = population_Ali.insert_many(population_items)
print('\npopulation ids\n',population_ids.inserted_ids)

my_population_item = {'city':'Walnut Creek', 'zipcodes':[94507, 94518, 94521, 94595, 94596, 94597, 94598], 'county': 'Contra Costa', 'state':'CA', 'population':70000}
population_Ali.insert_one(my_population_item)


population_document = population_Ali.find_one({'city':'Walnut Creek'})
print('\nFind one document')
pprint.pprint(population_document)

population_documents = population_Ali.find({'city': {'$in':['Walnut Creek', 'Mountain View']} })
print('\nTotal count of documents = ', population_Ali.estimated_document_count())

print('\nFounded documents for mentioned cities:')
for item in population_documents:
  pprint.pprint(item)

print('\nIndex of collection:')
for index in population_Ali.list_indexes():
  pprint.pprint(index)

population_Ali.create_index([('city', ASCENDING)])

print('\nCreating additional index:')
pprint.pprint(population_Ali.index_information())

population_Ali.drop_index('city_1')

print('\nDropping new Index:')
pprint.pprint(population_Ali.index_information())