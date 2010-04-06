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