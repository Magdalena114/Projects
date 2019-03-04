
from redis import Redis
#from memcache import Client

from datetime import datetime

# port = '11211'
#host = 'localhost'
memcached_port = '9150'
redis_port = '9250'
password = ''
hostname = 'ec2-54-183-15-168.us-west-1.compute.amazonaws.com'


# mc = Client([hostname + ':' + memcached_port], debug=0)
mc = Redis(host=hostname, port=redis_port, password=password)

start_time = datetime.now()
mc.set("first_key", "first value")
value = mc.get("first_key")
print(value)
mc.set("second_key", 3)

mc.delete("second_key")

mc.set("key", "1") # note that the key used for incr/decr must be
                      # a string.
value = mc.get('key')
print(value)
mc.incr("key")
value = mc.get('key')
print(value)
mc.decr("key")
value = mc.get('key')
print(value)

end_time = datetime.now()
elapsed_time = end_time - start_time

print('Total Time = ', elapsed_time.microseconds/1000, ' ms')
