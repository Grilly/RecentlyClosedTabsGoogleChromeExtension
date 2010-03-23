// Scripts for the options.html

//------------------------------------------------------------------------------
// Global variables.
var bgPage = chrome.extension.getBackgroundPage();
var rootDivElement = null;

//------------------------------------------------------------------------------
// Everything starts here
function main() {
	this.rootDivElement = document.getElementById('rootDiv');
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

//------------------------------------------------------------------------------
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

	if (recentlyClosedTabsArray.length == 0) {
		showNoRCTs();
	} else {
		var size = recentlyClosedTabsArray.length;
		var tabsCount = localStorage.getItem('tabsCount');
		
		for (var key = size - 1; key >= 0; key--) {
			var favicon = recentlyClosedTabsArray[key].favicon;
			
			//previewElement building
			var tabShotDivElement = document.createElement('div');
			tabShotDivElement.setAttribute('id', 'tabShotDivElement' + key);
			tabShotDivElement.setAttribute('class', 'tabShotDivElement');
			var tabShotIMG = document.createElement('img');
			tabShotIMG.setAttribute('id', 'tabShot' + key);
			tabShotIMG.setAttribute('class', 'tabShotIMG');
			tabShotDivElement.appendChild(tabShotIMG);
	
			var linkElement = document.createElement('a');
			linkElement.setAttribute('class', 'linkElement');
			linkElement.setAttribute('href', 'javascript:createRecentlyClosedTab(' + key + ')');
			linkElement.setAttribute('name', recentlyClosedTabsArray[key].url);
			var linkElementText = document.createTextNode(recentlyClosedTabsArray[key].url);
			linkElement.appendChild(linkElementText);
			
			//contentElement building
			var contentDivElement = document.createElement('div');
			contentDivElement.setAttribute('id', 'contentDivElement' + key);
			contentDivElement.setAttribute('class', 'contentDivElement');
	
				//titleElement building
				var titleDivElement = document.createElement('div');
				titleDivElement.setAttribute('id', 'titleDivElement' + key);
				titleDivElement.setAttribute('class', 'titleDivElement');
				titleDivElement.innerHTML = bgPage.getTitel(recentlyClosedTabsArray[key].title);
				contentDivElement.appendChild(titleDivElement);
	
				//linkElement building
				var linkDivElement = document.createElement('div');
				linkDivElement.setAttribute('id', 'linkDivElement' + key);
				linkDivElement.setAttribute('class', 'linkDivElement');
				linkDivElement.appendChild(linkElement);
				contentDivElement.appendChild(linkDivElement);
	
			//faviconElement building
			var favIconDivElement = document.createElement('div');
			favIconDivElement.setAttribute('id', 'favIconDivElement' + key);
			favIconDivElement.setAttribute('class', 'favIconDivElement');
			var favIconIMG = document.createElement('img');
			favIconIMG.setAttribute('id', 'favIcon' + key);
			favIconIMG.setAttribute('class', 'faviconIMG');
			if (favicon !== undefined) {
				favIconIMG.setAttribute('src', favicon);
			} else {
				favIconIMG.setAttribute('src', '../images/default_favicon.png');
			}
			favIconDivElement.appendChild(favIconIMG);
			
			//deleteButtonElement building
			var deleteButtonDivElement = document.createElement('div');
			deleteButtonDivElement.setAttribute('id', 'deleteButtonDivElement' + key);
			deleteButtonDivElement.setAttribute('class', 'deleteButtonDivElement');
			var deleteButtonInput = document.createElement('input');
			deleteButtonInput.setAttribute('type', 'button');
			deleteButtonInput.setAttribute('onclick', 'javascript:deleteRecentlyClosedTab(' + key + ');');
			deleteButtonInput.setAttribute('value', 'Delete Element');
			deleteButtonDivElement.appendChild(deleteButtonInput);
	
			//rctElement building
			var rctDivElement = document.createElement('div');
			rctDivElement.setAttribute('id', 'rctElement' + key);
			rctDivElement.setAttribute('class', 'rctDivElement');
			rctDivElement.appendChild(tabShotDivElement);
			rctDivElement.appendChild(contentDivElement);
			rctDivElement.appendChild(favIconDivElement);
			rctDivElement.appendChild(deleteButtonDivElement);
	
			this.rootDivElement.appendChild(rctDivElement);
		}
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
	document.getElementById('rootDiv').removeChild(document.getElementById('rctElement' + key));
	//show 'no rcts'-String
	if (bgPage.recentlyClosedTabs.length == 0) {
		showNoRCTs();
	}
}

//------------------------------------------------------------------------------
// Appends a 'no rcts'-String to the rootDivElement.
function showNoRCTs() {
	rootDivElement.appendChild(document.createTextNode('No recently closed tabs.'));
}
