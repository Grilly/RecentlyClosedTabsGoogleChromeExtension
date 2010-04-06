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
    $('#rootDiv').text('No recently closed tabs.');
  } else {
    $('<table>').attr({ id: 'rctTable' }).appendTo($('#rootDiv'));
    for (var i = 0; i < recentlyClosedTabsArray.length && i < bgPage.maxPopupTableLength; i++) {
      this.createTableRow(recentlyClosedTabsArray[i], i);
    }
  }
}

//------------------------------------------------------------------------------
// Removes selected RecentlyClosedTab row
//------------------------------------------------------------------------------
function removeRecentlyClosedTab(tabId) {
  //should remove this table row
  // TODO: how to find the parent node without assuming that its id is 'table'
	$('#' + tabId).remove();
}
