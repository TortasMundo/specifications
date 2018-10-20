Feature: Update Order Quantity

  Background:
    Given Kitchen subscribes to socket to get new orders

  Scenario: Update Order Products Quantity
    Given Order Taker places an order with 2 lomo, 1 especial
    And Kitchen sends request to get last orders
    Then Kitchen should see an order with '0' jamon, '2' lomo, '1' especial and '0' refrescos
