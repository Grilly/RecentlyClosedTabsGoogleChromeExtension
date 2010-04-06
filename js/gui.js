// Scripts for the GUI

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();

//------------------------------------------------------------------------------
// Creates the header border for the options and infonews defined by the title.
//------------------------------------------------------------------------------
function createHeader(title) {
	var topTable = $('<table>').addClass('header_table').appendTo($('#headerTableDiv'));
	var trElement = $('<tr>').appendTo(topTable);
	
	var tdImgElement = $('<td>').addClass('header_tdImg').appendTo(trElement);
	$('<img>').addClass('header_img').attr({src: 'images/rct128.png', alt: 'Recently Closed Tabs'}).appendTo(tdImgElement);
	$('<td>').addClass('header_tdExtensionName').text(bgPage.appConfig.name + ' ' + bgPage.appConfig.version).appendTo(trElement);
	$('<td>').appendTo(trElement);
	
	$('#headerBorderDiv').addClass('headerBorderDiv');
	$('<h1>').text('Extension ' + title).appendTo($('#headerBorderDiv'));
}

//------------------------------------------------------------------------------
// Creates the footer.
//------------------------------------------------------------------------------
function createFooter() {
	$('#footerDiv').addClass('footerDiv').text('&copy; 2010 Michael &amp; Drasko');
}

// THE DOUPLICATED CODE LINES OF THE FOLLOWING TWO METHODS SHOULD BE COMPRESSED
//------------------------------------------------------------------------------
// Construct a HTML table row out of tabInfo
//------------------------------------------------------------------------------
function createTableRowWithButtons(tabInfo, i) {
	var trElement = $('<tr>').appendTo($('#rctTable'));
	if (tabInfo != null) {	
		var tdTabShotElement = $('<td>')
			.addClass('tabShotTD')
			.appendTo(trElement);
		var tabShotIMG = $('<img>')
			.addClass('tabShotIMG')
			.appendTo(tdTabShotElement);
		
		var tdUrlElement = $('<td>')
			.addClass('urlTD')
			.appendTo(trElement);
		var divUrlElement = $('<div>')
			.addClass('urlTdDiv')
			.appendTo(tdUrlElement);
		var textLinkElement = $('<a>')
			.text(tabInfo.title)
			.appendTo(divUrlElement);
		
		
		var tdFavIconElement = $('<td>')
			.addClass('faviconTD')
			.appendTo(trElement);
		var iconLinkElement = $('<a>').appendTo(tdFavIconElement);
		var favIconIMG = $('<img>')
			.addClass('faviconIMG')
			.appendTo(iconLinkElement);
		
		with (tabInfo) {
			 trElement.attr({id: tabId});
			 tabShotIMG.attr({id: 'tabShot' + tabId});
			 if (tabShot !== undefined && tabShot != null) {
				 tabShotIMG.attr({src: tabShot});
			 } else {
				 tabShotIMG.attr({src: '../images/default_tabShot.png'});
			 }
			 textLinkElement.attr({
				 href: 'javascript:bgPage.openRecentlyClosedTab(' + tabId + '); removeRecentlyClosedTab(' + tabId + ');',
				 title: url});
			 iconLinkElement.attr({
				 href: 'javascript:bgPage.openRecentlyClosedTab(' + tabId + '); removeRecentlyClosedTab(' + tabId + ');',
				 title: url});
			 if (tabInfo.faviconUrl !== undefined) {
				 favIconIMG.attr({src: faviconUrl});
			 } else {
				 favIconIMG.attr({src: '../images/default_favicon.png'});
			 }
		}
		
		//deleteButtonElement building
		var deleteButtonDivElement = $('<td>')
			.addClass('deleteButtonDivElement')
			.attr({id: 'deleteButtonDivElement' + i})
			.appendTo(trElement);
		$('<input>')
			.attr({
				type: 'button',
				value: 'Delete Entry' })
			.click(function() {deleteRecentlyClosedTab(bgPage.recentlyClosedTabs[i].tabId);return false;})
			.appendTo(deleteButtonDivElement);
		
		//addToFiltersButtonElement building
		var addToFiltersButtonElement = $('<td>')
			.addClass('addToFiltersButtonElement')
			.attr({id: 'addToFiltersButtonElement' + i})
			.appendTo(trElement);
		$('<input>')
			.attr({
				type: 'button',
				value: 'Add To Filters And Delete' })
			.click(function() {addRecentlyClosedTabToFiltersAndDelete(bgPage.recentlyClosedTabs[i].tabId);return false;})
			.appendTo(addToFiltersButtonElement);
	}
}

function createTableRow(tabInfo, i) {
	var trElement = $('<tr>').appendTo($('#rctTable'));
	if (tabInfo != null) {	
		var tdTabShotElement = $('<td>')
			.addClass('tabShotTD')
			.appendTo(trElement);
		var tabShotIMG = $('<img>')
			.addClass('tabShotIMG')
			.appendTo(tdTabShotElement);
		
		var tdUrlElement = $('<td>')
			.addClass('urlTD')
			.appendTo(trElement);
		var divUrlElement = $('<div>')
			.addClass('urlTdDiv')
			.appendTo(tdUrlElement);
		var textLinkElement = $('<a>')
			.text(tabInfo.title)
			.appendTo(divUrlElement);
		
		
		var tdFavIconElement = $('<td>')
			.addClass('faviconTD')
			.appendTo(trElement);
		var iconLinkElement = $('<a>').appendTo(tdFavIconElement);
		var favIconIMG = $('<img>')
			.addClass('faviconIMG')
			.appendTo(iconLinkElement);
		
		with (tabInfo) {
			 trElement.attr({id: tabId});
			 tabShotIMG.attr({id: 'tabShot' + tabId});
			 if (tabShot !== undefined && tabShot != null) {
				 tabShotIMG.attr({src: tabShot});
			 } else {
				 tabShotIMG.attr({src: '../images/default_tabShot.png'});
			 }
			 textLinkElement.attr({
				 href: 'javascript:bgPage.openRecentlyClosedTab(' + tabId + '); removeRecentlyClosedTab(' + tabId + ');',
				 title: url});
			 iconLinkElement.attr({
				 href: 'javascript:bgPage.openRecentlyClosedTab(' + tabId + '); removeRecentlyClosedTab(' + tabId + ');',
				 title: url});
			 if (tabInfo.faviconUrl !== undefined) {
				 favIconIMG.attr({src: faviconUrl});
			 } else {
				 favIconIMG.attr({src: '../images/default_favicon.png'});
			 }
		}
	}
}