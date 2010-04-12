// Scripts for the popup.html

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();

// ------------------------------------------------------------------------------
// Main method: Everything starts here!
// ------------------------------------------------------------------------------
function main() {
  if (bgPage.recentlyClosedTabs.length == 0) {
    var rootDiv = $('#rootDiv').text('No recently closed tabs.');
  } else {
    for (var i = 0; i < bgPage.recentlyClosedTabs.length && i < bgPage.maxPopupTableLength; i++) {
      this.createRctDivForPopup(i);
    }
  }
}

//------------------------------------------------------------------------------
// Removes selected RecentlyClosedTab row
//------------------------------------------------------------------------------
function removeRecentlyClosedTab(i) {
  //should remove this table row
  $('#rctDivElement' + i).remove();
}
