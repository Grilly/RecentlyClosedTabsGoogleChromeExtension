/* Copyright (c) 2008 Jordan Kasper
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 * Requires: jQuery 1.2+
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Fore more usage documentation and examples, visit:
 *          http://jkdesign.org/imagecheck/
 * 
 * Basic usage:
    <label for='someCheckbox'>Check it?</label>
    <input type='checkbox' id='someCheckbox' />
    
    $('#someCheckbox').simpleImageCheck({
      image: 'unchecked.png',             // String The image source to show when the checkbox IS NOT checked (REQUIRED) 
      imageChecked: 'checked.png',        // String The image source to show when the checkbox IS checked (REQUIRED)
      afterCheck: function(isChecked) {   // Function Optional callback function for when the image/checkbox is toggled
        // do something if isChecked === true
      }
    });
 * 
 * Note that when hovered, the image will have a class called 
 * imageCheckHover allowing you to alter its appearance if desired
 * 
 * TODO:
 *   Full testing suite
 *   tri/multi-state checkboxes
 *   broadcast hover events in addition to imageCheckHover class?
 * 
 * REVISIONS:
 *   0.1 Initial release
 *   0.2 Fix for keyboard navigation (thanks to allend for the tip)
 * 
 */
;(function($){$.fn.simpleImageCheck=function(o){var n=this;if(n.length<1){return n;}
o=(o)?o:{};o=auditOptions(o);n.each(function(){var i=$(this);if(i.is(':checkbox')){setup(i,o);}});return n;};var setup=function(n,o){var c=n.is(':checked');var src=o.image;if(c){src=o.imageChecked;}
var id=n.attr('id');if(typeof(id)==='undefined'){id=n.attr('id','imageCheckInput_'+$.fn.simpleImageCheck.uid++).attr('id');}
var t=$('label[for="'+id+'"]').text();var im=n.before("<img src='"+src+"' id='ic_"+id+"' alt='"+t+"' title='"+t+"' class='imageCheck"+((c)?' checked':'')+"' role='checkbox' aria-checked='"+((c)?'true':'false')+"' aria-controls='"+id+"' />").parent().find('img#ic_'+id);n.click(function(e,triggered){if(triggered===true){return;}
handleClick(n,im,o,true);}).keypress(function(e){var k=(e.which)?e.which:((e.keyCode)?e.keyCode:0);if(k==13||k==32){e.preventDefault();$(this).click();}}).hide();var ti=n.attr('tabindex')||n.get(0).tabIndex||0;im.css({cursor:'pointer'}).click(function(e){e.preventDefault();handleClick(n,im,o,false);}).keypress(function(e){var k=(e.which)?e.which:((e.keyCode)?e.keyCode:0);if(k==13||k==32){e.preventDefault();$(this).click();}}).hover(function(){$(this).addClass('imageCheckHover');},function(){$(this).removeClass('imageCheckHover');}).get(0).tabIndex=ti;}
var handleClick=function(n,im,o,inputClick){if(im.hasClass('checked')===n.is(':checked')&&!inputClick){n.trigger('click',[true]).change();}
var c=n.is(':checked');im.toggleClass('checked').attr({'aria-checked':''+((c)?'true':'false'),'src':''+((c)?o.imageChecked:o.image)});setTimeout(function(){o.afterCheck(c);},25);}
var auditOptions=function(o){if(!$.isFunction(o.afterCheck)){o.afterCheck=function(){};}
if(typeof(o.image)!='string'){o.image='';}
if(typeof(o.imageChecked)!='string'){o.imageChecked='';}
return o;}
$.fn.simpleImageCheck.uid=0;})(jQuery);