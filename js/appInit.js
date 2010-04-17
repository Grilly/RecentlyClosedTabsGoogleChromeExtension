// Generic script for a Chrome Extension (reffered in the background.html)

//------------------------------------------------------------------------------
// Global variables
//------------------------------------------------------------------------------
// Contains all AppConfig
var appConfig;

//------------------------------------------------------------------------------
// Loads the extension config (manifest.json).
//------------------------------------------------------------------------------
function loadAppConfig() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      appConfig = JSON.parse(this.responseText);
      var storedVersion = localStorage['version'];
      if (appConfig.version != storedVersion) {
        chrome.tabs.create( {'url' : chrome.extension.getURL('infonews.html'), 'selected' : true}, function(tab) {
          // Tab opened: possible migration procedures
          });
        localStorage.setItem('version', appConfig.version);
      }
    }
  };
  xhr.send();
}



