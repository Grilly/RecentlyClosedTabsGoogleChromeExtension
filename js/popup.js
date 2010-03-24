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

  var rootDivElement = document.getElementById('rootDiv');

  if (recentlyClosedTabsArray.length == 0) {
    rootDivElement.appendChild(document.createTextNode('No recently closed tabs.'));
  } else {
    var tableElement = document.createElement('table');
    tableElement.setAttribute('id', 'table');
    rootDivElement.appendChild(tableElement);
    for (var i = 0; i < recentlyClosedTabsArray.length && i < bgPage.maxPopupTableLength; i++) {
      tableElement.appendChild(bgPage.createTableRow(recentlyClosedTabsArray[i]));
    }
  }
}

//------------------------------------------------------------------------------
// Removes selected RecentlyClosedTab row
//------------------------------------------------------------------------------
function removeRecentlyClosedTab(tabId) {
  //should remove this table row
  // TODO: how to find the parent node without assuming that its id is 'table'
  document.getElementById('table').removeChild(document.getElementById(tabId));
}
