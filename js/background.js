// Scripts for the background.html

//------------------------------------------------------------------------------
// Global variables
//------------------------------------------------------------------------------
//
var appConfig;
// Map of all opened tabs keyed by tabId
var allOpenedTabs = {};
// Array of recently closed tabs
var recentlyClosedTabs;
// URL blacklist filters
var filterArray;
// maximal table length of RCT's shown in popup
var maxPopupTableLength;

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

// ------------------------------------------------------------------------------
// Loads the extension config (manifest.json).
// ------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------
// Restores the state of the extension.
// ------------------------------------------------------------------------------
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
  //
  fetchFilterArray();
  //
  fetchMaxPopupTableLength();
  //
  fetchRecentlyClosedTabs();
}

// ------------------------------------------------------------------------------
// Gets/Initialises the filterArray from the localStorage
// ------------------------------------------------------------------------------
function fetchFilterArray() {
  var filterString = localStorage['urlFilterArray'];
  if (filterString === undefined) {
    storeFilterArray( [ 'chrome://newtab/', 'about:blank' ]);
  } else {
    filterArray = JSON.parse(filterString);
  }
  //console.log(filterArray);
}

// ------------------------------------------------------------------------------
// Modifys/Persists the filterArray to the localStorage
// ------------------------------------------------------------------------------
function storeFilterArray(newFilterArray) {
  if (newFilterArray !== undefined)
    filterArray = newFilterArray;
  localStorage.setItem('urlFilterArray', JSON.stringify(filterArray));
}

// ------------------------------------------------------------------------------
// Fetches/Initialises the maxPopupTableLength from the localStorage
// ------------------------------------------------------------------------------
function fetchMaxPopupTableLength() {
  maxPopupTableLength = localStorage['maxPopupTableLength'];
  if (maxPopupTableLength === undefined)
    storeMaxPopupTableLength(15);
  // console.log(maxPopupTableLength);
}

// ------------------------------------------------------------------------------
// Modifys/Persists the maxPopupTableLength to the localStorage
// ------------------------------------------------------------------------------
function storeMaxPopupTableLength(newMaxLength) {
  maxPopupTableLength = newMaxLength;
  localStorage.setItem('maxPopupTableLength', maxPopupTableLength);
}

// ------------------------------------------------------------------------------
// Fetches/Initialises the recentlyClosedTabs from the localStorage
// ------------------------------------------------------------------------------
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
  // console.log(recentlyClosedTabs);
}

// ------------------------------------------------------------------------------
// Modifys/Persists the recentlyClosedTabs to the localStorage
// ------------------------------------------------------------------------------
function storeRecentlyClosedTabs(newRecentlyClosedTabs) {
  if (newRecentlyClosedTabs !== undefined)
    recentlyClosedTabs = newRecentlyClosedTabs;
  localStorage.setItem('recentlyClosedTabs', JSON.stringify(recentlyClosedTabs));
}

// ------------------------------------------------------------------------------
// Function defining the tabInfo-object.
// ------------------------------------------------------------------------------
function tabInfo(tabId, windowId, faviconUrl, dateOfUpdate, title, url, tabShot) {
  this.tabId = tabId;
  this.windowId = windowId;
  this.favIconUrl = faviconUrl;
  this.dateOfUpdate = dateOfUpdate;
  this.title = title;
  this.url = url;
  this.tabShot = tabShot;
}

// ------------------------------------------------------------------------------
// Listens to SelectionChanged event and update a preview image for an opened tab
// ------------------------------------------------------------------------------
function selectionChangedTabsListener(tabId) {
  setImgDataUrl(tabId);
}

var orgImage = new Image();
var canvas = document.createElement("canvas");

// ------------------------------------------------------------------------------
// Puts the dataUrl of the tab specified by the given tabId into the object
// allOpenedTabs.
// ------------------------------------------------------------------------------
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
// Sends all tabs to be processed
// ------------------------------------------------------------------------------
function getAllTabsInWindow(tabs) {
  for ( var key in tabs)
    processOpenedTab(tabs[key]);
}

// ------------------------------------------------------------------------------
// After every tab update process the new data
// ------------------------------------------------------------------------------
function updatedTabsListener(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete")
    delete allOpenedTabs[tabId];
    processOpenedTab(tab);
  // TODO: for performance reasons maybe delete openedTabWithTabId and save
  // new openedTab
}

// ------------------------------------------------------------------------------
// Processes opened tab by inserting a corresponding tabInfo into allOpenedTabs
// and removes rct of tab with the same url already opened.
// ------------------------------------------------------------------------------
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
  removeClosedTabByUrl(tabUrl);
}

// ------------------------------------------------------------------------------
//
// ------------------------------------------------------------------------------
function shouldBeIgnored(tabUrl) {
  if (tabUrl === undefined)
    return true;
  for (key in filterArray)
    if (tabUrl == filterArray[key])
      return true;
  return false;
}

// ------------------------------------------------------------------------------
// Removes a rct by url.
// @param tabUrl url of the element to be removed from the rct array
// ------------------------------------------------------------------------------
function removeClosedTabByUrl(tabUrl) {
  for (i in recentlyClosedTabs)
    if (recentlyClosedTabs[i].url == tabUrl)
      removeClosedTabByIndex(i);
}

// ------------------------------------------------------------------------------
// Removes a rct by index.
// @param i index of rct array
// ------------------------------------------------------------------------------
function removeClosedTabByIndex(i) {
  recentlyClosedTabs.splice(i, 1)
  storeRecentlyClosedTabs();
}

//------------------------------------------------------------------------------
// Removes a filter by index.
// @param i index of filter array
//------------------------------------------------------------------------------
function removeFilterByIndex(i) {
  filterArray.splice(i, 1)
  storeFilterArray();
}

// ------------------------------------------------------------------------------
// Removes an opened tab by tabId.
// ------------------------------------------------------------------------------
function removeOpenedTabByTabId(tabId) {
  delete allOpenedTabs[tabId];
}

// ------------------------------------------------------------------------------
// Adds new closedTab to rct array and saves it.
// ------------------------------------------------------------------------------
function addClosedTab(tabInfo) {
  tabInfo.timestamp = new Date();
  recentlyClosedTabs.unshift(tabInfo);
  storeRecentlyClosedTabs();
}

// ------------------------------------------------------------------------------
// Puts openedTab into rct array and deletes it from the openedTabs array.
// ------------------------------------------------------------------------------
function processClosedTab(tabInfo) {
  if (tabInfo === undefined)
    return;
  removeOpenedTabByTabId(tabInfo.tabId);
  removeClosedTabByUrl(tabInfo.url)
  addClosedTab(tabInfo);
}

// ------------------------------------------------------------------------------
// Puts the tabInfo off the currently closed tab into the object
// recentlyClosedTabs.
// ------------------------------------------------------------------------------
function removedTabsListener(tabId) {
  processClosedTab(allOpenedTabs[tabId]);
}

// ------------------------------------------------------------------------------
// Opens selected RecentlyClosedTab
// @param i index of rct array
// ------------------------------------------------------------------------------
function openRecentlyClosedTab(i) {
  chrome.tabs.create({url: recentlyClosedTabs[i].url});
}
