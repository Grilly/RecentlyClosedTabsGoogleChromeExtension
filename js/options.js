function main() {
  var bgPage = chrome.extension.getBackgroundPage();
  //Header
  var headerDiv = $('<div>')
    .addClass('headerDiv')
    .appendTo('body');
  
  var headerImgDiv = $('<div>')
    .addClass('headerImgDiv')
    .appendTo(headerDiv);
  var headerImgElement = $('<img>')
    .addClass('headerImgElement')
    .attr({
      src: 'images/rct128.png',
      alt: 'Recently Closed Tabs'})
    .appendTo(headerImgDiv);
  
  var headerTitleDiv = $('<div>')
    .addClass('headerTitleDiv')
    .text(bgPage.extensionConfig.name + ' ' + bgPage.extensionConfig.version)
    .appendTo(headerDiv);
  
  var headerBorderTitle = $('<h1>')
    .addClass('headerBorderTitle')
    .text('Extension Options')
    .appendTo(headerDiv);
  
  var maxPopupLength = localStorage['maxPopupLength'];
  if (maxPopupLength === undefined)
    storeMaxPopupLength(15);
  
  //recentlyClosedTabs list TODO
  bgPage.loadValues();
  var rctListDiv = $('<div>')
    .addClass('rctListDiv')
    .appendTo('body');
  
  var ul = $('<ul>');
  var counter = 0;  
  
  for (var index in bgPage.rctTimestamps) {
    counter++;
    //TODO 30 = maxNumberOfStoredRcts
    if (counter > 30) {
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
      //.text(tab.title)
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
    
    var dateUrl = $('<a>')
      .attr({
        href: '#',
        title: bgPage.getDateStringDetail(timestamp)
      })
      .appendTo(li);
    var dateDivElement = $('<div>')
      .addClass('dateDivElement')
      .text(bgPage.getDateString(timestamp))
      .appendTo(dateUrl);
    
    var rctTextDiv = $('<div>')
      .addClass('rctTextDiv')
      .appendTo(url);
    
    var rctTitleDiv = $('<div>')
      .addClass('rctTitleDiv')
      .text(tab.title)
      .appendTo(rctTextDiv);
    
    var rctUrlDiv = $('<div>')
      .addClass('rctUrlDiv')
      .text(tab.url)
      .appendTo(rctTextDiv);
    
    var img = $('<img>')
      .addClass('favicon')
      .attr({ src: tab.favIconUrl })
      .appendTo(url);
    
    url.appendTo(li);
    li.appendTo(ul);
  }
  ul.appendTo(rctListDiv);
  
  //optionsDiv
  var optionsDiv = $('<div>')
    .addClass('optionsDiv')
    .appendTo('body');
  
  //maxPopupLengthOptions
  var maxPopupLengthOptionsDiv = $('<div>')
    .addClass('maxPopupLengthOptionsDiv')
    .appendTo(optionsDiv);
  var maxPopupLengthH3 = $('<h3>')
    .text('Favorite number of recently closed tabs shown in the popup:')
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeMin = 1;
  var maxPopupLengthRangeMax = 15;
  var maxPopupLengthRangeMinDiv = $('<div>')
    .addClass('maxPopupLengthRangeMinDiv')
    .attr({ id: 'maxPopupLengthRangeMinDiv' })
    .text(maxPopupLengthRangeMin)
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeDiv = $('<div>')
    .addClass('maxPopupLengthRangeDiv')
    .attr({ 
      id: 'maxPopupLengthRangeDiv',
      name: maxPopupLength })
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeInput = $('<input>')
    .attr({
      id: 'maxPopupLengthRangeInput',
      type: 'range',
      min: maxPopupLengthRangeMin,
      max: maxPopupLengthRangeMax,
      value: maxPopupLength,
      input: maxPopupLength
    })
    .change(function() {
      $('#maxPopupLengthRangeOutputDiv').text($('#maxPopupLengthRangeInput').val());
      return false;
    })
    .appendTo(maxPopupLengthRangeDiv);
  var maxPopupLengthRangeMaxDiv = $('<div>')
    .addClass('maxPopupLengthRangeMaxDiv')
    .attr({ id: 'maxPopupLengthRangeMaxDiv' })
    .text(maxPopupLengthRangeMax)
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeOutputText = $('<div>')
    .addClass('maxPopupLengthRangeOutputText')
    .attr({ id: 'maxPopupLengthRangeOutputText' })
    .text('Current choice:')
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeOutputDiv = $('<div>')
    .addClass('maxPopupLengthRangeOutputDiv')
    .attr({ 
      id: 'maxPopupLengthRangeOutputDiv',
      name: maxPopupLength })
    .text($('#maxPopupLengthRangeInput').val())
    .appendTo(maxPopupLengthOptionsDiv);
  
  //saveOptions
  var saveOptionsDiv = $('<div>')
    .addClass('saveOptionsDiv')
    .attr({ id: 'saveOptionsDiv' })
    .appendTo(optionsDiv);
  var saveOptionsButton = $('<button>')
    .attr({ id: 'saveOptionsButton' })
    .text('Save Options')
    .click(function() {
      $('#saveOptionsButton').hide();
      localStorage.setItem('maxPopupLength', $('#maxPopupLengthRangeInput').val());
      var optionsSaveStatus = $('<div>')
        .addClass('optionsSaveStatus')
        .attr({ id: 'optionsSaveStatus' })
        .text('Options Saved.')
        .appendTo(saveOptionsDiv);
      setTimeout(function() {
        $('#saveOptionsButton').show();
        $('#optionsSaveStatus').remove();
        }, 750);
      return false; })
    .appendTo(saveOptionsDiv);
  
  //footer
  var footerDiv = $('<div>')
    .addClass('footerDiv')
    .text('©2010 Michael & Draško')
    .appendTo('body');
}
