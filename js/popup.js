function main() {
  var bgPage = chrome.extension.getBackgroundPage();
  bgPage.loadValues();
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
    
    var img = $('<img>')
      .addClass('favicon')
      .attr({ src: tab.favIconUrl })
      .appendTo(url);
    
    url.appendTo(li);
    li.appendTo(ul);
  }
  ul.appendTo('body');
}
