// Scripts for the popup.html

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();

// ------------------------------------------------------------------------------
// Main method: Everything starts here!
// ------------------------------------------------------------------------------
function main() {
  var recentlyClosedTabsArray = bgPage.recentlyClosedTabs;
  console.log(recentlyClosedTabsArray);

  if (recentlyClosedTabsArray.length == 0) {
    var rootDiv = $('#rootDiv').text('No recently closed tabs.');
  } else {
    for (var i = 0; i < recentlyClosedTabsArray.length && i < bgPage.maxPopupTableLength; i++) {
      this.createRctDivForPopup(recentlyClosedTabsArray[i], i);
    }
  }
}

//------------------------------------------------------------------------------
// Removes selected RecentlyClosedTab row
//------------------------------------------------------------------------------
function removeRecentlyClosedTab(tabId) {
  //should remove this table row
  $('#' + tabId).remove();
}
