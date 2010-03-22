// Scripts for the background.html

//------------------------------------------------------------------------------
// Global variables
// Info for all opened tabs
var allOpenedTabs = {};
//console.log(allOpenedTabs);
// URL of recently closed tabs
var recentlyClosedTabs = [];
//console.log(recentlyClosedTabs);
// URL blacklist filters
var urlFilterArray = ['chrome://newtab/', 'about:blank'];
console.log(urlFilterArray);

//------------------------------------------------------------------------------
// Mainmethod: Everything starts here!
function main() {
	chrome.tabs.getAllInWindow(null, getAllTabsInWindow)
	// Listener onUpdated
	chrome.tabs.onUpdated.addListener(updatedTabsListener);
	// Listener onRemoved
	chrome.tabs.onRemoved.addListener(removedTabsListener);
	//chrome.tabs.onSelectionChanged.addListener(setImgDataUrl);
	// log all views
	console.log(chrome.extension.getViews());
	console.log(chrome.extension.getExtensionTabs());
}

//------------------------------------------------------------------------------
// Function defining the tabInfo-object.
function tabInfo(tabId, windowId, faviconUrl, dateOfUpdate, title, url, tabShot) {
	this.tabId = tabId;
	this.windowId = windowId;
	this.faviconUrl = faviconUrl;
	this.dateOfUpdate = dateOfUpdate;
	this.title = title;
	this.url = url;
	this.tabShot = tabShot;
}

//------------------------------------------------------------------------------
// Puts the dataUrl of the tab specified by the given tabId into the object allOpenedTabs.
function setImgDataUrl(tabId) {
	chrome.tabs.captureVisibleTab(allOpenedTabs[tabId].windowId, function(imageData) {
		allOpenedTabs[tabId].tabShot = imageData;
	})
}

//------------------------------------------------------------------------------
// Puts all open tabs into the object allOpenedTabs on the start of this extension.
function getAllTabsInWindow(tabs) {
	for (var key in tabs) {
		var tabId = tabs[key].id;
		var windowId = tabs[key].windowId;
		var tabFavIconUrl = tabs[key].favIconUrl;
		var tabUrl = tabs[key].url;
		var tabTitle = tabs[key].title;
    
		allOpenedTabs[tabId] = new tabInfo(tabId, windowId, tabFavIconUrl, new Date(), tabTitle, tabUrl, null);
		if(tabs[key].selected) {
			setImgDataUrl(tabId);
		}
	}
}

//------------------------------------------------------------------------------
// Puts the tabInfo into the object allOpenedTabs. 
// Result: object with all opened tabs.
function updatedTabsListener(tabId, changeInfo, tab) {
	var tabId = tab.id;
	var windowId = tab.windowId;
	var tabFavIconUrl = tab.favIconUrl;
	var tabUrl = tab.url;
	var tabTitle = tab.title;
	var tabShot = null;

	if (changeInfo.status == "complete") {
		allOpenedTabs[tabId] = new tabInfo(tabId, windowId, tabFavIconUrl, new Date(), tabTitle, tabUrl, null);
		if(tab.selected) {
			setImgDataUrl(tabId);
		}
	}
}


//------------------------------------------------------------------------------
// Puts the ctabInfo of the currently closed tab into the object recentlyClosedTabs.
// Result: object with all recently closed tabs.
function removedTabsListener(tabId) {

	var closedTabInfo = allOpenedTabs[tabId];
  
	delete allOpenedTabs[tabId];
	
	// Cancel function if tab is not loaded yet
	if (closedTabInfo === undefined) {
		//alert("closedTabInfo === undefined");
		return;
	}
	
	// Cancel function if tab is a new tab or blank 
	if (closedTabInfo.url == 'chrome://newtab/' || closedTabInfo.url == 'about:blank') {
		return;
	}
	
	// Cancel function if tab is already in the list
	for (key in recentlyClosedTabs) {
		if (recentlyClosedTabs[key].url == closedTabInfo.url) {
			return;
		}
	}

	var length = recentlyClosedTabs.length;
	if(length == 0) {
		recentlyClosedTabs[0] = { 'timestamp':new Date(), 'favicon':closedTabInfo.faviconUrl, 'title':closedTabInfo.title, 'url':closedTabInfo.url, 'tabShot':closedTabInfo.tabShot };
	} else {
		recentlyClosedTabs[length] = {'timestamp':new Date(), 'favicon':closedTabInfo.faviconUrl, 'title':closedTabInfo.title, 'url':closedTabInfo.url, 'tabShot':closedTabInfo.tabShot };
	}
}

//------------------------------------------------------------------------------
// Deletes an element from the recentlyClosedTabs by id.
function deleteRecentlyClosedTabById(id) {
	if (recentlyClosedTabs.length >= 1) {
		delete recentlyClosedTabs[id];
		rearrangeRecentlyClosedTab();
	}
}

//------------------------------------------------------------------------------
// Gets the first letters of the title.
function getTitel(title) {
	var result = title;
	if(title.length > 45) {
		result = title.substring(0,44) + '...';
	}
	return result;
}

//------------------------------------------------------------------------------
// Rearranges the index of the recentlyClosedTabs.
function rearrangeRecentlyClosedTab() {
	var tmpArray = [];
	var counter = 0;
  
	for (key in recentlyClosedTabs) {
		if (recentlyClosedTabs[key] !== undefined) {
			tmpArray[counter] = recentlyClosedTabs[key];
			counter++;
		}
	}
	recentlyClosedTabs = tmpArray;
}