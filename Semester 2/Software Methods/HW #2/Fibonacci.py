def fibonacci(x):
	sequence_list = []

	current = 0
	next = 1
	
	for i in range (x):
	
		sequence_list.append(current)
		current = next
		if i > 0:
			next = sequence_list[i] + current
		else:
			next = 1
	return sequence_list	
	

#produces a list for the first x fibonacci numbers
def print_fibonacci(x):
	print str(fibonacci(x))
	
print print_fibonacci (7)
