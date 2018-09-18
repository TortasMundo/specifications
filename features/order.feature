Feature: Get Orders

  Scenario: Get Last 50 Orders
    Given Order Taker places an order with 1 jamon
    When Kitchen sends request to get last orders
    Then Kitchen should receive successful response
    And Kitchen should receive one order
