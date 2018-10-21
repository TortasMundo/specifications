Feature: Get Orders

  Scenario: Get Placed Order
    Given Order Taker places an order with 1 jamon
    When Kitchen sends request to get last orders
    Then Kitchen should receive successful response
    And Kitchen should receive an order with 1 jamon, 0 lomo, 0 especial and 0 refrescos
    And Kitchen should receive one order with status 'ORDERED'

  Scenario: Kitchen Gets Same Day Orders
    Given there was an order registered yesterday
    And Order Taker places an order with 1 jamon
    When Kitchen sends request to get last orders
    Then Kitchen should receive successful response
    And Kitchen should receive one order

  Scenario: Order Taker Gets Same Day Orders
    Given there was an order registered yesterday
    And Order Taker places an order with 1 jamon
    When Order Taker sends request to get last orders
    Then Order Taker should receive successful response
    And Order Taker should receive one order

  Scenario: Listen For Placed Orders
    Given Kitchen subscribes to socket to get new orders
    When Order Taker places an order with 2 lomo, 1 especial
    Then Kitchen should see an order with 0 jamon, 2 lomo, 1 especial and 0 refrescos
    And Kitchen should see an order with status 'ORDERED'
