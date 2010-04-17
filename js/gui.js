// Scripts for the GUI

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();

// Creates the header for the options and infonews defined by the title.
function createHeader(title) {
	var topTable = $('<table>').addClass('header_table').appendTo($('#headerTableDiv'));
	var trElement = $('<tr>').appendTo(topTable);
	
	var tdImgElement = $('<td>').addClass('header_tdImg').appendTo(trElement);
	var imgElement = $('<img>').addClass('header_img').attr({src: 'images/rct128.png', alt: 'Recently Closed Tabs'}).appendTo(tdImgElement);
	var tdExtensionNameElement = $('<td>').addClass('header_tdExtensionName').text(bgPage.appConfig.name + ' ' + bgPage.appConfig.version).appendTo(trElement);
	var emptyTdElement = $('<td>').appendTo(trElement);
	
	var setHeaderBorderDiv = $('#headerBorderDiv').addClass('headerBorderDiv');
	var h1Element = $('<h1>').text('Extension ' + title).appendTo($('#headerBorderDiv'));
}

// Creates the footer.
function createFooter() {
	var footerDiv = $('#footerDiv').addClass('footerDiv').text('©2010 Michael & Draško');
}

// Creates the rct list element for the options page with the buttons to edit the list.
function createRctDivForOptions(timestamp) {
	createRctDivElement(timestamp);
	createRctDiv(timestamp, true);
	createRecentlyClosedTabsListEditButtons(timestamp);
}

// Creates the rct list element for the popup page.
function createRctDivForPopup(timestamp) {
	createRctDivElement(timestamp, false);
	createRctDiv(timestamp);
}

// Creates the header of the rct list.
function createRecentlyClosedTabsListHeader() {
var h3Element = $('<h3>')
 .text('Recently closed tabs:')
 .appendTo($('#rootDiv'));
}

// Creates the recentlyClosedTabs div element that later contains all recently closed tabs.
function createRctDivElement(timestamp) {
	if (bgPage.recentlyClosedTabs[timestamp] !== undefined) {
		var rctDivElement = $('<div>')
  		.addClass('rctDivElement')
  		.attr({ id: 'rctDivElement' + timestamp })
  		.click(function() {
  		  bgPage.openRecentlyClosedTab(timestamp);
  		  removeRecentlyClosedTabFromList(timestamp);
  		  return false; })
  		.appendTo($('#rootDiv'));
	}
}

// Creates the edit buttons for the options page.
function createRecentlyClosedTabsListEditButtons(timestamp) {
	if (bgPage.recentlyClosedTabs[timestamp] != null) {
		
		var rctButtonsDivElement = $('<div>')
  		.addClass('rctButtonsDivElement')
  		.attr({ id: 'rctButtonsDivElement' + timestamp })
  		.appendTo($('#rctDivElement' + timestamp));
		
		//deleteButtonDivElement building
		var deleteButtonDivElement = $('<div>')
			.addClass('deleteButtonDivElement')
			.attr({ id: 'deleteButtonDivElement' + timestamp })
			.appendTo($('#rctDivElement' + timestamp));
		var deleteButtonInputElement = $('<input>')
			.attr({
			  id: 'deleteButtonInputElement' + timestamp,
				type: 'button',
				value: 'Delete' })
			.click(function() {
			  removeRecentlyClosedTabFromList(timestamp);
			  return false; })
			.appendTo(deleteButtonDivElement);
		
		//addToFiltersButtonDivElement building
		var addToFiltersButtonDivElement = $('<div>')
			.addClass('addToFiltersButtonDivElement')
			.attr({ id: 'addToFiltersButtonDivElement' + timestamp })
			.appendTo($('#rctDivElement' + timestamp));
		var addToFiltersInputElement = $('<input>')
			.attr({
			  id: 'addToFiltersInputElement' + timestamp,
				type: 'button',
				value: 'Add Filter And Delete' })
			.click(function() {
			  removeRecentlyClosedTabFromList(timestamp);
			  addRecentlyClosedTabToFiltersList(timestamp);
			  return false; })
			.appendTo(addToFiltersButtonDivElement);
	}
}

// Creates the div element of one recently closed tab.
// @param timestamp id of the recentlyClosedTabs
// @param isOptions boolean value: true if thr rctDiv is for the options page, false if for popup page
function createRctDiv(timestamp, isOptions) {
	if (bgPage.recentlyClosedTabs[timestamp] != null) {
		var rctListDivElement = $('<div>')
  		.addClass('rctListDivElement')
  		.attr({ id: 'rctListDivElement' + timestamp })
  		.click(function(timestamp) {
  		  bgPage.openRecentlyClosedTab(timestamp);
  		  removeRecentlyClosedTabFromList(timestamp);
  		  return false; })
  		.appendTo($('#rctDivElement' + timestamp));
		
		if (isOptions) {
  		var dateDivElement = $('<div>')
        .addClass('dateDivElement')
        .attr({ id: 'dateDivElement' + timestamp })
        .text(timestamp)
        .appendTo(rctListDivElement);
    }
		
		// tabShotElement building
		var tabShotDivElement = $('<div>')
			.addClass('tabShotDivElement')
			.attr({ id: 'tabShotDivElement' + timestamp })
			.appendTo(rctListDivElement);
		var tabShotIMG = $('<img>')
			.addClass('tabShotIMG')
			.attr({ id: 'tabShotIMG' + timestamp })
			.appendTo(tabShotDivElement);
		
		// contentElement building
		var contentDivElement = $('<div>')
			.addClass('contentDivElement')
			.attr({ id: 'contentDivElement' + timestamp })
			.appendTo(rctListDivElement);
		var titleDivElement = $('<div>')
			.addClass('titleDivElement')
			.attr({ id: 'titleDivElement' + timestamp })
			.text(bgPage.recentlyClosedTabs[timestamp].title)
			.appendTo(contentDivElement);
		var urlDivElement = $('<div>')
			.addClass('linkDivElement')
			.attr({ id: 'linkDivElement' + timestamp })
			.text(bgPage.recentlyClosedTabs[timestamp].url)
			.appendTo(contentDivElement);

		// favIconElement building
		var favIconDivElement = $('<div>')
			.addClass('favIconDivElement')
			.attr({ id: 'favIconDivElement' + timestamp })
			.appendTo(rctListDivElement);
		var favIconIMG = $('<img>')
			.addClass('faviconIMG')
			.attr({ id: 'faviconIMG' + timestamp })
			.appendTo(favIconDivElement);
		
		with (bgPage.recentlyClosedTabs[timestamp]) {
			var tabShot = bgPage.recentlyClosedTabs[timestamp].tabShot;
			if (tabShot !== undefined && tabShot != null) {
				tabShotIMG.attr({ src: tabShot });
			} else {
				tabShotIMG.attr({ src: '../images/default_tabShot.png' });
			}
			var favIconUrl = bgPage.recentlyClosedTabs[timestamp].favIconUrl;
			if (favIconUrl !== undefined && favIconUrl != null) {
				favIconIMG.attr({ src: favIconUrl });
			} else {
				favIconIMG.attr({ src: '../images/default_favicon.png' });
			}
		}
	}
}

// Creates the select and button elements to configure the maxPopupLength.
function createMaxPopupLengthSelect() {
	var h3Element = $('<h3>')
		.text('Favorite number of elements shown in the popup:')
		.appendTo($('#maxPopupLengthSelect'));
	var selectElementOptions = {
		'1': '1',
		'2': '2',
		'5': '5',
		'10': '10',
		'15': '15'
	}
	var selectElement = $('<select>')
		.attr({ id: 'tabsCount' })
    .addOption(selectElementOptions, true)
    .selectOptions('1', true)
    .appendTo($('#maxPopupLengthSelect'));
	var saveSelectButtonElement = $('<button>')
    .text('Save')
    .click(function() {saveMaxPopupLength();return false;})
    .appendTo($('#maxPopupLengthSelect'));
}

// Appends a 'no rcts'-String to the rootDivElement.
function showRecentlyClosedTabsIsEmpty() {
  var rootDiv = $('#rootDiv').text('No recently closed tabs.');
}

//Creates the header of the filters list.
function createFiltersListHeader() {
  var filterListDivElement = $('#filterListDivElement').addClass('filterListDivElement');
  var h3Element = $('<h3>')
    .text('Active URL filters:')
    .appendTo($('#filterListDivElement'));
}

// Creates the filters list.
function createFiltersList() {
    if (bgPage.filters.length == 0) {
      var noFiltersDivElement = $('<span>')
        .text('No filters.')
        .attr({ id: 'noFiltersDivElement' })
        .appendTo($('#filterListDivElement'));
    } else {
      if ($('#noFiltersDivElement') != null) $('#noFiltersDivElement').remove();
      for (var timestamp = 0; timestamp < bgPage.filters.length; timestamp++) {
        var filterListElementDivElement = $('<div>')
          .addClass('filterListElementDivElement')
          .attr({ id: 'filterListElementDivElement' + timestamp })
          .appendTo($('#filterListDivElement'));
        
        var filterDivElement = $('<div>')
          .addClass('filterDivElement')
          .attr({ id: 'filterElementDiv' + timestamp })
          .text(bgPage.filters[timestamp].url)
          .appendTo(filterListElementDivElement);
        
        // filterDeleteButton building
        var filterDeleteButtonDivElement = $('<div>')
          .addClass('filterDeleteButtonDivElement')
          .attr({ id: 'filterDeleteButtonDivElement' + timestamp })
          .appendTo(filterListElementDivElement);
        var filterDeleteButtonElement = $('<input>')
          .attr({ 
            id: 'filterDeleteButtonElement' + timestamp,
            type: 'button',
            value: 'Delete'})
          .click(function(m) {
            deleteFilterFromList(timestamp);
            return false; })
          .appendTo(filterDeleteButtonDivElement);
    }
  }
}
