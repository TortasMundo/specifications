Feature: Get Orders

  Scenario: Get Last 50 Orders
    When Kitchen sends request to get last orders
    Then Kitchen should receive successful response
