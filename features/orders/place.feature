Feature: Place Orders

  Scenario: Place Order Successfully
    Given Order Taker places an order with 1 jamon
    Then Order Taker should receive successful response

  Scenario: Place Order With Zero Quantities
    Given Order Taker places an order with zero quantities
    Then Order Taker should receive unsuccessful response