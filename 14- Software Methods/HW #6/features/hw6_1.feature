Feature: US census

  As a government employee
  I want to load up information in data structures
  So that I need to evaluate it

    Scenario: Empty census
      Given an empty census
      Then looking up the second state causes an error
      And looking up a negative state causes an error
      And looking up a float state causes an error 
      And the total population is 0.00
      
      

    Scenario: Census loaded with one state
      Given an empty census
      When I add California with population of 39.54
      Then the census has 1 states 
      And the first state is California
      And the total population is 39.54 
  
      

    
      


