// Scripts for the popup.html

//------------------------------------------------------------------------------
// Global variables.
var bgPage = chrome.extension.getBackgroundPage();

// ------------------------------------------------------------------------------
// Mainmethod: Everything starts here!
function main() {
	getListOfRecentlyClosedTabs();
}

//------------------------------------------------------------------------------
// Creates list with recently closed tabs.
function getListOfRecentlyClosedTabs() {
	var recentlyClosedTabsArray = bgPage.recentlyClosedTabs;
	console.log(recentlyClosedTabsArray);

	var rootDivElement = document.getElementById('rootDiv');
	
	if (recentlyClosedTabsArray.length == 0) {
		rootDivElement.appendChild(document.createTextNode('No recently closed tabs.'));
	} else {
		var size = recentlyClosedTabsArray.length;
		var tabsCount = localStorage.getItem('tabsCount');
		var tableElement = document.createElement('table');
		tableElement.setAttribute('id', 'table');
		var forEnd = 0;
		if (size > tabsCount) {
			forEnd = size - tabsCount;
		}		
		for (var key = size - 1; key >= forEnd; key--) {
			var favicon = recentlyClosedTabsArray[key].favicon;
			var tabShot = recentlyClosedTabsArray[key].tabShot;
			var trElement = document.createElement('tr');
			trElement.setAttribute('id', 'tab' + key);
			var tdTabShotElement = document.createElement('td');
			tdTabShotElement.setAttribute('class', 'tabShotTD');
			var tabShotIMG = document.createElement('img');
			tabShotIMG.setAttribute('id', 'tabShot' + key);
			tabShotIMG.setAttribute('class', 'tabShotIMG');
			tdTabShotElement.appendChild(tabShotIMG);
			trElement.appendChild(tdTabShotElement);
			
			var tdUrlElement = document.createElement('td');
			tdUrlElement.setAttribute('class', 'urlTD');
			var linkElement = document.createElement('a');
			//linkElement.setAttribute('href', 'javascript:chrome.tabs.create({url: \'' + recentlyClosedTabsArray[key].url + '\'});bgPage.deleteRecentlyClosedTabById(\'' + key + '\');');
			linkElement.setAttribute('href', 'javascript:createRecentlyClosedTab(' + key + ');');
			linkElement.setAttribute('title', recentlyClosedTabsArray[key].url);
			var linkText = document.createTextNode(bgPage.getTitel(recentlyClosedTabsArray[key].title));
			linkElement.appendChild(linkText);
			tdUrlElement.appendChild(linkElement);
			trElement.appendChild(tdUrlElement);
			
			var tdFavIconElement = document.createElement('td');
			tdFavIconElement.setAttribute('class', 'faviconTD');
			
			var linkElement = document.createElement('a');
			//linkElement.setAttribute('href', 'javascript:chrome.tabs.create({url: \'' + recentlyClosedTabsArray[key].url + '\'});bgPage.deleteRecentlyClosedTabById(\'' + key + '\');');
			linkElement.setAttribute('href', 'javascript:createRecentlyClosedTab(' + key + ');');
			linkElement.setAttribute('title', recentlyClosedTabsArray[key].url);
			var favIconIMG = document.createElement('img');
			favIconIMG.setAttribute('id', 'favIcon' + key);
			favIconIMG.setAttribute('class', 'faviconIMG');
			if (favicon !== undefined) {
				favIconIMG.setAttribute('src', favicon);
			} else {
				favIconIMG.setAttribute('src', '../images/default_favicon.png');
			}
			linkElement.appendChild(favIconIMG);
			tdFavIconElement.appendChild(linkElement);
			
			trElement.appendChild(tdFavIconElement);
			tableElement.appendChild(trElement);
		}
		rootDivElement.appendChild(tableElement);
		for ( var keyImage = size - 1; keyImage >= forEnd; keyImage--) {
			var tabShotImageData = recentlyClosedTabsArray[keyImage].tabShot;
			if (tabShotImageData !== undefined && tabShotImageData != null) {
				document.getElementById('tabShot' + keyImage).src = tabShotImageData;
			} else {
				document.getElementById('tabShot' + keyImage).src = '../images/default_tabShot.png';
			}
		}
	}
}

//------------------------------------------------------------------------------
//Creates list with recently closed tabs.
function createRecentlyClosedTab(key) {
	chrome.tabs.create({url: bgPage.recentlyClosedTabs[key].url});
	bgPage.deleteRecentlyClosedTabById(key);

	//should remove this table row
	document.getElementById("table").removeChild(document.getElementById('tab'+key));
}