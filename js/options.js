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
	bgPage.storeMaxPopupLength($("#tabsCount").val());
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
//Rebuilds the filters list.
function rebuildFiltersList() {
  for (var timestamp in bgPage.filters) {
    $('#filterListElementDivElement' + timestamp).remove();
  }
  createFiltersList();
}

// Checks if filters is empty and adds notification if true.
function showFiltersIsEmpty() {
  if (bgPage.isEmpty(bgPage.filters)) {
    var noFiltersDivElement = $('<div>')
      .text('No filters.')
      .attr({ id: 'noFiltersDivElement' })
      .appendTo($('#filterListDivElement'));
  } else {
    if ($('#noFiltersDivElement') != null) $('#noFiltersDivElement').remove();
  }
}

// Adds a url to the filters.
// @param i index of recentlyClosedTabs element
function addRecentlyClosedTabToFiltersList(timestamp) {
  var url = bgPage.recentlyClosedTabs[timestamp].url;
  var urlPattern = bgPage.showPrompt("Ignore this URL in future?", url);
  console.log(urlPattern);
  if (urlPattern != null) {
    bgPage.addUrlToFiltersAndCheck(urlPattern);
  }
}

// Deletes a filter from the filters list.
// @param timestamp id of the filters element
function deleteFilterFromList(timestamp) {
  $('#filterListElementDivElement' + timestamp).remove();
  bgPage.removeFilterByTimestamp(timestamp);
}

// Gives the possibility to edit a filter from the filters list.
// @param timestamp id of the filters element
function editFilter(timestamp) {
  var newUrl = showEditFilterPrompt(timestamp);
  while (!bgPage.isFilterUnique(newUrl)) {
    alert('Filter ' + newUrl + '" exists already! Please provide a different filter.');
    newUrl = showEditFilterPrompt(timestamp);
  }
  if (newUrl == '') {
    if (bgPage.showConfirm('Do you really want to delete this filter: "' + bgPage.filters[timestamp].url + '"')) {
      deleteFilterFromList(timestamp);
      return;
    }
  }
  if (newUrl == null) return;
  bgPage.filters[timestamp].url = newUrl;
  bgPage.storeFilters();
}
  
// Shows the prompt for editing a filter.
// @param timestamp id of the filter element
// @return the edited filter
function showEditFilterPrompt(timestamp) {
  return bgPage.showPrompt('Edit Filter', bgPage.filters[timestamp].url);
}

//------------------------------------------------------------------------------
// RECENTLY CLOSED TABS
//------------------------------------------------------------------------------
// Creates recently closed tabs list.
function createRecentlyClosedTabsList() {
  showRecentlyClosedTabsIsEmpty();
  for (var timestamp in bgPage.recentlyClosedTabs) {
    createRctDivForOptions(timestamp);
  }
}

//Removes selected RecentlyClosedTab row
//@param i index of recentlyClosedTabs element
function removeRecentlyClosedTabFromList(timestamp) {
  bgPage.removeRecentlyClosedTabByTimestamp(timestamp);
  $('#rctDivElement' + timestamp).remove();
}

