// Scripts for the options.html

//------------------------------------------------------------------------------
// Global variables.
var bgPage = chrome.extension.getBackgroundPage();


function main() {
    restore_options();
    createListOfFilters();
    getListOfRecentlyClosedTabsComplete();
}


//------------------------------------------------------------------------------
// Saves options to localStorage.
function save_options() {
  var select_tabsCount = document.getElementById("tabsCount");
  var tabsCount = select_tabsCount.children[select_tabsCount.selectedIndex].value;
  localStorage.setItem('tabsCount', tabsCount);
  
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() { status.innerHTML = ""; }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var tabsCount = localStorage["tabsCount"];
  if (!tabsCount) {
	tabsCount = 15;
	localStorage.setItem('tabsCount', tabsCount);
  }
  var select = document.getElementById("tabsCount");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == tabsCount) {
      child.selected = "true";
      break;
    }
  }
}


//------------------------------------------------------------------------------
//Creates list of filters.
function createListOfFilters() {

    var size = bgPage.urlFilterArray.length;
    
	var filterDivElement = document.getElementById('filterDiv');
	var heading = document.createElement('h3');
	heading.appendChild(document.createTextNode('Active URL filters:'));
	filterDivElement.appendChild(heading);
	var tableElement = document.createElement('table');
	tableElement.setAttribute('id', 'filterTable');
    for (var i = 0; i < size; i++) {
        var trElement = document.createElement('tr');
        var tdElement = document.createElement('td');
        var text = document.createTextNode(bgPage.urlFilterArray[i]);
        tdElement.appendChild(text);
        trElement.appendChild(tdElement);
        tableElement.appendChild(trElement);
    }
    filterDivElement.appendChild(tableElement);
}


//------------------------------------------------------------------------------
//Creates list with recently closed tabs.
function getListOfRecentlyClosedTabsComplete() {
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
		for (var key = size - 1; key >= 0; key--) {
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
			
			var tdDeleteElement = document.createElement('td');
			tdDeleteElement.setAttribute('class', 'tdDelete');
			
			var input = document.createElement('input');
			input.setAttribute('type', 'button');
			input.setAttribute('onclick', 'javascript:deleteRecentlyClosedTab(' + key + ');');
			input.setAttribute('value', 'Delete Element');
			
			tdDeleteElement.appendChild(input);
			
			trElement.appendChild(tdDeleteElement);
			
			tableElement.appendChild(trElement);
		}
		rootDivElement.appendChild(tableElement);
		for ( var keyImage = size - 1; keyImage >= 0; keyImage--) {
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
//Creates recently closed tab.
function createRecentlyClosedTab(key) {
	chrome.tabs.create({url: bgPage.recentlyClosedTabs[key].url});
	deleteRecentlyClosedTab(key);
}

//------------------------------------------------------------------------------
//Deletes element from the list of recently closed tabs.
function deleteRecentlyClosedTab(key) {
	bgPage.deleteRecentlyClosedTabById(key);

	//should remove this table row
	document.getElementById("table").removeChild(document.getElementById('tab'+key));
}