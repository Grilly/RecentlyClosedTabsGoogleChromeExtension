// Scripts for the background.html

//------------------------------------------------------------------------------
// Global variables
//------------------------------------------------------------------------------
// Map of all opened tabs keyed by tabId
var allOpenedTabs = {};
// Array of recently closed tabs
var recentlyClosedTabs;
// URL blacklist filters
var urlFilterArray;
// maximal table length of RCT's shown in popup
var maxPopupTableLength;

//------------------------------------------------------------------------------
// Main method: Everything starts here!
//------------------------------------------------------------------------------
function main() {
	// Restore state from localStorage
	restoreState();
	// Process all open tabs
	chrome.tabs.getAllInWindow(null, getAllTabsInWindow)
	// Listener onUpdated
	chrome.tabs.onUpdated.addListener(updatedTabsListener);
	// Listener onRemoved
	chrome.tabs.onRemoved.addListener(removedTabsListener);
    // Listener onSelectionChanged
	chrome.tabs.onSelectionChanged.addListener(selectionChangedTabsListener);
}

//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
function restoreState() {
    //
    fetchUrlFilterArray();
    //
    fetchMaxPopupTableLength();
    //
    fetchRecentlyClosedTabs();
}

//------------------------------------------------------------------------------
// Fetch/Initialise the urlFilterArray from the localStorage
//------------------------------------------------------------------------------
function fetchUrlFilterArray() {
	var urlFilterString = localStorage['urlFilterArray'];
    if (urlFilterString == undefined) {
    	storeUrlFilterArray(['chrome://newtab/', 'about:blank']);
    } else {
        urlFilterArray = JSON.parse(urlFilterString);
    }
	console.log(urlFilterArray);
}

//------------------------------------------------------------------------------
// Modify/Persist the urlFilterArray to the localStorage
//------------------------------------------------------------------------------
function storeUrlFilterArray(newUrlFilterArray) {
  if (newUrlFilterArray != undefined) urlFilterArray = newUrlFilterArray;
  localStorage.setItem('urlFilterArray', JSON.stringify(urlFilterArray));
}

//------------------------------------------------------------------------------
//Fetch/Initialise the urlFilterArray from the localStorage
//------------------------------------------------------------------------------
function fetchMaxPopupTableLength() {
	maxPopupTableLength = localStorage['maxPopupTableLength'];
	if (maxPopupTableLength == undefined) storeMaxPopupTableLength(15);
	console.log(maxPopupTableLength);
}

//------------------------------------------------------------------------------
// Modify/Persist the maxPopupTableLength to the localStorage
//------------------------------------------------------------------------------
function storeMaxPopupTableLength(newMaxLength) {
    maxPopupTableLength = newMaxLength;
    localStorage.setItem('maxPopupTableLength', maxPopupTableLength);
}

//------------------------------------------------------------------------------
//Fetch/Initialise the recentlyClosedTabs from the localStorage
//------------------------------------------------------------------------------
function fetchRecentlyClosedTabs() {
	var recentlyClosedTabsString = localStorage['recentlyClosedTabs'];
    if (recentlyClosedTabsString == undefined) {
    	storeRecentlyClosedTabs([]);
    } else {
    	recentlyClosedTabs = JSON.parse(recentlyClosedTabsString);
    }
	console.log(recentlyClosedTabs);
}

//------------------------------------------------------------------------------
// Modify/Persist the recentlyClosedTabs to the localStorage
//------------------------------------------------------------------------------
function storeRecentlyClosedTabs(newRecentlyClosedTabs) {
	if (newRecentlyClosedTabs != undefined) recentlyClosedTabs = newRecentlyClosedTabs;
    localStorage.setItem('recentlyClosedTabs', JSON.stringify(recentlyClosedTabs));
}

//------------------------------------------------------------------------------
// Function defining the tabInfo-object.
//------------------------------------------------------------------------------
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
// Listen to SelectionChanged event and update a preview image
//------------------------------------------------------------------------------
function selectionChangedTabsListener(tabId, selectInfo) {
    console.log(selectInfo);
    setImgDataUrl(tabId);
}

//------------------------------------------------------------------------------
// Puts the dataUrl of the tab specified by the given tabId into the object allOpenedTabs.
//------------------------------------------------------------------------------
function setImgDataUrl(tabId) {
    if (allOpenedTabs[tabId] != undefined)
	chrome.tabs.captureVisibleTab(allOpenedTabs[tabId].windowId, function(imageData) {
		allOpenedTabs[tabId].tabShot = imageData;
	})
}

//------------------------------------------------------------------------------
// Puts all open tabs into the object allOpenedTabs on the start of this extension.
//------------------------------------------------------------------------------
function getAllTabsInWindow(tabs) {
	for (var key in tabs) processOpenedTab(tabs[key]);
}

//------------------------------------------------------------------------------
// Puts the tabInfo into the object allOpenedTabs. 
// Result: object with all opened tabs.
//------------------------------------------------------------------------------
function updatedTabsListener(tabId, changeInfo, tab) {
	if (changeInfo.status == "complete") processOpenedTab(tab);
}

//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
function processOpenedTab(tab) {
	if (tab == undefined) return;
	var tabUrl = tab.url;
	if (shouldBeIgnored(tabUrl)) return;
	var tabId = tab.id;
	var windowId = tab.windowId;
	var tabFavIconUrl = tab.favIconUrl;
	var tabTitle = tab.title;
	var tabShot = null;
	allOpenedTabs[tabId] = new tabInfo(tabId, windowId, tabFavIconUrl, new Date(), tabTitle, tabUrl, null);
	if(tab.selected) setImgDataUrl(tabId);
    console.log(allOpenedTabs[tabId]);
    removeClosedTabWithThisUrl(tabUrl);
    storeRecentlyClosedTabs();
}

//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
function shouldBeIgnored(tabUrl) {
	if (tabUrl == undefined) return true;
	for (key in urlFilterArray) if (tabUrl == urlFilterArray[key]) return true;
	return false;
}

//------------------------------------------------------------------------------
// Remove previous occurance of the same URL
//------------------------------------------------------------------------------
function removeClosedTabWithThisUrl(tabUrl) {
    for (key in recentlyClosedTabs) {
        if (recentlyClosedTabs[key].url == tabUrl) delete recentlyClosedTabs[key];
    }
}

//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
function processClosedTab(tabInfo) {
    if (tabInfo == undefined) return;
    delete allOpenedTabs[tabInfo.tabId];
    removeClosedTabWithThisUrl(tabInfo.url)
    // Add at the end a new instance with a current timestamp
    var length = recentlyClosedTabs.length;
    recentlyClosedTabs[length] = {'timestamp':new Date(), 'favicon':tabInfo.faviconUrl, 'title':tabInfo.title, 'url':tabInfo.url, 'tabShot':tabInfo.tabShot };
    storeRecentlyClosedTabs();
    console.log(recentlyClosedTabs);
}


//------------------------------------------------------------------------------
// Puts the ctabInfo of the currently closed tab into the object recentlyClosedTabs.
// Result: object with all recently closed tabs.
//------------------------------------------------------------------------------
function removedTabsListener(tabId) {
	var closedTabInfo = allOpenedTabs[tabId];
	processClosedTab(closedTabInfo);
}

//------------------------------------------------------------------------------
// Deletes an element from the recentlyClosedTabs by id.
//------------------------------------------------------------------------------
function deleteRecentlyClosedTabById(id) {
	if (recentlyClosedTabs.length >= 1) {
		delete recentlyClosedTabs[id];
		rearrangeRecentlyClosedTab();
	}
}

//------------------------------------------------------------------------------
// Rearranges the index of the recentlyClosedTabs.
//------------------------------------------------------------------------------
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