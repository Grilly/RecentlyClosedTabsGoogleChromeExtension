// Scripts for the options.html

//------------------------------------------------------------------------------
// Saves options to localStorage.
function save_options() {
  var select_tabsCount = document.getElementById("tabsCount");
  var tabsCount = select_tabsCount.children[select_tabsCount.selectedIndex].value;
  localStorage.setItem('tabsCount', tabsCount);
  
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["tabsCount"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("tabsCount");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}