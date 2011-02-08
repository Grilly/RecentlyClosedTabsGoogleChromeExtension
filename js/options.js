var bgPage = chrome.extension.getBackgroundPage();

function main() {
  bgPage.fetchShowTabShot();
  bgPage.fetchMaxPopupLength();
  
  //Header
  var headerDiv = $('<div>')
    .addClass('headerDiv')
    .attr('id', 'headerDiv')
    .appendTo('body');
  createHeader();
  
  //rctList
  var rctListDiv = $('<div>')
    .addClass('rctListDiv')
    .attr({
      id: 'rctListDiv'
    })
    .appendTo('body');
  
  var rctList_headline = $('<h3>')
    .addClass('rctList_headline')
    .text('Recently closed tabs:')
    .appendTo(rctListDiv);
  
  var rctList_deleteAllButtonDiv = $('<div>')
    .addClass('rctList_deleteAllButtonDiv')
    .appendTo(rctListDiv);
  var rctList_deleteAllButtonDiv = $('<input>')
    .attr({ 
      type: 'button',
      value: 'Delete All Recently Closed Tabs'})
    .click(function() {
      if (bgPage.isEmpty(bgPage.rcts)) {
        alert("No recently closed tabs.");
      } else {
        if (bgPage.showConfirm("Do you really want to delete all recently closed tabs.")) {
          for (var index in bgPage.rctTimestamps) $('#li_' + bgPage.rctTimestamps[index]).remove();
          bgPage.storeRcts({});
          bgPage.rctTimestamps = [];
          if (bgPage.isEmpty(bgPage.rcts)) {
            rctList_placeholder.text('No recently closed tabs.');
          } else {
            rctList_placeholder.text('*If you add a recently closed tab to the filters it will be deleted from the recently closed tabs list.');
          }
        }
      }
      return false; })
    .appendTo(rctList_deleteAllButtonDiv);
  
  var rctList_placeholder = $('<div>')
    .addClass('rctList_placeholder')
    .appendTo(rctListDiv);
  if (bgPage.isEmpty(bgPage.rcts)) {
    rctList_placeholder.text('No recently closed tabs.');
  } else {
    rctList_placeholder.text('*If you add a recently closed tab to the filters it will be deleted from the recently closed tabs list.');
  }
  createRctList();
  
  var rightColumnDiv = $('<div>')
    .addClass('rightColumnDiv')
    .appendTo('body');
  
  //optionsDiv
  var optionsDiv = $('<div>')
    .addClass('optionsDiv')
    .attr('id', 'optionsDiv')
    .appendTo(rightColumnDiv);
  var options_headline = $('<h3>')
    .addClass('options_headline')
    .text('Options:')
    .appendTo(optionsDiv);
  createOptionsPanel();
  
  //filtersDiv
  var filtersDiv = $('<div>')
    .addClass('filtersDiv')
    .attr('id', 'filtersDiv')
    .appendTo(rightColumnDiv);
  var filters_headline = $('<h3>')
    .addClass('filters_headline')
    .text('Active URL filters:')
    .appendTo(filtersDiv);
  createFiltersList();
  
  //footer
  var footerDiv = $('<div>')
    .addClass('footerDiv')
    .text('©2010 Michael & Draško')
    .appendTo('body');
}

function createHeader() {
  var headerImgDiv = $('<div>')
    .addClass('headerImgDiv')
    .appendTo($('#headerDiv'));
  var headerImgElement = $('<img>')
    .addClass('headerImgElement')
    .attr({
      src: 'images/rct128.png',
      alt: 'Recently Closed Tabs'})
    .appendTo(headerImgDiv);
  
  var headerTitleDiv = $('<div>')
    .addClass('headerTitleDiv')
    .text(bgPage.extensionConfig.name + ' ' + bgPage.extensionConfig.version)
    .appendTo($('#headerDiv'));
  
  var headerBorderTitle = $('<h1>')
    .addClass('headerBorderTitle')
    .text('Extension Options')
    .appendTo($('#headerDiv'));
  var headerLinkDiv = $('<div>')
    .addClass('headerLinkDiv')
    .text('Show Changelog')
    .click(function() {
      chrome.tabs.create( {
        'url' : chrome.extension.getURL('infonews.html'),
        'selected' : true
      }, function(tab) {
        // Tab opened: possible migration procedures
      });
      return false;
    })
    .appendTo($('#headerDiv'));
}

function createRctList() {
  bgPage.fetchShowTabShot();
  var rctList_ul = $('<ul>')
    .addClass('rctList_ul')
    .attr({
      id: 'rctList_ul'
    });
  
  var counter = 0;
    
    for (var index in bgPage.rctTimestamps) {
      counter++;
      //TODO die folgenden 3 Zeilen löschen, wenn maxNumberOfStoredRcts auch bei Speicherung der Rcts beachtet wird
      if (counter > bgPage.maxNumberOfStoredRcts) {
        break;
      }
      var timestamp = bgPage.rctTimestamps[index];
      var tab = bgPage.rcts[timestamp];
      var li = $('<li>')
        .addClass('rctList_li')
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
          bgPage.removeRctByTimestamp(this.timestamp);
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
          bgPage.removeRctByTimestamp(this.timestamp);
          $('#li_' + this.timestamp).remove();
          if (bgPage.isEmpty(bgPage.rcts)) {
            rctList_placeholder.text('No recently closed tabs.');
          } else {
            rctList_placeholder.text('*If you add a recently closed tab to the filters it will be deleted from the recently closed tabs list.');
          }
        });
      rctList_deleteButton[0].timestamp = timestamp;
      rctList_deleteButton.appendTo(rctList_editButtonsDiv);
      var rctList_deleteButtonDiv = $('<div>')
        .addClass('rctList_deleteButtonDiv')
        .text('Delete')
        .appendTo(rctList_deleteButton);
      var rctList_toFiltersButton = $('<a>')
        .addClass('rctList_toFiltersButton')
        .attr({ 
          href: '#',
          title: 'Add this recently closed tab to the list of filters and delete it from the list.' })
        .click(function() {
          // store element as filter
          var urlPattern = bgPage.showPrompt("Ignore this URL in future?", bgPage.rcts[this.timestamp].url);
          //console.log(urlPattern);
          if (urlPattern != null) {
            bgPage.addUrlToFiltersAndCheck(urlPattern);
            $('#filters_ul').remove();
            createFiltersList();
            // delete and remove rct element
            bgPage.removeRctByTimestamp(this.timestamp);
            $('#li_' + this.timestamp).remove();
          }
          if (bgPage.isEmpty(bgPage.rcts)) {
            rctList_placeholder.text('No recently closed tabs.');
          } else {
            rctList_placeholder.text('*If you add a recently closed tab to the filters it will be deleted from the recently closed tabs list.');
          }
        });
      rctList_toFiltersButton[0].timestamp = timestamp;
      rctList_toFiltersButton.appendTo(rctList_editButtonsDiv);
      var rctList_toFiltersButtonDiv = $('<div>')
        .addClass('rctList_toFiltersButtonDiv')
        .text('To Filters')
        .appendTo(rctList_toFiltersButton);
      
      rctList_url.appendTo(li);
      rctList_firstColumnDiv.appendTo(rctList_url);
      
      if (bgPage.showTabShot == 'true') {
        rctList_contentDiv.css({ width: '544px' });
        var rctList_tabShotDiv = $('<div>')
          .addClass('rctList_tabShotDiv')
          .appendTo(rctList_url);
        var rctList_tabShotImg = $('<img>')
          .addClass('rctList_tabShotImg')
          .appendTo(rctList_tabShotDiv);
        var tabShot = bgPage.rcts[timestamp].tabShot;
        if (tabShot !== undefined && tabShot != null) {
          rctList_tabShotImg.attr({ src: tabShot });
        } else {
          rctList_tabShotImg.attr({ src: '../images/default_tabShot.png' });
        }
      } else {
        rctList_contentDiv.css({ width: '586px' });
      }
      rctList_contentDiv.appendTo(rctList_url);
      rctList_editButtonsDiv.appendTo(li);
      li.appendTo(rctList_ul);
    }
    rctList_ul.appendTo($('#rctListDiv'));
}


function createFiltersList() {
  var filters_ul = $('<ul>')
    .addClass('filters_ul')
    .attr('id', 'filters_ul');
  
  for (var index in bgPage.filters) {
    var filter = bgPage.filters[index];
    var filters_li = $('<li>')
      .addClass('filters_li')
      .attr({ id: 'filters_li_' + index});
//      .text(filter.url);
    
    var filters_contentDiv = $('<div>')
      .addClass('filters_contentDiv')
      .attr({
          id: 'filters_contentDiv_' + index,
          title: filter.url 
        })
      .text(filter.url)
      .appendTo(filters_li);
    
    var filters_deleteButtonDiv = $('<div>')
      .addClass('filters_deleteButtonDiv');
    var filters_deleteButton = $('<input>')
      .attr({ 
        type: 'button',
        value: 'Delete'})
      .click(function() {
        $('#filters_li_' + this.index).remove();
        delete bgPage.filters[this.index];
        bgPage.storeFilters();
        return false; })
      .appendTo(filters_deleteButtonDiv);
    filters_deleteButton[0].index = index;
    
    var filters_editButtonDiv = $('<div>')
      .addClass('filters_editButtonDiv')
    var filters_editButton = $('<input>')
      .attr({ 
        type: 'button',
        value: 'Edit'})
      .click(function() {
        var newUrl = bgPage.showPrompt('Edit Filter', bgPage.filters[this.index].url);
        while (!bgPage.isFilterUnique(newUrl)) {
          alert('Filter ' + newUrl + '" exists already! Please provide a different filter.');
          newUrl = bgPage.showPrompt('Edit Filter', bgPage.filters[this.index].url);
        }
        if (newUrl == '') {
          if (bgPage.showConfirm('Do you really want to delete this filter: "' + bgPage.filters[this.index].url + '"')) {
            $('#filters_li_' + this.index).remove();
            delete bgPage.filters[this.index];
            bgPage.storeFilters();
            return;
          }
        }
        if (newUrl == null) return;
        bgPage.filters[this.index].url = newUrl;
        $('#filters_contentDiv_' + this.index).text(newUrl);
        bgPage.storeFilters();
        
        return false; })
      .appendTo(filters_editButtonDiv);
    filters_editButton[0].index = index;
    
    filters_deleteButtonDiv.appendTo(filters_li);
    filters_editButtonDiv.appendTo(filters_li);
    filters_li.appendTo(filters_ul);
  }
  filters_ul.appendTo('#filtersDiv');
}

function createOptionsPanel() {
  //maxPopupLengthOptions
  var maxPopupLengthOptionsDiv = $('<div>')
    .addClass('maxPopupLengthOptionsDiv')
    .appendTo($('#optionsDiv'));
  var maxPopupLength_headline = $('<h4>')
    .addClass('maxPopupLength_headline')
    .text('Favorite number of recently closed tabs shown in the popup:')
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeMin = 1;
  var maxPopupLengthRangeMax = 15;
  var maxPopupLengthRangeMinDiv = $('<div>')
    .addClass('maxPopupLengthRangeMinDiv')
    .attr('id', 'maxPopupLengthRangeMinDiv')
    .text(maxPopupLengthRangeMin)
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeDiv = $('<div>')
    .addClass('maxPopupLengthRangeDiv')
    .attr({ 
      id: 'maxPopupLengthRangeDiv',
      name: bgPage.maxPopupLength })
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeInput = $('<input>')
    .attr({
      id: 'maxPopupLengthRangeInput',
      type: 'range',
      min: maxPopupLengthRangeMin,
      max: maxPopupLengthRangeMax,
      value: bgPage.maxPopupLength,
      input: bgPage.maxPopupLength })
    .change(function() {
      $('#maxPopupLengthRangeOutputDiv').text($('#maxPopupLengthRangeInput').val());
      return false; })
    .appendTo(maxPopupLengthRangeDiv);
  var maxPopupLengthRangeMaxDiv = $('<div>')
    .addClass('maxPopupLengthRangeMaxDiv')
    .attr('id', 'maxPopupLengthRangeMaxDiv')
    .text(maxPopupLengthRangeMax)
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeOutputText = $('<div>')
    .addClass('maxPopupLengthRangeOutputText')
    .attr('id', 'maxPopupLengthRangeOutputText')
    .text('Current choice:')
    .appendTo(maxPopupLengthOptionsDiv);
  var maxPopupLengthRangeOutputDiv = $('<div>')
    .addClass('maxPopupLengthRangeOutputDiv')
    .attr({ 
      id: 'maxPopupLengthRangeOutputDiv',
      name: bgPage.maxPopupLength })
    .text($('#maxPopupLengthRangeInput').val())
    .appendTo(maxPopupLengthOptionsDiv);
  
  //showTabShots
  var showTabShotsOptionsDiv = $('<div>')
    .addClass('showTabShotsOptionsDiv')
    .appendTo($('#optionsDiv'));
  var showTabShots_headline = $('<h4>')
    .addClass('showTabShots_headline')
    .text('Show the screenshot for a recently closed tab:')
    .appendTo(showTabShotsOptionsDiv);
  var showTabShots_checkbox = $('<input>')
    .addClass('showTabShots_checkbox')
    .attr({
      id: 'showTabShots_checkbox',
      type: 'checkbox'
    })
    .appendTo(showTabShotsOptionsDiv);
  var showTabShots_checkboxLabel = $('<label>')
    .addClass('showTabShots_checkboxLabel')
    .attr('for', 'showTabShots_checkbox')
    .text('Show screenshots')
    .appendTo(showTabShotsOptionsDiv);
  
  if(bgPage.showTabShot == 'true') {
    $('#showTabShots_checkbox').attr('checked', true);
  } else {
    $('#showTabShots_checkbox').attr('checked', false);
  }
  
  //maxNumberOfStoredRcts
  var maxNumberOfStoredRctsMin = 5;
  var maxNumberOfStoredRctsMax = 200;
  var maxNumberOfStoredRctsDiv = $('<div>')
    .addClass('maxNumberOfStoredRctsDiv')
    .appendTo($('#optionsDiv'));
  var maxNumberOfStoredRcts_headline = $('<h4>')
    .addClass('maxNumberOfStoredRcts_headline')
    .text('Favorite number of stored recently closed tabs:')
    .appendTo(maxNumberOfStoredRctsDiv);
  var maxNumberOfStoredRctsInput = $('<input>')
  .attr({
    id: 'maxNumberOfStoredRctsInput',
    type: 'number',
    min: maxNumberOfStoredRctsMin,
    max: maxNumberOfStoredRctsMax,
    step: 1,
    value: bgPage.maxNumberOfStoredRcts })
  .appendTo(maxNumberOfStoredRctsDiv);
  
  //saveOptions
  var saveOptionsDiv = $('<div>')
    .addClass('saveOptionsDiv')
    .attr('id', 'saveOptionsDiv')
    .appendTo($('#optionsDiv'));
  var saveOptionsButton = $('<button>')
    .attr('id', 'saveOptionsButton')
    .text('Save Options')
    .click(function() {
      $('#saveOptionsButton').hide();
      localStorage.setItem('maxPopupLength', $('#maxPopupLengthRangeInput').val());
      var showTabShotNew = $('#showTabShots_checkbox').attr('checked');
      if (localStorage.getItem('showTabShot') != showTabShotNew) {
        localStorage.setItem('showTabShot', showTabShotNew);
        $('#rctList_ul').remove();
        createRctList();
      }
      var newMaxNumberOfStoredRctsInput = $('#maxNumberOfStoredRctsInput').val();
      if(newMaxNumberOfStoredRctsInput >= maxNumberOfStoredRctsMin
          && newMaxNumberOfStoredRctsInput <= maxNumberOfStoredRctsMax) {
        bgPage.storeMaxNumberOfStoredRcts(newMaxNumberOfStoredRctsInput);
      } else {
        bgPage.storeMaxNumberOfStoredRcts(200);
        alert('The entered number of stored recently closed tabs is not valid. Please enter a number between ' + maxNumberOfStoredRctsMin + ' and ' + maxNumberOfStoredRctsMax + '. The number 200 was saved.');
      }
      var optionsSaveStatus = $('<div>')
        .addClass('optionsSaveStatus')
        .attr('id', 'optionsSaveStatus')
        .text('Options Saved.')
        .appendTo(saveOptionsDiv);
      setTimeout(function() {
        $('#saveOptionsButton').show();
        $('#optionsSaveStatus').remove();
        }, 750);
      return false; })
    .appendTo(saveOptionsDiv);
}