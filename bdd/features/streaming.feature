@bdd
Feature: Search and save streaming content
  As a StreamFlix customer
  I want to find content and save titles
  So that I can quickly choose something to watch

  @smoke @REQ-AUTH
  Scenario: Sign in and select a viewing profile
    Given I am on the StreamFlix login page
    When I sign in with email "qe@example.test" and password "abcd1234"
    And I select the "Alok" viewing profile
    Then I should reach the browse catalogue

  @smoke @REQ-SEARCH
  Scenario Outline: Find existing content using different search terms
    Given I am a signed-in StreamFlix customer
    When I search for "<search>"
    Then I should find the title "<title>"

    Examples:
      | search  | title            |
      | crimson | The Crimson Hour |
      | CRIMSON | The Crimson Hour |

  @regression @REQ-SEARCH
  Scenario: Informative empty search results
    Given I am a signed-in StreamFlix customer
    When I search for "no-such-title-xy987654"
    Then I should be told that no content matches

  @regression @REQ-WATCHLIST
  Scenario: Saved titles persist when the page reloads
    Given I am a signed-in StreamFlix customer
    When I search for "crimson"
    And I open the title "The Crimson Hour"
    And I add the open title to My List
    And I navigate to My List
    Then My List should contain "The Crimson Hour"
    When I reload My List
    Then My List should contain "The Crimson Hour"
