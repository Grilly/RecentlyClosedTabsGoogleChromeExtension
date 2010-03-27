// Scripts for the background.html

//------------------------------------------------------------------------------
// Global variables
//------------------------------------------------------------------------------
//
var version;
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
	version = getVersion();
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
function getVersion() {
    var version = 'NaN';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
          var manifest = JSON.parse(this.responseText);
          version = manifest.version;
        }
    };
    xhr.send();
    return version;
}

//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
function restoreState() {
	var storedVersion = localStorage['version'];
	if (version != storedVersion) {
        chrome.tabs.create({'url': chrome.extension.getURL('infonews.html'), 'selected': true}, function(tab) {
            // Tab opened.
        });
        localStorage.setItem('version', version);
    }
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
    if (urlFilterString === undefined) {
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
  if (newUrlFilterArray !== undefined) urlFilterArray = newUrlFilterArray;
  localStorage.setItem('urlFilterArray', JSON.stringify(urlFilterArray));
}

//------------------------------------------------------------------------------
//Fetch/Initialise the urlFilterArray from the localStorage
//------------------------------------------------------------------------------
function fetchMaxPopupTableLength() {
	maxPopupTableLength = localStorage['maxPopupTableLength'];
	if (maxPopupTableLength === undefined) storeMaxPopupTableLength(15);
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
// Fetch/Initialise the recentlyClosedTabs from the localStorage
//------------------------------------------------------------------------------
function fetchRecentlyClosedTabs() {
	var recentlyClosedTabsString = localStorage['recentlyClosedTabs'];
    if (recentlyClosedTabsString === undefined) {
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
	if (newRecentlyClosedTabs !== undefined) recentlyClosedTabs = newRecentlyClosedTabs;
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
//Listen to SelectionChanged event and update a preview image
//------------------------------------------------------------------------------
function selectionChangedTabsListener(tabId, selectInfo) {
    console.log("selectionChangedTabsListener: " + selectInfo);
    setImgDataUrl(tabId);
}

//------------------------------------------------------------------------------
// Puts the dataUrl of the tab specified by the given tabId into the object allOpenedTabs.
//------------------------------------------------------------------------------
function setImgDataUrl(tabId) {
    if (allOpenedTabs[tabId] !== undefined)
	chrome.tabs.captureVisibleTab(allOpenedTabs[tabId].windowId, function(snapshotData) {
		console.log("receiving snapshot data for tabId = " + tabId);
		var orgImage = new Image();
	    orgImage.onload = function() {
	    	console.log("orgImage size = " + orgImage.width + "x" + orgImage.height);
	    	var newHeight = 110;
	    	var newWidth = orgImage.width * newHeight / orgImage.height;
	        // Create a canvas with the desired dimensions
	        var canvas = document.createElement("canvas");
	        canvas.width = newWidth + 10;
	        canvas.height = newHeight + 10;
	        var context = canvas.getContext("2d");

	        // Scale and draw the source image to the canvas
	        context.drawImage(orgImage, 5, 5, newWidth, newHeight);

	        // Convert the canvas to a data URL in PNG format
			allOpenedTabs[tabId].tabShot = canvas.toDataURL();

			// Check the result
			var chkImage = new Image();
			chkImage.onload = function() { console.log("chkImage size = " + chkImage.width + "x" + chkImage.height); }
			chkImage.src = allOpenedTabs[tabId].tabShot;
	    }
	    orgImage.src = snapshotData;
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
	if (tab === undefined) return;
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
	if (tabUrl === undefined) return true;
	for (key in urlFilterArray) if (tabUrl == urlFilterArray[key]) return true;
	return false;
}

//------------------------------------------------------------------------------
// Remove previous occurance of the same URL
//------------------------------------------------------------------------------
function removeClosedTabWithThisUrl(tabUrl) {
    for (key in recentlyClosedTabs) {
        if (recentlyClosedTabs[key] == null || recentlyClosedTabs[key].url == tabUrl)  recentlyClosedTabs.splice(key, 1);
    }
}

//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
function processClosedTab(tabInfo) {
    if (tabInfo === undefined) return;
    delete allOpenedTabs[tabInfo.tabId];
    removeClosedTabWithThisUrl(tabInfo.url)
    // Add at the begining a new instance with a current timestamp
    tabInfo.timestamp = new Date();
    recentlyClosedTabs.unshift(tabInfo);
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
// Construct a HTML table row out of tabInfo
//------------------------------------------------------------------------------
function createTableRow(tabInfo) {
  var trElement = document.createElement('tr');
  if (tabInfo == null) return trElement;

  var tdTabShotElement = document.createElement('td');
  tdTabShotElement.setAttribute('class', 'tabShotTD');
  var tabShotIMG = document.createElement('img');
  tabShotIMG.setAttribute('class', 'tabShotIMG');
  tdTabShotElement.appendChild(tabShotIMG);
  trElement.appendChild(tdTabShotElement);

  var tdUrlElement = document.createElement('td');
  tdUrlElement.setAttribute('class', 'urlTD');
  var textLinkElement = document.createElement('a');
  var linkText = document.createTextNode(tabInfo.title);
  textLinkElement.appendChild(linkText);
  tdUrlElement.appendChild(textLinkElement);
  trElement.appendChild(tdUrlElement);

  var tdFavIconElement = document.createElement('td');
  tdFavIconElement.setAttribute('class', 'faviconTD');
  var iconLinkElement = document.createElement('a');
  var favIconIMG = document.createElement('img');
//  favIconIMG.setAttribute('id', 'favIcon' + key);
  favIconIMG.setAttribute('class', 'faviconIMG');
  iconLinkElement.appendChild(favIconIMG);
  tdFavIconElement.appendChild(iconLinkElement);
  trElement.appendChild(tdFavIconElement);

  with (tabInfo) {
    trElement.setAttribute('id', tabId);
    tabShotIMG.setAttribute('id', 'tabShot' + tabId);
    if (tabShot !== undefined && tabShot != null) {
 	  tabShotIMG.src = tabShot;
    } else {
      tabShotIMG.src = '../images/default_tabShot.png';
    }
    textLinkElement.setAttribute('href', 'javascript:bgPage.openRecentlyClosedTab(' + tabId + '); removeRecentlyClosedTab(' + tabId + ');');
    textLinkElement.setAttribute('title', url);
    iconLinkElement.setAttribute('href', 'javascript:bgPage.openRecentlyClosedTab(' + tabId + '); removeRecentlyClosedTab(' + tabId + ');');
    iconLinkElement.setAttribute('title', url);
    if (tabInfo.faviconUrl !== undefined) {
      favIconIMG.setAttribute('src', faviconUrl);
    } else {
      favIconIMG.setAttribute('src', '../images/default_favicon.png');
    }
  }
  return trElement;
}

//------------------------------------------------------------------------------
// Open selected RecentlyClosedTab
//------------------------------------------------------------------------------
function openRecentlyClosedTab(tabId) {
  for (index in recentlyClosedTabs) {
    if (recentlyClosedTabs[index].tabId == tabId) {
      chrome.tabs.create({url: recentlyClosedTabs[index].url});
      recentlyClosedTabs.splice(index, 1);

      //should remove this table row
      // TODO: how to find the parent node without assuming that its id is 'table'
      //document.getElementById('table').removeChild(document.getElementById(tabId));
    }
  }
}

