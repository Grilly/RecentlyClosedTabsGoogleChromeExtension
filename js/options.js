var bgPage = chrome.extension.getBackgroundPage();

function main() {
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
  
  bgPage.loadValues();
  var rctListDiv = $('<div>')
    .addClass('rctListDiv')
    .appendTo('body');
  
  var ul = $('<ul>')
    .addClass('rctList_Ul');
  var counter = 0;
  
  for (var index in bgPage.rctTimestamps) {
    counter++;
    //TODO 30 = maxNumberOfStoredRcts
    if (counter > 30) {
      break;
    }
    var timestamp = bgPage.rctTimestamps[index];
    var tab = bgPage.rcts[timestamp];
    var li = $('<li>')
      .addClass('rctList_Li')
      .attr({ id: "li_" + timestamp});
      
    var rctList_url = $('<a>')
      .attr({ 
        href: '#',
        title: tab.url })
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
        window.close(); });
    rctList_url[0].timestamp = timestamp;
    
    var rctList_contentDiv = $('<div>')
      .addClass('rctList_contentDiv');
    var rctList_titleDiv = $('<div>')
      .addClass('rctList_titleDiv')
      .text(tab.title)
      .appendTo(rctList_contentDiv);
    var rctList_urlDiv = $('<div>')
      .addClass('rctList_urlDiv')
      .text(tab.url)
      .appendTo(rctList_contentDiv);
    
    var rctList_firstColumnDiv = $('<div>')
      .addClass('rctList_firstColumnDiv');
    var options_favIconUrl = tab.favIconUrl;
    if(options_favIconUrl === "" || options_favIconUrl === undefined) {
      options_favIconUrl = "../images/default_favicon.png";
    }
    var rctList_favIconDiv = $('<div>')
      .addClass('rctList_favIconDiv')
      .appendTo(rctList_firstColumnDiv);
    var rctList_favIcon = $('<img>')
      .addClass('rctList_favIcon')
      .attr({ src: options_favIconUrl })
      .appendTo(rctList_favIconDiv);
    var rctList_dateDiv = $('<div>')
      .addClass('rctList_dateDiv')
      .appendTo(rctList_firstColumnDiv);
    // var rctList_dateUrl = $('<a>')
      // .attr({
        // href: '#',
        // title: bgPage.getDateStringDetail(timestamp) })
      // .appendTo(rctList_dateDiv);
    var rctList_dateDivElement = $('<div>')
	  .attr({ title: bgPage.getDateStringDetail(timestamp) })
      .addClass('rctList_dateDivElement')
      .text(bgPage.getDateString(timestamp))
      .appendTo(rctList_dateDiv);
    
    var rctList_editButtonsDiv = $('<div>')
      .addClass('rctList_editButtonsDiv');
    var rctList_deleteButton = $('<a>')
      .addClass('rctList_deleteButton')
      .attr({ 
        href: '#',
        title: 'Delete this recently closed tab from the list.' })
      .click(function() {
        delete bgPage.rcts[this.timestamp];
        bgPage.storeRcts(bgPage.rcts);
        for (var index in bgPage.rctTimestamps) if (bgPage.rctTimestamps[index] == this.timestamp) bgPage.rctTimestamps.splice(index, 1);
        $('#li_' + this.timestamp).remove();
      });
    rctList_deleteButton[0].timestamp = timestamp;
    rctList_deleteButton.appendTo(rctList_editButtonsDiv);
    var rctList_deleteButtonDiv = $('<div>')
      .addClass('rctList_deleteButtonDiv')
      .text('DELETE')
      .appendTo(rctList_deleteButton);
    var rctList_toFiltersButton = $('<a>')
      .addClass('rctList_toFiltersButton')
      .attr({ 
        href: '#',
        title: 'Add this recently closed tab to the list of filters and delete it from the list.' })
      .click(function() {
        // store element as filter
        var url = bgPage.rcts[this.timestamp].url;
        var urlPattern = bgPage.showPrompt("Ignore this URL in future?", url);
        //console.log(urlPattern);
        if (urlPattern != null) {
          bgPage.addUrlToFiltersAndCheck(urlPattern);
          $('#filters_Ul').remove();
          createFiltersList();
          // delete and remove rct element
          delete bgPage.rcts[this.timestamp];
          bgPage.storeRcts(bgPage.rcts);
          for (var index in bgPage.rctTimestamps) if (bgPage.rctTimestamps[index] == this.timestamp) bgPage.rctTimestamps.splice(index, 1);
          $('#li_' + this.timestamp).remove();
        }
      });
    rctList_toFiltersButton[0].timestamp = timestamp;
    rctList_toFiltersButton.appendTo(rctList_editButtonsDiv);
    var rctList_toFiltersButtonDiv = $('<div>')
      .addClass('rctList_toFiltersButtonDiv')
      .text('TO FILTERS')
      .appendTo(rctList_toFiltersButton);
    
    rctList_url.appendTo(li);
    rctList_firstColumnDiv.appendTo(rctList_url);
    rctList_contentDiv.appendTo(rctList_url);
    rctList_editButtonsDiv.appendTo(li);
    li.appendTo(ul);
  }
  ul.appendTo(rctListDiv);
  
  var rightColumnDiv = $('<div>')
    .addClass('rightColumnDiv')
    .appendTo('body');
  
  //optionsDiv
  var optionsDiv = $('<div>')
    .addClass('optionsDiv')
    .appendTo(rightColumnDiv);
  
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
      input: maxPopupLength })
    .change(function() {
      $('#maxPopupLengthRangeOutputDiv').text($('#maxPopupLengthRangeInput').val());
      return false; })
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
  
  //filtersDiv
  var filtersDiv = $('<div>')
    .addClass('filtersDiv')
    .attr({ id: 'filtersDiv' })
    .appendTo(rightColumnDiv);
  createFiltersList();
  
  //footer
  var footerDiv = $('<div>')
    .addClass('footerDiv')
    .text('©2010 Michael & Draško')
    .appendTo('body');
}

function createFiltersList() {
  var filters_ul = $('<ul>')
    .addClass('filters_Ul')
    .attr({ id: 'filters_Ul' });
  
  for (var index in bgPage.filters) {
    var filter = bgPage.filters[index];
    var filters_li = $('<li>')
      .addClass('filters_Li')
      .attr({ id: 'li_' + index})
      .text(filter.url)
      .appendTo(filters_ul);
  }
  filters_ul.appendTo('#filtersDiv');
}