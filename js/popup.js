// Scripts for the popup.html

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();
console.log(bgPage.recentlyClosedTabs);
console.log(bgPage.allOpenedTabs);

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
  createPopupFooter();
}

// ------------------------------------------------------------------------------
// Creates footer for popup.
// ------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------
// Removes selected RecentlyClosedTab row
//------------------------------------------------------------------------------
function removeRecentlyClosedTab(i) {
  //should remove this table row
  $('#rctDivElement' + i).remove();
}
