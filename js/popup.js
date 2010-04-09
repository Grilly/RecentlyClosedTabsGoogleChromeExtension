// Scripts for the popup.html

// ------------------------------------------------------------------------------
// Main method: Everything starts here!
// ------------------------------------------------------------------------------
function main() {
	var bgPage = chrome.extension.getBackgroundPage();
	var recentlyClosedTabsArray = bgPage.recentlyClosedTabs;
	//console.log(recentlyClosedTabsArray);

	if (recentlyClosedTabsArray.length == 0) {
		var rootDiv = $('#rootDiv').text('No recently closed tabs.');
	} else {
		for (var i = 0; i < recentlyClosedTabsArray.length && i < bgPage.fetchMaxPopupTableLength(); i++) {
			this.createRctDivForPopup(recentlyClosedTabsArray[i], i);
		}
	}
}

//------------------------------------------------------------------------------
// Removes selected RecentlyClosedTab row
//------------------------------------------------------------------------------
function removeRecentlyClosedTab(tabId) {
	//should remove this table row
	// TODO: how to find the parent node without assuming that its id is 'table'
	$('#' + tabId).remove();
}
