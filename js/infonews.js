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
}

//------------------------------------------------------------------------------
// Creates the header for the infonews page.
//------------------------------------------------------------------------------
function createInfonewsHeader() {
  document.getElementById('topTableDiv').appendChild(bgPage.createHeader());
  var topBorderDiv = document.getElementById('topBorderDiv');
  topBorderDiv.setAttribute('class', 'topBorderDiv');
  topBorderDiv.appendChild(bgPage.createHeaderBorder('Infos'));
}