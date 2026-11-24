@bdd
Feature: Customers can discover, save and play StreamFlix content
  Real business outcomes should be observable, not inferred from HTML shells.

  @smoke @REQ-AUTH
  Scenario: A customer signs in and reaches a usable catalogue
    Given I am on the StreamFlix login page
    When I sign in with email "qe@example.test" and password "abcd1234"
    And I select the "Alok" viewing profile
    Then I should reach a usable browse catalogue

  @smoke @REQ-SEARCH
  Scenario Outline: Catalogue search handles query case
    Given I am a signed-in StreamFlix customer
    When I search for "<query>"
    Then the results should include "The Crimson Hour" but not "Atlas Falling"
    When I open the title "The Crimson Hour"
    Then I should see details for "The Crimson Hour"

    Examples:
      | query   |
      | crimson |
      | CRIMSON |

  @regression @REQ-DEEPLINK
  Scenario: A bookmarked search survives refresh
    Given I am a signed-in StreamFlix customer
    When I open the search deep link for "crimson"
    Then the search field should contain "crimson"
    And the results should include "The Crimson Hour" but not "Atlas Falling"
    When I refresh the current page
    Then the search field should contain "crimson"
    And the results should include "The Crimson Hour" but not "Atlas Falling"

  @regression @REQ-SEARCH
  Scenario: Genre filters narrow matching results
    Given I am a signed-in StreamFlix customer
    When I search for "crimson"
    And I filter search results by "Comedy"
    Then I should be told that no content matches
    When I filter search results by "Drama"
    Then the results should include "The Crimson Hour" but not "Atlas Falling"

  @regression @REQ-WATCHLIST
  Scenario: My List additions persist across a reload
    Given I am a signed-in StreamFlix customer
    When I search for "crimson"
    And I open the title "The Crimson Hour"
    And I add the open title to My List
    And I navigate to My List
    Then My List should contain "The Crimson Hour"
    When I refresh the current page
    Then My List should contain "The Crimson Hour"

  @regression @REQ-WATCHLIST
  Scenario: Removed titles stay removed after refresh
    Given I am a signed-in StreamFlix customer
    When I search for "crimson"
    And I open the title "The Crimson Hour"
    And I add the open title to My List
    And I navigate to My List
    And I open the saved title "The Crimson Hour"
    And I remove the open title from My List
    Then My List should not contain "The Crimson Hour"
    When I refresh the current page
    Then My List should not contain "The Crimson Hour"

  @regression @REQ-PLAYER
  Scenario: Player options change the actual media element
    Given I am a signed-in StreamFlix customer
    When I open the player for title "t1"
    And I mute playback
    Then the media element should be muted
    When I set playback speed to 1.5x
    Then the media element speed should be 1.5

  @regression @REQ-PLAYER
  Scenario: An unknown title provides a working recovery path
    Given I am a signed-in StreamFlix customer
    When I open the player for title "does-not-exist"
    Then I should see a title-not-found message
    When I choose to go back to the catalogue
    Then I should reach a usable browse catalogue

  @regression @REQ-AUTH
  Scenario: Anonymous deep links cannot expose the player
    When I open the player for title "t1"
    Then I should be redirected to sign in
