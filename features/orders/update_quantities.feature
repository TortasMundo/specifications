Feature: Update Order

  Background:
    Given Kitchen subscribes to socket to get new orders

  Scenario: Update Order Products Quantity
    Given Order Taker places an order with 2 lomo, 1 especial
    And Order Taker updates last order to 1 jamon, 3 lomo, 2 especial, 1 refrescos
    When Kitchen sends request to get last orders
    Then Kitchen should receive an order with 1 jamon, 3 lomo, 2 especial and 1 refrescos
