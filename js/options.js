// Scripts for the options.html

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();

//------------------------------------------------------------------------------
// Main method: Everything starts here
//------------------------------------------------------------------------------
function main() {
  this.createHeader('Options');
  this.createFooter();
  createFiltersListHeader();
  var filterListDivElement = $('#filterListDivElement').addClass('filterListDivElement');
  createFiltersList();
  createRecentlyClosedTabsListHeader();
  createRecentlyClosedTabsList();
  createMaxPopupLengthSelect();
  setMaxPopupLength();
}

// ------------------------------------------------------------------------------
// MAX POPUP LENGTH
// ------------------------------------------------------------------------------
// Saves options to localStorage.
// TODO: Transform with jquery
function saveMaxPopupLength() {
	var bgPage = chrome.extension.getBackgroundPage();
	var select_tabsCount = $('#tabsCount');
	bgPage.storeMaxPopupLength(select_tabsCount.children[select_tabsCount.selectedIndex].value);
	// Update status to let user know options were saved.
	$('#status').text('Options Saved.');
	setTimeout(function() { $('#status').text(''); }, 750);
}

// Restores select box state to saved value from localStorage.
function setMaxPopupLength() {
	$('#tabsCount').selectOptions(bgPage.maxPopupLength, true);
}

// ------------------------------------------------------------------------------
// FILTERS
// ------------------------------------------------------------------------------
// Rebuilds the filters list.
function rebuildFiltersList() {
  for (var i = 0; i <= bgPage.filters.length; i++) {
    $('#filterListElementDivElement' + i).remove();
  }
  createFiltersList();
}

//Adds a url to the filters.
//@param i index of recentlyClosedTabs element
function addRecentlyClosedTabToFiltersList(i) {
  var url = bgPage.recentlyClosedTabs[i].url;
  var urlPattern = prompt("Ignore this URL in future?", url);
  if (urlPattern != null) {
    bgPage.addUrlToFilters(urlPattern);
    rebuildFiltersList();
  }
}

//Deletes a filter from the filters list.
//@param i index of filters element
function deleteFilterFromList(i) {
  bgPage.removeFilterByIndex(i);
  rebuildFiltersList();
}

//------------------------------------------------------------------------------
// RECENTLY CLOSED TABS
//------------------------------------------------------------------------------
// Creates recently closed tabs list.
function createRecentlyClosedTabsList() {
  if (bgPage.recentlyClosedTabs == {}) {
    showRecentlyClosedTabsIsEmpty();
  } else {
    for (var timestamp in bgPage.recentlyClosedTabs) {
      createRctDivForOptions(timestamp);
    }
  }
}

//Removes selected RecentlyClosedTab row
//@param i index of recentlyClosedTabs element
function removeRecentlyClosedTabFromList(i) {
  $('#rctDivElement' + i).remove();
}

