// Scripts for the options.html

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();

//------------------------------------------------------------------------------
// Everything starts here
//------------------------------------------------------------------------------
function main() {
  this.createHeader('Options');
  this.createFooter();
  createListOfFilters();
  createListOfRecentlyClosedTabs();
  createMaxPopupTableLengthSelect();
  showMaxPopupTableLength();
}

//------------------------------------------------------------------------------
// Saves options to localStorage.
//------------------------------------------------------------------------------
function saveMaxPopupTableLength() {
	var bgPage = chrome.extension.getBackgroundPage();
	var select_tabsCount = document.getElementById("tabsCount");
	bgPage.storeMaxPopupTableLength(select_tabsCount.children[select_tabsCount.selectedIndex].value);
	// Update status to let user know options were saved.
	$('#status').text('Options Saved.');
	setTimeout(function() { $('#status').text(''); }, 750);
}

//------------------------------------------------------------------------------
// Restores select box state to saved value from localStorage.
//------------------------------------------------------------------------------
function showMaxPopupTableLength() {
	var bgPage = chrome.extension.getBackgroundPage();
	$('#tabsCount').selectOptions(bgPage.maxPopupTableLength, true);
}


//------------------------------------------------------------------------------
// Creates list of filters.
//------------------------------------------------------------------------------
function createListOfFilters() {
    var size = bgPage.filterArray.length;
    
    var filterListDivElement = $('#filterListDivElement').addClass('filterListDivElement');
    var h3Element = $('<h3>')
    	.text('Active URL filters:')
    	.appendTo($('#filterListDivElement'));
    for (var i = 0; i < bgPage.filterArray.length; i++) {
    	addFilterToFilterList(bgPage.filterArray[i], i);
    }
}


//------------------------------------------------------------------------------
// Adds a filter to the filter list.
//------------------------------------------------------------------------------
function addFilterToFilterList(urlPattern, i) {
	
	var filterListElementDivElement = $('<div>')
		.addClass('filterListElementDivElement')
		.attr({ id: 'filterListElementDivElement' + i })
		.appendTo($('#filterListDivElement'));
	
	var filterDivElement = $('<div>')
		.addClass('filterDivElement')
		.attr({ id: 'filterElementDiv' + i })
		.text(urlPattern)
		.appendTo($('#filterListElementDivElement' + i));
	
	// filterDeleteButton building
	var filterDeleteButtonDivElement = $('<div>')
		.addClass('filterDeleteButtonDivElement')
		.attr({ id: 'filterDeleteButtonDivElement' + i })
		.appendTo($('#filterListElementDivElement' + i));
	var filterDeleteButtonElement = $('<button>')
		.attr({ id: 'filterDeleteButtonElement' + i })
		.text('Delete Filter')
		.click(function() {alert('Please implement me! :-(');return false;})
		.appendTo(filterDeleteButtonDivElement);
}


//------------------------------------------------------------------------------
// Creates list of recently closed tabs.
//------------------------------------------------------------------------------
function createListOfRecentlyClosedTabs() {
  var recentlyClosedTabsArray = bgPage.recentlyClosedTabs;
  console.log(recentlyClosedTabsArray);

  if (recentlyClosedTabsArray.length == 0) {
	  showNoRCTs();
  } else {
    //var rctTable = $('<table>').attr({ id: 'rctTable' }).appendTo($('#rootDiv'));
    for (var i = 0; i < recentlyClosedTabsArray.length; i++) {
      this.createRctDivForOptions(recentlyClosedTabsArray[i], i);
    }
  }
}

//------------------------------------------------------------------------------
// Removes selected RecentlyClosedTab row
//------------------------------------------------------------------------------
function removeRecentlyClosedTab(tabInfo, i) {
  //should remove this table row
  $('#rctDivElement' + tabInfo.tabId).remove();
  createRCTListEditButtons(tabInfo, i);
}

//------------------------------------------------------------------------------
// Deletes element from the list of recently closed tabs.
//------------------------------------------------------------------------------
function deleteRecentlyClosedTab(tabInfo, i) {
  //should remove this table row
	var tabId = bgPage.recentlyClosedTabs[i].tabId;
	$('#rctDivElement' + tabInfo.tabId).remove();
  //show 'no rcts'-String
  if (bgPage.recentlyClosedTabs.length == 0) {
	showNoRCTs();
  }
	
  //bgPage.removeClosedTabWithThisUrl(bgPage.getClosedTabById(tabId).url);
  bgPage.removeClosedTabWithThisUrl(tabInfo.url);
}

//------------------------------------------------------------------------------
// Adds tab url to the filters.
//------------------------------------------------------------------------------
function addRecentlyClosedTabToFilters(tabId) {
	var url = bgPage.getClosedTabById(tabId).url;
	var urlPattern = prompt("Ignore this URL in future?", url);
	if (urlPattern != null) {
		addUrlToFilters(urlPattern);
	}
}

//------------------------------------------------------------------------------
// Adds pattern to the filters.
//------------------------------------------------------------------------------
function addUrlToFilters(pattern) {
  bgPage.filterArray[bgPage.filterArray.length] = pattern;
  addFilterRowToListTable(pattern);
}

//------------------------------------------------------------------------------
// Appends a 'no rcts'-String to the rootDivElement.
//------------------------------------------------------------------------------
function showNoRCTs() {
  var rootDiv = $('#rootDiv').text('No recently closed tabs.');
}

//------------------------------------------------------------------------------
//Creates recently closed tab.
//------------------------------------------------------------------------------
function createRecentlyClosedTab(key) {
	chrome.tabs.create({url: bgPage.recentlyClosedTabs[key].url});
	deleteRecentlyClosedTab(key);
}
