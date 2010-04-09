// Scripts for the options.html

//------------------------------------------------------------------------------
// Everything starts here
//------------------------------------------------------------------------------
function main() {
	this.createHeader('Options');
	this.createFooter();
	showMaxPopupTableLength();
	createListOfFilters();
	createListOfRecentlyClosedTabs();
}

//------------------------------------------------------------------------------
// Saves options to localStorage.
//------------------------------------------------------------------------------
function saveMaxPopupTableLength() {
	var bgPage = chrome.extension.getBackgroundPage();
	var select_tabsCount = document.getElementById("tabsCount");
	bgPage.storeMaxPopupTableLength(select_tabsCount.children[select_tabsCount.selectedIndex].value);
	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() { status.innerHTML = ""; }, 750);
}

//------------------------------------------------------------------------------
// Restores select box state to saved value from localStorage.
//------------------------------------------------------------------------------
function showMaxPopupTableLength() {
	var bgPage = chrome.extension.getBackgroundPage();
	var select = document.getElementById("tabsCount");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == bgPage.fetchMaxPopupTableLength()) {
			child.selected = "true";
			break;
		}
	}
}

//------------------------------------------------------------------------------
//Creates list of filters.
//------------------------------------------------------------------------------
function createListOfFilters() {
	var bgPage = chrome.extension.getBackgroundPage();
	var urlFilterArray = bgPage.fetchUrlFilterArray();
    var size = urlFilterArray.length;
    
    var filterDivElement = $('#filterDiv').addClass('filterDiv');
    var h3Element = $('<h3>').text('Active URL filters:').appendTo(filterDivElement);
    var tableElement = $('<table>').attr({ id: 'filterTable' }).appendTo(filterDivElement);
    for (var i = 0; i < size; i++) {
    	addFilterRowToListTable(bgPage.urlFilterArray[i]);
    }
}

//------------------------------------------------------------------------------
// Adds a new row to the filter list.
//------------------------------------------------------------------------------
function addFilterRowToListTable(urlString) {
	var trElement = $('<tr>').appendTo($('#filterTable'));
    var tdElement = $('<td>').text(urlString).appendTo(trElement);
}

//------------------------------------------------------------------------------
//Creates list of recently closed tabs.
//------------------------------------------------------------------------------
function createListOfRecentlyClosedTabs() {
	var bgPage = chrome.extension.getBackgroundPage();
	var recentlyClosedTabsArray = bgPage.recentlyClosedTabs;
	//console.log(recentlyClosedTabsArray);

	if (recentlyClosedTabsArray.length == 0) {
		showNoRCTs();
	} else {
		var rctTable = $('<table>').attr({ id: 'rctTable' }).appendTo($('#rootDiv'));
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
  // TODO: how to find the parent node without assuming that its id is 'table'
	$('#rctDivElement' + tabInfo.tabId).remove();
	createRCTListEditButtons(tabInfo, i);
}

//------------------------------------------------------------------------------
// Deletes element from the list of recently closed tabs.
//------------------------------------------------------------------------------
function deleteRecentlyClosedTab(tabInfo, i) {
	var bgPage = chrome.extension.getBackgroundPage();
	//should remove this table row
	var tabId = bgPage.recentlyClosedTabs[i].tabId;
	$('#rctDivElement' + tabInfo.tabId).remove();
	//show 'no rcts'-String
	if (bgPage.recentlyClosedTabs.length == 0) {
		showNoRCTs();
	}
	
	bgPage.removeClosedTabWithThisUrl(bgPage.getClosedTabById(tabId).url);
}

function addRecentlyClosedTabToFiltersAndDelete(tabId) {
	var bgPage = chrome.extension.getBackgroundPage();
	var url = bgPage.getClosedTabById(tabId).url;
	var urlPattern = prompt("Ignore this URL in future?", url);
	//console.log(urlPattern);
	if (urlPattern != null) {
		bgPage.urlFilterArray[bgPage.urlFilterArray.length] = urlPattern;
		addFilterRowToListTable(urlPattern);
		deleteRecentlyClosedTab(tabId);
	}
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
	var bgPage = chrome.extension.getBackgroundPage();
	chrome.tabs.create({url: bgPage.recentlyClosedTabs[key].url});
	deleteRecentlyClosedTab(key);
}
