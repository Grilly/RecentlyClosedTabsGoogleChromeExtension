// Scripts for the popup.html

//------------------------------------------------------------------------------
// Global variables.
var bgPage = chrome.extension.getBackgroundPage();

// ------------------------------------------------------------------------------
// Mainmethod: Everything starts here!
function main() {
	getListOfRecentlyClosedTabs();
}

// ------------------------------------------------------------------------------
// Creates list with recently closed tabs.
function getListOfRecentlyClosedTabs() {
	var recentlyClosedTabsArray = bgPage.recentlyClosedTabs;
	console.log(recentlyClosedTabsArray);

	var rootDivElement = document.getElementById('rootDiv');
	
	if (recentlyClosedTabsArray.length == 0) {
		rootDivElement.appendChild(document.createTextNode('No recently closed tabs.'));
	} else {
		var size = recentlyClosedTabsArray.length;
		var tableElement = document.createElement('table');
		for ( var key = size - 1; key >= 0; key--) {
			var favicon = recentlyClosedTabsArray[key].favicon;
			var tabShot = recentlyClosedTabsArray[key].tabShot;
			var trElement = document.createElement('tr');
			var tdTabShotElement = document.createElement('td');
			tdTabShotElement.setAttribute('class', 'tabShotTD');
			if (tabShot !== undefined) {
				var tabShotIMG = document.createElement('img');
				tabShotIMG.setAttribute('id', 'tabShot' + key);
				tabShotIMG.setAttribute('class', 'tabShotIMG');
				tdTabShotElement.appendChild(tabShotIMG);
			}
			trElement.appendChild(tdTabShotElement);
			
			var tdUrlElement = document.createElement('td');
			tdUrlElement.setAttribute('class', 'urlTD');
			var linkElement = document.createElement('a');
			linkElement.setAttribute('href', 'javascript:chrome.tabs.create({url: \'' + recentlyClosedTabsArray[key].url + '\'});bgPage.deleteRecentlyClosedTabById(\'' + key + '\');');
			linkElement.setAttribute('title', recentlyClosedTabsArray[key].url);
			var linkText = document.createTextNode(bgPage.getTitel(recentlyClosedTabsArray[key].title));
			linkElement.appendChild(linkText);
			tdUrlElement.appendChild(linkElement);
			trElement.appendChild(tdUrlElement);
			
			var tdFavIconElement = document.createElement('td');
			tdFavIconElement.setAttribute('class', 'faviconTD');
			
			if (favicon !== undefined) {
				var linkElement = document.createElement('a');
				linkElement.setAttribute('href', 'javascript:chrome.tabs.create({url: \'' + recentlyClosedTabsArray[key].url + '\'});bgPage.deleteRecentlyClosedTabById(\'' + key + '\');');
				linkElement.setAttribute('title', recentlyClosedTabsArray[key].url);
				var favIconIMG = document.createElement('img');
				favIconIMG.setAttribute('id', 'tabShot' + key);
				favIconIMG.setAttribute('class', 'faviconIMG');
				favIconIMG.setAttribute('src', favicon);
				linkElement.appendChild(favIconIMG);
				tdFavIconElement.appendChild(linkElement);
			}
			trElement.appendChild(tdFavIconElement);
			tableElement.appendChild(trElement);
			
		}
		rootDivElement.appendChild(tableElement);
		for ( var key = size - 1; key >= 0; key--) {
			if (tabShot !== undefined) {
				document.getElementById('tabShot'+key).src = recentlyClosedTabsArray[key].tabShot;
			}
		}
	}
}