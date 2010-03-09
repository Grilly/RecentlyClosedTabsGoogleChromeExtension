// Scripts for the background.html

//------------------------------------------------------------------------------
// Global variables
// Info for all opened tabs
var allOpenedTabs = {};
console.log(allOpenedTabs);
// URL of recently closed tabs
var recentlyClosedTabs = [];
console.log(recentlyClosedTabs);

//------------------------------------------------------------------------------
// Mainmethod: Everything starts here!
function main() {
  chrome.tabs.getAllInWindow(null, getAllTabsInWindow)
  // Listener onUpdated
  chrome.tabs.onUpdated.addListener(updateAllOpenedTabs);
  // Listener onRemoved
  chrome.tabs.onRemoved.addListener(setClosedTab);
}

//------------------------------------------------------------------------------
// Function defining the tabInfo-object.
function tabInfo(tabId, faviconUrl, dateOfUpdate, title, url) {
  this.tabId = tabId;
  this.faviconUrl = faviconUrl;
  this.dateOfUpdate = dateOfUpdate;
  this.title = title;
  this.url = url;
}

//------------------------------------------------------------------------------
// Puts all open tabs into the object allOpenedTabs on the start of this extension.

function getAllTabsInWindow(tabs) {
  for (var key in tabs) {
    var tabId = tabs[key].id;
    var tabFavIconUrl = tabs[key].favIconUrl;
    var tabUrl = tabs[key].url;
    var tabTitle = tabs[key].title;
    
    allOpenedTabs[tabId] = new tabInfo(tabId, tabFavIconUrl, new Date(), tabTitle, tabUrl);
  }
}

//------------------------------------------------------------------------------
// Puts the tabInfo into the object allOpenedTabs. 
// Result: object with all opened tabs.
function updateAllOpenedTabs(tabId, changeInfo, tab) {
  var tabId = tab.id;
  var tabFavIconUrl = tab.favIconUrl;
  var tabUrl = tab.url;
  var tabTitle = tab.title;

  if (changeInfo.status == "complete") {
    allOpenedTabs[tabId] = new tabInfo(tabId, tabFavIconUrl, new Date(), tabTitle, tabUrl);
  }
}

//------------------------------------------------------------------------------
// Puts the ctabInfo of the currently closed tab into the object recentlyClosedTabs.
// Result: object with all recently closed tabs.
function setClosedTab(tabId) {

  var closedTabInfo = allOpenedTabs[tabId];
  console.log(closedTabInfo);
  
  if (closedTabInfo === undefined) {
    alert("closedTabInfo === undefined");
    return;
  }

  var length = recentlyClosedTabs.length;
  if(length == 0) {
    recentlyClosedTabs[0] = { 'timestamp':new Date(), 'favicon':closedTabInfo.faviconUrl, 'title':closedTabInfo.title, 'url':closedTabInfo.url };
  } else {
    recentlyClosedTabs[length] = {'timestamp':new Date(), 'favicon':closedTabInfo.faviconUrl, 'title':closedTabInfo.title, 'url':closedTabInfo.url };
  }

  delete allOpenedTabs[tabId];
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
// Gets the first 20 letters of the title.
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