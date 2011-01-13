function main() {
  var bgPage = chrome.extension.getBackgroundPage();
  bgPage.fetchExtensionConfig();
  // Fetches the maxPopupLength.
  bgPage.fetchMaxPopupLength();
  // Fetches the recentlyClosedTabs.
  bgPage.fetchRcts();
  
  if (bgPage.isEmpty(bgPage.rctTimestamps)) {
    var textDiv = $('<div>').text('No recently closed tabs.').appendTo('body');
  } else {  
	  var ul = $('<ul>');
	  var counter = 0;  
	  
	  for (var index in bgPage.rctTimestamps) {
  		counter++;
  		if (counter > bgPage.maxPopupLength) {
  		  break;
  		}
  		var timestamp = bgPage.rctTimestamps[index];
  		var tab = bgPage.rcts[timestamp];
  		var li = $('<li>');
  		  
  		var url = $('<a>')
  		  .attr({ 
    			href: '#',
    			title: tab.url
  		  })
  		  /*.text(tab.title)*/
  		  .click(function() {
    			chrome.tabs.create({
    			  'url' : bgPage.rcts[this.timestamp].url,
    			  'selected' : true
    			  }, function() { 
    			  // Tab opened: possible migration procedures
    			  });
    			delete bgPage.rcts[this.timestamp];
    			bgPage.storeRcts(bgPage.rcts);
    			for (var index in bgPage.rctTimestamps) if (bgPage.rctTimestamps[index] == this.timestamp) bgPage.rctTimestamps.splice(index, 1);
    			window.close();
  		  });
  		url[0].timestamp = timestamp;
  		
  		var titleTextDiv = $('<div>')
  		  .addClass('titleTextDiv')
  		  .text(tab.title)
  		  .appendTo(url);
  		
  		var popup_favIconUrl = tab.favIconUrl;
  		if(popup_favIconUrl === "" || popup_favIconUrl === undefined) {
  		  popup_favIconUrl = "../images/default_favicon.png";
  		}
  		var img = $('<img>')
  		  .addClass('favicon')
  		  .attr({ src: popup_favIconUrl })
  		  .appendTo(url);
  		
  		url.appendTo(li);
  		li.appendTo(ul);
	  }
	  ul.appendTo('body');
	}
  var popupFooter = $('<div>')
    .addClass('popupFooter')
    .text('Show all recently closed tabs and the options page')
    .click(function() {
      chrome.tabs.create( {
        'url' : chrome.extension.getURL('options.html'),
        'selected' : true
      }, function(tab) {
        // Tab opened: possible migration procedures
        });
      return false;
    })
    .appendTo('body');
}
