// Scripts for the popup.html

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();

// ------------------------------------------------------------------------------
// Main method: Everything starts here!
// ------------------------------------------------------------------------------
function main() {
  var rootDiv = $('#rootDiv').addClass('rootDiv');
  var popupFooter = $('#popupFooter').addClass('rootDiv');
  
  if (bgPage.isEmpty(bgPage.recentlyClosedTabs)) {
    var rootDiv = $('#rootDiv').text('No recently closed tabs.');
  } else {
    var counter = 0;
    for (var timestamp in bgPage.recentlyClosedTabs) {
      counter++;
      createRctDivForPopup(timestamp);
      if (counter == bgPage.maxPopupLength) break;
    }
  }
  createPopupFooter();
}

// Creates footer for popup.
function createPopupFooter() {
  var popupFooter = $('#popupFooter')
    .addClass('popupFooter')
    .text('Show all recently closed tabs and the options page')
    .click(function() {
      chrome.tabs.create( {
        'url' : chrome.extension.getURL('options.html'),
        'selected' : true
      }, function(tab) {
        // Tab opened: possible migration procedures
        });
      return false;});
}

// Removes selected RecentlyClosedTab row
// @param i index of recentlyClosedTabs element
function removeRecentlyClosedTabFromList(i) {
  $('#rctDivElement' + i).remove();
}
