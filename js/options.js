// Scripts for the options.html

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();
//var rootDivElement;

//------------------------------------------------------------------------------
// Everything starts here
//------------------------------------------------------------------------------
function main() {
  //rootDivElement = document.getElementById('rootDiv');
  document.getElementById('extName').innerHTML = bgPage.appConfig.name + " " + bgPage.appConfig.version;
  showMaxPopupTableLength();
  createListOfFilters();
  createListOfRecentlyClosedTabs();
}

//------------------------------------------------------------------------------
// Saves options to localStorage.
//------------------------------------------------------------------------------
function saveMaxPopupTableLength() {
  var select_tabsCount = document.getElementById("tabsCount");
  bgPage.storeMaxPopupTableLength(select_tabsCount.children[select_tabsCount.selectedIndex].value);
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() { status.innerHTML = ""; }, 750);
}

//------------------------------------------------------------------------------
// Restores select box state to saved value from localStorage.
//------------------------------------------------------------------------------
function showMaxPopupTableLength() {
  var select = document.getElementById("tabsCount");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == bgPage.maxPopupTableLength) {
      child.selected = "true";
      break;
    }
  }
}


//------------------------------------------------------------------------------
//Creates list of filters.
//------------------------------------------------------------------------------
function createListOfFilters() {

    var size = bgPage.urlFilterArray.length;
    
    var filterDivElement = document.getElementById('filterDiv');
    var heading = document.createElement('h3');
    heading.appendChild(document.createTextNode('Active URL filters:'));
    filterDivElement.appendChild(heading);
    var tableElement = document.createElement('table');
    tableElement.setAttribute('id', 'filterTable');
    for (var i = 0; i < size; i++) {
        addFilterRowToListTable(bgPage.urlFilterArray[i], tableElement);
    }
    filterDivElement.appendChild(tableElement);
}


//------------------------------------------------------------------------------
//Creates list of recently closed tabs.
//------------------------------------------------------------------------------
function addFilterRowToListTable(urlString, tableElement) {
    var trElement = document.createElement('tr');
    var tdElement = document.createElement('td');
    var text = document.createTextNode(urlString);
    tdElement.appendChild(text);
    trElement.appendChild(tdElement);
    tableElement.appendChild(trElement);
}


//------------------------------------------------------------------------------
//Creates list of recently closed tabs.
//------------------------------------------------------------------------------
function createListOfRecentlyClosedTabs() {
  var recentlyClosedTabsArray = bgPage.recentlyClosedTabs;
  console.log(recentlyClosedTabsArray);

  var rootDivElement = document.getElementById('rootDiv');

  if (recentlyClosedTabsArray.length == 0) {
	  showNoRCTs();
  } else {
    var tableElement = document.createElement('table');
    tableElement.setAttribute('id', 'table');
    rootDivElement.appendChild(tableElement);
    for (var i = 0; i < recentlyClosedTabsArray.length; i++) {
      var trElement = bgPage.createTableRow(recentlyClosedTabsArray[i]);

      //deleteButtonElement building
      var deleteButtonDivElement = document.createElement('td');
      deleteButtonDivElement.setAttribute('id', 'deleteButtonDivElement' + i);
      deleteButtonDivElement.setAttribute('class', 'deleteButtonDivElement');
      var deleteButtonInput = document.createElement('input');
      deleteButtonInput.setAttribute('type', 'button');
      deleteButtonInput.setAttribute('onclick', 'javascript:deleteRecentlyClosedTab(' + bgPage.recentlyClosedTabs[i].tabId + ');');
      deleteButtonInput.setAttribute('value', 'Delete Element');
      deleteButtonDivElement.appendChild(deleteButtonInput);

      trElement.appendChild(deleteButtonDivElement);
      tableElement.appendChild(trElement);
    }
  }
}

//------------------------------------------------------------------------------
// Removes selected RecentlyClosedTab row
//------------------------------------------------------------------------------
function removeRecentlyClosedTab(tabId) {
  //should remove this table row
  // TODO: how to find the parent node without assuming that its id is 'table'
  document.getElementById('table').removeChild(document.getElementById(tabId));
}

//------------------------------------------------------------------------------
// Deletes element from the list of recently closed tabs.
//------------------------------------------------------------------------------
function deleteRecentlyClosedTab(tabId) {
  var url = bgPage.getClosedTabById(tabId).url;
  var urlPattern = prompt("Ignore this URL in future?", url);
  console.log(urlPattern);
  if (urlPattern != null) {
    bgPage.urlFilterArray[bgPage.urlFilterArray.length] = urlPattern;
    addFilterRowToListTable(urlPattern, document.getElementById('filterTable'));
  }

  //should remove this table row
  removeRecentlyClosedTab(tabId);
  //show 'no rcts'-String
  if (bgPage.recentlyClosedTabs.length == 0) {
	showNoRCTs();
  }

  bgPage.removeClosedTabWithThisUrl(url);
}

//------------------------------------------------------------------------------
// Appends a 'no rcts'-String to the rootDivElement.
//------------------------------------------------------------------------------
function showNoRCTs() {
  rootDivElement.appendChild(document.createTextNode('No recently closed tabs.'));
}


//------------------------------------------------------------------------------
// SHOULD BE REMOVED !!!
//------------------------------------------------------------------------------
//Creates list of recently closed tabs.
//------------------------------------------------------------------------------
function getListOfRecentlyClosedTabsComplete() {
	var recentlyClosedTabsArray = bgPage.recentlyClosedTabs;
	console.log(recentlyClosedTabsArray);

	if (recentlyClosedTabsArray.length == 0) {
		showNoRCTs();
	} else {
		var size = recentlyClosedTabsArray.length;
		
		for (var key = size - 1; key >= 0; key--) {
            if (recentlyClosedTabsArray[key] != null) {
            
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
		titleDivElement.innerHTML = recentlyClosedTabsArray[key].title;
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
		}
		if (recentlyClosedTabsArray[key] != null) {
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
}

//------------------------------------------------------------------------------
//Creates recently closed tab.
//------------------------------------------------------------------------------
function createRecentlyClosedTab(key) {
	chrome.tabs.create({url: bgPage.recentlyClosedTabs[key].url});
	deleteRecentlyClosedTab(key);
}
