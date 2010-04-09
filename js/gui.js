// Scripts for the GUI

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Creates the header border for the options and infonews defined by the title.
//------------------------------------------------------------------------------
function createHeader(title) {
	var bgPage = chrome.extension.getBackgroundPage();
	var topTable = $('<table>').addClass('header_table').appendTo($('#headerTableDiv'));
	var trElement = $('<tr>').appendTo(topTable);
	
	var tdImgElement = $('<td>').addClass('header_tdImg').appendTo(trElement);
	var imgElement = $('<img>').addClass('header_img').attr({src: 'images/rct128.png', alt: 'Recently Closed Tabs'}).appendTo(tdImgElement);
	var tdExtensionNameElement = $('<td>').addClass('header_tdExtensionName').text(bgPage.appConfig.name + ' ' + bgPage.appConfig.version).appendTo(trElement);
	var emptyTdElement = $('<td>').appendTo(trElement);
	
	var setHeaderBorderDiv = $('#headerBorderDiv').addClass('headerBorderDiv');
	var h1Element = $('<h1>').text('Extension ' + title).appendTo($('#headerBorderDiv'));
}

//------------------------------------------------------------------------------
// Creates the footer.
//------------------------------------------------------------------------------
function createFooter() {
	var footerDiv = $('#footerDiv').addClass('footerDiv').text('©2010 Michael & Draško');
}

// THE DOUPLICATED CODE LINES OF THE FOLLOWING TWO METHODS SHOULD BE COMPRESSED
//------------------------------------------------------------------------------
// Construct a HTML table row out of tabInfo
//------------------------------------------------------------------------------
function createRctDivForOptions(tabInfo, i) {
	createRctDivElement(tabInfo, i);
	createRctDiv(tabInfo, i);
	createRCTListEditButtons(tabInfo, i);
}

function createRctDivForPopup(tabInfo, i) {
	createRctDivElement(tabInfo, i);
	createRctDiv(tabInfo, i);
}

function createRctDivElement(tabInfo, i) {
	var bgPage = chrome.extension.getBackgroundPage();
	if (tabInfo != null) {
		var tabId = tabInfo.tabId;
		var rctDivElement = $('<div>')
		.addClass('rctDivElement')
		.attr({ id: 'rctDivElement' + tabId })
		.click(function() {bgPage.openRecentlyClosedTab(tabId); removeRecentlyClosedTab(tabInfo, i); return false;})
		.appendTo($('#rootDiv'));
	}
}

function createRCTListEditButtons(tabInfo, i) {
	var bgPage = chrome.extension.getBackgroundPage();
	if (tabInfo != null) {
		var tabId = tabInfo.tabId;
		
		var rctButtonsDivElement = $('<div>')
		.addClass('rctButtonsDivElement')
		.attr({ id: 'rctButtonsDivElement' + tabId })
		.appendTo($('#rctDivElement' + tabId));
		
		//deleteButtonDivElement building
		var deleteButtonDivElement = $('<div>')
			.addClass('deleteButtonDivElement')
			.attr({ id: 'deleteButtonDivElement' + i })
			.appendTo($('#rctDivElement' + tabId));
		var deleteButtonInputElement = $('<input>')
			.attr({
				type: 'button',
				value: 'Delete Entry' })
			.click(function() {deleteRecentlyClosedTab(tabInfo, i);return false;})
			.appendTo(deleteButtonDivElement);
		
		//addToFiltersButtonDivElement building
		var addToFiltersButtonDivElement = $('<div>')
			.addClass('addToFiltersButtonDivElement')
			.attr({id: 'addToFiltersButtonDivElement' + i})
			.appendTo($('#rctDivElement' + tabId));
		var addToFiltersInputElement = $('<input>')
			.attr({
				type: 'button',
				value: 'Add To Filters And Delete' })
			.click(function() {addRecentlyClosedTabToFiltersAndDelete(bgPage.recentlyClosedTabs[i].tabId);return false;})
			.appendTo(addToFiltersButtonDivElement);
	}
}

function createRctDiv(tabInfo, i) {
	if (tabInfo != null) {
		var bgPage = chrome.extension.getBackgroundPage();
		var tabId = tabInfo.tabId;
		
		var rctListDivElement = $('<div>')
		.addClass('rctListDivElement')
		.attr({ id: 'rctDivElement' + tabId })
		.click(function() {bgPage.openRecentlyClosedTab(tabId); removeRecentlyClosedTab(tabInfo, i); return false;})
		.appendTo($('#rctDivElement' + tabId));
		
		// tabShotElement building
		var tabShotDivElement = $('<div>')
			.addClass('tabShotDivElement')
			.attr({ id: 'tabShotDivElement' + tabId })
			.appendTo(rctListDivElement);
		var tabShotIMG = $('<img>')
			.addClass('tabShotIMG')
			.attr({ id: 'tabShotIMG' + tabId })
			.appendTo(tabShotDivElement);
		
		// contentElement building
		var contentDivElement = $('<div>')
			.addClass('contentDivElement')
			.attr({ id: 'contentDivElement' + tabId })
			.appendTo(rctListDivElement);
		var titleDivElement = $('<div>')
			.addClass('titleDivElement')
			.attr({ id: 'titleDivElement' + tabId })
			.text(tabInfo.title)
			.appendTo(contentDivElement);
		var urlDivElement = $('<div>')
			.addClass('linkDivElement')
			.attr({ id: 'linkDivElement' + tabId })
			.text(tabInfo.url)
			.appendTo(contentDivElement);

		// favIconElement building
		var favIconDivElement = $('<div>')
			.addClass('favIconDivElement')
			.attr({ id: 'favIconDivElement' + tabId })
			.appendTo(rctListDivElement);
		var favIconIMG = $('<img>')
			.addClass('faviconIMG')
			.attr({ id: 'faviconIMG' + tabId })
			.appendTo(favIconDivElement);
		
		with (tabInfo) {
			console.log(tabInfo);
			var tabShot = tabInfo.tabShot;
			if (tabShot !== undefined && tabShot != null) {
				tabShotIMG.attr({ src: tabShot });
			} else {
				tabShotIMG.attr({ src: '../images/default_tabShot.png' });
			}
			var favIconUrl = tabInfo.favIconUrl;
			if (favIconUrl !== undefined && favIconUrl != null) {
				favIconIMG.attr({ src: favIconUrl });
			} else {
				favIconIMG.attr({ src: '../images/default_favicon.png' });
			}
		}
	}
}