Feature: Update Order Status

  Scenario: Update Order To COOKED
    Given Order Taker places an order
    And Kitchen sends request to get last orders
    When Kitchen updates last order to 'COOKED'
    Then Kitchen should receive successful response
