// Scripts for the infonews.html

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();

//------------------------------------------------------------------------------
// Everything starts here
//------------------------------------------------------------------------------
function main() {
  this.createInfonewsHeader();
  this.createInfonewsFooter();
}

//------------------------------------------------------------------------------
// Creates the header for the infonews page.
//------------------------------------------------------------------------------
function createInfonewsHeader() {
  document.getElementById('headerTableDiv').appendChild(bgPage.createHeader());
  var topBorderDiv = document.getElementById('headerBorderDiv');
  topBorderDiv.setAttribute('class', 'headerBorderDiv');
  topBorderDiv.appendChild(bgPage.createHeaderBorder('Infos'));
}

//------------------------------------------------------------------------------
//Creates the footer for the infonews page.
//------------------------------------------------------------------------------
function createInfonewsFooter() {
	var footerDiv = document.getElementById('footerDiv');
	footerDiv.innerHTML = bgPage.getFooterInfo();
	footerDiv.setAttribute('class', 'footerDiv');
}