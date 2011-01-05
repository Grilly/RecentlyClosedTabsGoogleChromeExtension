var bgPage = chrome.extension.getBackgroundPage();

function main() {
  //Header
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
    .text('Extension Infos')
    .appendTo(headerDiv);
  
  //footer
  $('#footerDiv')
    .addClass('footerDiv')
    .text('©2010 Michael & Draško')
    .appendTo('body');
}