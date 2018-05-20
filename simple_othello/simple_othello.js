// simple_othello.js


function replace_text (parent, text)
{
  clear (parent);
  append_text (parent, text);
}
function clear(element)
{
  if (!element)
    return;
  while (element.lastChild)
    element.removeChild (element.lastChild);
}

// Clear a box

function clearbox (boxid)
{
  //    alert (boxid);
  boxid.value = '';
}

function create_node(type,parent)
{
  if (!type) {
    alert ("No type given to create_node");
    exit;
  }   
  if (!parent) {
    alert ("No parent given to create_node");
    exit;
  }   
  var new_node = document.createElement (type);
  if (!new_node) {
    alert ("Creation of node of type '"+type+"' failed.");
    exit;
  }
  parent.appendChild (new_node);
  return new_node;
}

// Create a node of type "type", attach it to "parent", then attach
// some text to that node.

function create_text_node (type,parent,text)
{
  var new_node = create_node (type,parent);
  var text_node = document.createTextNode (text);
  if (!text_node) {
    alert ("Creation of text node with text '"+text+"' failed.");
    exit;
  }
  new_node.appendChild(text_node);
  return new_node;
}

// Add some text to a node

function append_text (parent,text)
{
  var text_node = document.createTextNode (text);
  if (!text_node) {
    alert ("Creation of text node with text '"+text+"' failed.");
    exit;
  }
  parent.appendChild(text_node);
}

function append_text_by_id (parent_id, text)
{
  var parent = getbyid (parent_id);
  clear (parent);
  append_text (parent, text);
}

// Clear a box

function clearbox (boxid)
{
  //    alert (boxid);
  boxid.value = '';
}

function clearboxbyname (boxname)
{
  //    alert (boxid);
  var boxid = getbyid (boxname);
  boxid.value = '';
}

function getbyid (id)
{
  var element = document.getElementById (id);
  if (! element) {
    alert ("Could not find element with id "+id);
    exit;
  }
  return element;
}

// Get the value of something.


function getvalue (id)
{
  var element = getbyid (id);
  var value = element.value;
  if (! value)
    return;
  /*
BKB 2009-09-20 22:47:43:
This is commented out in order to make "canvas3.js" work.

        alert ("Element with id "+id+" has no value.")
        exit;
    }
    */
  return value;
}

var board=new Array();
for (var i=0;i<=8;i++)
  board[i]=new Array();

function init()
{
  for (var x=1;x<=8;x++)
    for (var y=1;y<=8;y++)
      if (x>3&&y>3&&x<6&&y<6)
        board[x][y]=(x+y)%2?"b":"w";
  else
    board[x][y]=0;
}

function piece(x,y,colour)
{
  var square = getbyid ("square"+x+y);
  append_text (square, String.fromCharCode (parseInt ("25CF",16)));
  square.className = square.className.replace (/empty/, colour);
}

function change_piece(x,y,colour)
{
  var square = getbyid ("square"+x+y);
  square.className = square.className.replace (/b/, "funky");
  square.className = square.className.replace (/w/, "b");
  square.className = square.className.replace (/funky/, "w");
}

var next="b";

/* change_ok if it is OK to change the squares. */

function check_valid (x,y,colour,change_ok)
{
  var min_x = x > 1 ? x - 1 : 1;
  var min_y = y > 1 ? y - 1 : 1;
  var max_x = x < 8 ? x + 1 : 8;
  var max_y = y < 8 ? y + 1 : 8;
  var found_opposite = false;
  if (board[x][y])
    return false;
  for (test_x = min_x; test_x <= max_x; test_x++) {
    for (test_y = min_y; test_y <= max_y; test_y++) {
      if (test_x == x && test_y == y)
        continue;
      var neighbour_colour = board[test_x][test_y];
      if (neighbour_colour != 0 && neighbour_colour != colour) {
        var x_offset = test_x - x;
        var y_offset = test_y - y;
        //alert (x_offset +" "+ y_offset);
        for (t=1;;t++) {
          var probe_x = x+t*x_offset;
          var probe_y = y+t*y_offset;
          //alert ("probing "+t+" "+probe_x +" "+ probe_y);
          if (probe_x < 1 || probe_y < 1 ||
            probe_x > 8 || probe_y > 8)
            break;
          if (board[probe_x][probe_y] == 0)
            break;
          if (board[probe_x][probe_y] == colour) {
            found_opposite = true;
            var s;
            if (change_ok) {
              for (s=1; s < t; s++) {
                var change_x = x+s*x_offset;
                var change_y = y+s*y_offset;
                board[change_x][change_y] = colour;
                change_piece (change_x, change_y, colour);
              }
            }
            break;
          }
        }
      }
    }
  }
  return found_opposite;
}

function check_any_valid (colour)
{
  var any_valid = false;
  for (x=1;x<=8;x++) {
    for (y=1;y<=8;y++) {
      var valid = check_valid (x,y,colour, false);
      if (valid) {
        any_valid = true;
        var square = getbyid ("square"+x+y);
        square.className += " valid";
      }
      //          alert (x+" "+y+ " "+valid+" "+any_valid);
    }
  }
  return any_valid;
}

function declare_victory (white, black)
{
  if (white > black)
    alert ("White wins");
  else if (white < black)
    alert ("Black wins");
  else
    alert ("Tie");
}

function update_game ()
{
  var white = 0;
  var black = 0;
  var remaining = 0;
  for (var x = 1; x <= 8; x++) {
    for (var y = 1; y <= 8; y++) {
      if (board[x][y]=="w")
        white++;
      else if (board[x][y]=="b")
        black++;
      else
        remaining++;
    }
  }
  if (white+black+remaining != 64) {
    alert ("Inconsistency");
  }
  var wscore    = getbyid ("wscore");
  var bscore    = getbyid ("bscore");
  var remaining_td = getbyid ("remaining");
  var next_td = getbyid ("next");
  replace_text (wscore, white);
  replace_text (bscore, black);
  replace_text (remaining_td, remaining);
  if (remaining == 0) {
    declare_victory (white, black);
  } else {
    next_td.className = "square "+ next;
    if (!check_any_valid (next)) {
      alert (next+" has no moves");
      next=(next=="b"?"w":"b");
      next_td.className = "square "+ next;
      if (!check_any_valid (next)) {
        alert ("Neither does "+next+".");
        declare_victory (white, black);
      }
    }
  }
}

function reset_valid ()
{
  for (var x = 1; x <= 8; x++) {
    for (var y = 1; y <= 8; y++) {
      var square = getbyid ("square"+x+y);
      if (square.className.match(/valid/))
        square.className = "empty square";
    }
  }    
}

function play(x,y)
{
  if (board[x][y])
    return;
  if (!check_valid (x, y, next, true)) {
    //      alert ("No go joe");
    return;
  }
  // Valid
  reset_valid ();
  board[x][y] = next;
  piece (x,y,next);
  //    alert ("play "+x+","+y+" colour: "+colour);
  next=(next=="b"?"w":"b");
  update_game ();
}

function create_board ()
{
  //    alert ("Creating board");
  init ();
  var board_table = getbyid ("board");
  var top_tr = create_node ("tr", board_table);
  for (x=0;x<9;x++) {
    var th;
    if (x)
      th=create_text_node ("th", top_tr, x);
    else 
      th=create_node ("th", top_tr);
    th.className = "square";
  }
  for (y=1;y<=8;y++) {
    var tr = create_node ("tr", board_table);
    for (x=0;x<9;x++) {
      if (x) {
        var td = create_node ("td", tr);
        td.className="empty square";
        td.id="square"+x+y;
        (function (x,y) {
          td.onclick = function () {play (x,y);}
        }(x,y));
        if (board[x][y] != 0) {
          piece (x, y, board[x][y]);
        }
      } else {
        var th = create_text_node ("th", tr, y);
        th.className="square";
      }

    }
  }
  update_game ();
}
