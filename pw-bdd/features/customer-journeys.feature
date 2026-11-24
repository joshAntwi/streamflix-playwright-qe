@pw-bdd
Feature: Streaming journeys run through the Playwright Test runner
  Product acceptance criteria must confirm rendered outcomes and real media state.

  @smoke @REQ-DEEPLINK
  Scenario: A bookmarked search loads meaningful results after refresh
    Given I am viewing StreamFlix as a signed-in customer
    When I follow a search bookmark for "crimson"
    Then the search query "crimson" returns "The Crimson Hour"
    When I refresh the bookmarked page
    Then the search query "crimson" returns "The Crimson Hour"

  @smoke @REQ-WATCHLIST
  Scenario: A customer saves content for later
    Given I am viewing StreamFlix as a signed-in customer
    When I search the catalogue for "crimson"
    And I view the details for "The Crimson Hour"
    And I save the title from its details
    And I open My List
    Then "The Crimson Hour" is listed as a saved title
    When I refresh the bookmarked page
    Then "The Crimson Hour" is listed as a saved title

  @regression @REQ-WATCHLIST
  Scenario: A customer removes a title permanently
    Given I am viewing StreamFlix as a signed-in customer
    When I search the catalogue for "crimson"
    And I view the details for "The Crimson Hour"
    And I save the title from its details
    And I open My List
    And I reopen the saved title "The Crimson Hour"
    And I remove the title from its details
    Then My List is empty
    When I refresh the bookmarked page
    Then My List is empty

  @regression @REQ-PLAYER
  Scenario: Playback controls update the actual video element
    Given I am viewing StreamFlix as a signed-in customer
    When I open the player for "t1"
    And I mute the player
    Then the underlying video element is muted
    When I select 1.5x playback
    Then the video playback rate is 1.5

  @regression @REQ-PLAYER
  Scenario: An unknown video offers a path back to browsing
    Given I am viewing StreamFlix as a signed-in customer
    When I open the player for "unknown-title"
    Then the player reports a missing title
    When I return to browsing
    Then the catalogue contains "The Crimson Hour"

  @regression @REQ-AUTH
  Scenario: An anonymous visitor cannot open a player bookmark
    When I open the player for "t1"
    Then I am redirected to sign in without seeing a player
