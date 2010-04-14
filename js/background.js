// Scripts for the background.html

//------------------------------------------------------------------------------
// Global variables
//------------------------------------------------------------------------------
// Contains all AppConfig
var appConfig;
// Map of all opened tabs keyed by tabId
var allOpenedTabs = {};
// Array of recently closed tabs
var recentlyClosedTabs;
// Array of URL blacklist filters
var filters;
// maximal number of elements (rcts) shown on popup page
var maxPopupLength;

// ------------------------------------------------------------------------------
// Main method: Everything starts here!
// ------------------------------------------------------------------------------
function main() {
  loadAppConfig();
  // Restore state from localStorage
  restoreState();
  // Process all open tabs
  chrome.tabs.getAllInWindow(null, getAllTabsInWindow);
  // Listener onUpdated
  chrome.tabs.onUpdated.addListener(updatedTabsListener);
  // Listener onRemoved
  chrome.tabs.onRemoved.addListener(removedTabsListener);
  // Listener onSelectionChanged
  chrome.tabs.onSelectionChanged.addListener(selectionChangedTabsListener);
}


// Loads the extension config (manifest.json).
function loadAppConfig() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      appConfig = JSON.parse(this.responseText);
    }
  };
  xhr.send();
}

// Restores the state of the extension.
function restoreState() {
  var storedVersion = localStorage['version'];
  if (appConfig.version != storedVersion) {
    chrome.tabs.create( {
      'url' : chrome.extension.getURL('infonews.html'),
      'selected' : true
    }, function(tab) {
      // Tab opened: possible migration procedures
      });
    localStorage.setItem('version', appConfig.version);
  }
  // Fetches the filters.
  fetchFilters();
  // Fetches the maxPopupLength.
  fetchMaxPopupLength();
  // Fetches the recentlyClosedTabs.
  fetchRecentlyClosedTabs();
}

//------------------------------------------------------------------------------
// Function defining the tabInfo object.
//------------------------------------------------------------------------------
function tabInfo(tabId, windowId, favIconUrl, dateOfUpdate, title, url, tabShot) {
  this.tabId = tabId;
  this.windowId = windowId;
  this.favIconUrl = favIconUrl;
  this.dateOfUpdate = dateOfUpdate;
  this.title = title;
  this.url = url;
  this.tabShot = tabShot;
}

//------------------------------------------------------------------------------
// MAX POPUP LENGTH
//------------------------------------------------------------------------------
// Fetches/Initialises the maxPopupLength from the localStorage.
function fetchMaxPopupLength() {
  maxPopupLength = localStorage['maxPopupLength'];
  if (maxPopupLength === undefined)
   storeMaxPopupLength(15);
}

// Modifys/Persists the maxPopupLength to the localStorage.
// @param newMaxPopupLength maxPopupLength to store in the localStorage
function storeMaxPopupLength(newMaxPopupLength) {
  maxPopupLength = newMaxPopupLength;
  localStorage.setItem('maxPopupLength', maxPopupLength);
}

// ------------------------------------------------------------------------------
// FILTERS
// ------------------------------------------------------------------------------
// Function defining the filter-object.
// @param url url to filter
function filter(url) {
  this.url = url;
}

// Adds url to the filters.
// @param url url to be added
function addUrlToFilters(url) {
  filters.unshift(new filter(url));
  storeFilters();
}

// Removes a filter by index.
// @param i index of element to be removed from the filters
function removeFilterByIndex(i) {
  filters.splice(i, 1)
  storeFilters();
}

// Removes a filter by url.
// @param url url of element to be removed from the filters
function removeFilterByUrl(url) {
  for (i in filters)
    if (filters[i].url == url)
      removeFilterByIndex(i);
}

// Returns true if the filters contain the given url else false.
// @param url url to check if it is in the filters object
function shouldBeIgnored(url) {
  if (url === undefined)
    return true;
  for (key in filters)
    if (url == filters[key].url)
      return true;
  return false;
}

// Fetches/Initialises the filters from the localStorage.
function fetchFilters() {
  var filterString = localStorage['filters'];
  if (filterString === undefined) {
    storeFilters([new filter('chrome://newtab/'), new filter('about:blank')]);
  } else {
    filters = JSON.parse(filterString);
    for ( var i in filters)
      if (filters[i] == null || filters[i] === undefined)
        filters.splice(i, 1);
  }
}

// Modifys/Persists the filters to the localStorage
// @param newFilters filters object to store in the localStorage
function storeFilters(newFilters) {
  if (newFilters !== undefined)
    filters = newFilters;
  localStorage.setItem('filters', JSON.stringify(filters));
}

// ------------------------------------------------------------------------------
// OPENED TABS
// ------------------------------------------------------------------------------
// Sends all opened tabs to be processed.
// @param tabs all opened tabs to be processed
function getAllTabsInWindow(tabs) {
  for (var key in tabs)
    processOpenedTab(tabs[key]);
}

// Listens to onUpdate event and processes the new data after every tab update.
// @param tabId id of the tab to be updated
// @param changeInfo changeInfo of the tab to be updated
// @param tab tab to be updated
function updatedTabsListener(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete")
    delete allOpenedTabs[tabId];
    processOpenedTab(tab);
}

// Listens to SelectionChanged event and updates a preview image for an opened tab.
// @param tabId id of the tab to update the image for
function selectionChangedTabsListener(tabId) {
  setImgDataUrl(tabId);
}

// Processes tab by inserting a corresponding tabInfo into allOpenedTabs
// and removes rct of tab with the same url that is already opened.
// @param tab tab to be processed
function processOpenedTab(tab) {
  if (tab === undefined)
   return;
  var tabUrl = tab.url;
  if (shouldBeIgnored(tabUrl))
   return;
  var tabId = tab.id;
  allOpenedTabs[tabId] = new tabInfo(tabId, tab.windowId, tab.favIconUrl,
     new Date(), tab.title, tabUrl, null);
  if (tab.selected)
   setImgDataUrl(tabId);
  // removes rct if already opened
  removeRecentlyClosedTabByUrl(tabUrl);
}

// Removes an opened tab by tabId.
// @param tabId id of the tab to be removed from the allOpenedTabs
function removeOpenedTabByTabId(tabId) {
  delete allOpenedTabs[tabId];
}

var orgImage = new Image();
var canvas = document.createElement("canvas");
//Puts the dataUrl of the tab specified by the given tabId into the object allOpenedTabs.
//@param tabId id of the tab to set the image for
function setImgDataUrl(tabId) {
if (allOpenedTabs[tabId] !== undefined)
 chrome.tabs.captureVisibleTab(allOpenedTabs[tabId].windowId, function(
     snapshotData) {
     // console.log("receiving snapshot data for tabId = " + tabId);
     orgImage.onload = function() {
       // console.log("orgImage size = " + orgImage.width + "x" + orgImage.height);
       var newHeight = 110;
       var newWidth = orgImage.width * newHeight / orgImage.height;
       // Create a canvas with the desired dimensions
       canvas.width = newWidth + 10;
       canvas.height = newHeight + 10;
       var context = canvas.getContext("2d");

       // Scale and draw the source image to the canvas
       context.drawImage(orgImage, 5, 5, newWidth, newHeight);

       // Convert the canvas to a data URL in PNG format
       allOpenedTabs[tabId].tabShot = canvas.toDataURL();

       // Check the result
       // var chkImage = new Image();
       // chkImage.onload = function() {
       // console.log("chkImage size = " + chkImage.width + "x" + chkImage.height); }
       // chkImage.src = allOpenedTabs[tabId].tabShot;
     }
     orgImage.src = snapshotData;
   })
}

// ------------------------------------------------------------------------------
// RECENTLY CLOSED TABS
// ------------------------------------------------------------------------------
// Sends the closed tab to be processed.
// @param tabId id of the tab to be processed
function removedTabsListener(tabId) {
  processClosedTab(allOpenedTabs[tabId]);
}

// Processes tabInfo by removing the corresponding tab from the allOpenedTabs array,
// by removing the possible corresponding rct by url from the recentlyClosedTabs
// array and adds the tabInfo object to the recentlyClosedTabs.
// @param tabInfo tabInfo to process
function processClosedTab(tabInfo) {
  if (tabInfo === undefined)
   return;
  removeOpenedTabByTabId(tabInfo.tabId);
  removeRecentlyClosedTabByUrl(tabInfo.url)
  addClosedTab(tabInfo);
}

// Adds new closedTab to recentlyClosedTabs and saves it.
// @param tabInfo
function addClosedTab(tabInfo) {
  tabInfo.timestamp = new Date();
  recentlyClosedTabs.unshift(tabInfo);
  storeRecentlyClosedTabs();
}

// Opens selected recentlyClosedTab.
// @param i index of recentlyClosedTab array to open
function openRecentlyClosedTab(i) {
  chrome.tabs.create({ url: recentlyClosedTabs[i].url });
}

// Removes a rct by url.
// @param url url of the element to be removed from the recentlyClosedTabs
function removeRecentlyClosedTabByUrl(url) {
for (i in recentlyClosedTabs)
 if (recentlyClosedTabs[i].url == url)
   removeRecentlyClosedTabByIndex(i);
}

// Removes a rct by index.
// @param i index of the element to be removed from the recentlyClosedTabs
function removeRecentlyClosedTabByIndex(i) {
  recentlyClosedTabs.splice(i, 1)
  storeRecentlyClosedTabs();
}

//Fetches/Initialises the recentlyClosedTabs from the localStorage.
function fetchRecentlyClosedTabs() {
  var recentlyClosedTabsString = localStorage['recentlyClosedTabs'];
  if (recentlyClosedTabsString === undefined) {
   storeRecentlyClosedTabs([]);
  } else {
   recentlyClosedTabs = JSON.parse(recentlyClosedTabsString);
   for ( var i in recentlyClosedTabs)
     if (recentlyClosedTabs[i] == null)
       recentlyClosedTabs.splice(i, 1);
  }
}

// Modifys/Persists the recentlyClosedTabs to the localStorage.
// @param newRecentlyClosedTabs recentlyClosedTabs object to store in the localStorage
function storeRecentlyClosedTabs(newRecentlyClosedTabs) {
  if (newRecentlyClosedTabs !== undefined)
    recentlyClosedTabs = newRecentlyClosedTabs;
  localStorage.setItem('recentlyClosedTabs', JSON.stringify(recentlyClosedTabs));
}
