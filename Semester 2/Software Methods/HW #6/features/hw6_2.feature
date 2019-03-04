Feature: US census

  As a government employee
  I want to load up information in data structures
  So that I need to evaluate it
      
    Scenario: Census getting loaded with multiple of the same state
      Given an empty census
      When I add California with population of 39.54
      And I add another California with population of 39.55
      And I add another California with population of 39.56
      Then the census has 1 states 
      And the first state is California
      And the total population is 39.56  

    Scenario: Census getting loaded with different states
      Given an empty census
      When I add California
      And I add Arizona
      Then the first state is California
      And the second state is Arizona
      And the total population is 46.58
      


