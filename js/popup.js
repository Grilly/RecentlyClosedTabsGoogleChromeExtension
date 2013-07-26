//
// Scripts for the popup.html
//

//------------------------------------------------------------------------------
// Since Manifest v2 does not allow inline scripts and event handlers ...
//------------------------------------------------------------------------------
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3928511-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

window.addEventListener("load", main);

//------------------------------------------------------------------------------
// Global variables.
//------------------------------------------------------------------------------
var bgPage = chrome.extension.getBackgroundPage();

// ------------------------------------------------------------------------------
// Main method: Everything starts here!
// ------------------------------------------------------------------------------
function main() {
  var rootDiv = $('#rootDiv').addClass('rootDiv');
  var popupFooter = $('#popupFooter').addClass('rootDiv');
  
  if (bgPage.isEmpty(bgPage.recentlyClosedTabs)) {
    var rootDiv = $('#rootDiv').text('No recently closed tabs.');
  } else {
    var counter = 0;
    for (var index in bgPage.rctTimestamps) {
      counter++;
      createRctDivForPopup(bgPage.rctTimestamps[index]);
      if (counter == bgPage.maxPopupLength) break;
    }
  }
  createPopupFooter();
}

// Creates footer for popup.
function createPopupFooter() {
  var popupFooter = $('#popupFooter')
    .addClass('popupFooter')
    .text('Show all recently closed tabs and the options page')
    .click(function() {
      chrome.tabs.create( {
        'url' : chrome.extension.getURL('options.html'),
        'selected' : true
      }, function(tab) {
        // Tab opened: possible migration procedures
        });
      return false;});
}

// Removes selected RecentlyClosedTab row
// @param i index of recentlyClosedTabs element
function removeRecentlyClosedTabFromList(i) {
  $('#rctDivElement' + i).remove();
}
