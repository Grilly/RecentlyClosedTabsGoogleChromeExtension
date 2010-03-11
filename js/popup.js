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

	if (recentlyClosedTabsArray.length == 0) {
		document.write("No recently closed tabs.");
	} else {
		var size = recentlyClosedTabsArray.length;
		document.write('<table>');
		for ( var key = size - 1; key >= 0; key--) {
			// document.write(key + ': ');
			var favicon = recentlyClosedTabsArray[key].favicon;
			var tabShot = recentlyClosedTabsArray[key].tabShot;
			document.write('<tr><td id=\"tabShotTD\">');
			if (tabShot !== undefined) {
				document.write('<img src=\"' + recentlyClosedTabsArray[key].tabShot + '\" id=\"tabShotIMG\">');
			}
			document.write('</td><td id=\"urlTD\">');
			document.write('<a href=\"');
			document.write('javascript:chrome.tabs.create({url: \'' + recentlyClosedTabsArray[key].url + '\'});');
			document.write('bgPage.deleteRecentlyClosedTabById(\'' + key + '\');');
			document.write('\" title=\"' + recentlyClosedTabsArray[key].title + '\">' + bgPage.getTitel(recentlyClosedTabsArray[key].title));
			document.write('</a>');
			document.write('</td><td id=\"faviconTD\">');
			if (favicon !== undefined) {
				document.write('<a href=\"javascript:chrome.tabs.create({url: \''
								+ recentlyClosedTabsArray[key].url
								+ '\'});bgPage.deleteRecentlyClosedTabById(\''
								+ key
								+ '\');\" title=\"'
								+ recentlyClosedTabsArray[key].title + '\">');
				document.write('<img src=\"' + favicon + '\" id=\"faviconIMG\"></a>');
			}
			document.write('</td></tr>');
		}
		document.write('</table>');
	}
}