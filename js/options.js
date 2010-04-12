// Scripts for the options.html

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();
//console.log(bgPage.recentlyClosedTabs);
//console.log(bgPage.allOpenedTabs);
console.log(bgPage.filterArray);

//------------------------------------------------------------------------------
// Everything starts here
//------------------------------------------------------------------------------
function main() {
  this.createHeader('Options');
  this.createFooter();
  createListOfFiltersHeader();
  var filterListDivElement = $('#filterListDivElement').addClass('filterListDivElement');
  createListOfFilters();
  createListOfRecentlyClosedTabs();
  createMaxPopupTableLengthSelect();
  showMaxPopupTableLength();
}

//------------------------------------------------------------------------------
// Saves options to localStorage.
//------------------------------------------------------------------------------
// TODO: Transform with jquery
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
	$('#tabsCount').selectOptions(bgPage.maxPopupTableLength, true);
}

//------------------------------------------------------------------------------
// Creates the header of the list of filters.
//------------------------------------------------------------------------------
function createListOfFiltersHeader() {
  var filterListDivElement = $('#filterListDivElement').addClass('filterListDivElement');
  var h3Element = $('<h3>')
    .text('Active URL filters:')
    .appendTo($('#filterListDivElement'));
}

//------------------------------------------------------------------------------
// Creates list of filters.
//------------------------------------------------------------------------------
function createListOfFilters() {
    if (bgPage.filterArray.length == 0) {
      var noFiltersDivElement = $('<span>')
        .text('No filters.')
        .appendTo($('#filterListDivElement'));
    } else {
      for (var m = 0; m < bgPage.filterArray.length; m++) {
        var filterListElementDivElement = $('<div>')
          .addClass('filterListElementDivElement')
          .attr({ id: 'filterListElementDivElement' + m })
          .appendTo($('#filterListDivElement'));
        
        var filterDivElement = $('<div>')
          .addClass('filterDivElement')
          .attr({ id: 'filterElementDiv' + m})
          .text(bgPage.filterArray[m])
          .appendTo(filterListElementDivElement);
        
        // filterDeleteButton building
        var filterDeleteButtonDivElement = $('<div>')
          .addClass('filterDeleteButtonDivElement')
          .attr({ id: 'filterDeleteButtonDivElement' + m})
          .appendTo(filterListElementDivElement);
        var filterDeleteButtonElement = $('<input>')
          .attr({ 
            id: 'filterDeleteButtonElement' + m,
            type: 'button',
            value: 'Delete Filter'})
          .click(function() {deleteUrlFromFilters(m);return false;})
          .appendTo(filterDeleteButtonDivElement);
    }
  }
}

//------------------------------------------------------------------------------
// Rebuilds the list of filters.
//------------------------------------------------------------------------------
function rebuildListOfFilters() {
  for (var i = 0; i <= bgPage.filterArray.length; i++) {
    $('#filterListElementDivElement' + i).remove();
  }
  createListOfFilters();
}

//------------------------------------------------------------------------------
// Creates list of recently closed tabs.
//------------------------------------------------------------------------------
function createListOfRecentlyClosedTabs() {
  if (bgPage.recentlyClosedTabs.length == 0) {
	  showNoRCTs();
  } else {
    for (var i = 0; i < bgPage.recentlyClosedTabs.length; i++) {
      this.createRctDivForOptions(i);
    }
  }
}

//------------------------------------------------------------------------------
// Rebuilds the rct list.
//------------------------------------------------------------------------------
function rebuildListOfRecentlyClosedTabs() {
  for (var j = 0; j <= bgPage.recentlyClosedTabs.length; j++) {
    $('#rctDivElement' + j).remove();
  }
  createListOfRecentlyClosedTabs();
}

//------------------------------------------------------------------------------
// Deletes element from the list of recently closed tabs.
//------------------------------------------------------------------------------
function deleteRecentlyClosedTab(i) {
  bgPage.removeClosedTabByIndex(i);
  rebuildListOfRecentlyClosedTabs()
}

//------------------------------------------------------------------------------
// Adds tab url to the filters.
//------------------------------------------------------------------------------
function addRecentlyClosedTabToFilters(i) {
	var url = bgPage.recentlyClosedTabs[i].url;
	var urlPattern = prompt("Ignore this URL in future?", url);
	if (urlPattern != null) {
		addUrlToFilters(urlPattern);
		rebuildListOfFilters();
	}
}

//------------------------------------------------------------------------------
// Adds pattern to the filters.
//------------------------------------------------------------------------------
function addUrlToFilters(pattern) {
  bgPage.filterArray.unshift(pattern)
  bgPage.storeFilterArray();
}

//------------------------------------------------------------------------------
// Deletes a filter from the list of filters.
//------------------------------------------------------------------------------
function deleteUrlFromFilters(i) {
  bgPage.removeFilterByIndex(i);
	rebuildListOfFilters();
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
function createRecentlyClosedTab(i) {
	chrome.tabs.create({url: bgPage.recentlyClosedTabs[i].url});
	deleteRecentlyClosedTab(i);
}
