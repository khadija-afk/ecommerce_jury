Feature: Create a new user

  Scenario: Successfully create a user
    Given I have the following user data:
        | key       | value                |
        | firstName | morchid                 |
        | lastName  | assiah                  |
        | email     | morchid.assiah@example.com |
        | password  | password123          |
        | role      | user                  |
    When I send a POST request to "/api/user/add"
    Then the response status should be 201
    Then the response body should contain the user details:
        | key       | value                      |
        | firstName | morchid                   |
        | email     | morchid.assiah@example.com |