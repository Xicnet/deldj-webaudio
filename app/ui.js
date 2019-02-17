var s = Snap();
Snap.load("img/index.svg", onSVGLoaded ) ;

function onSVGLoaded( data ){
  s.append( data );
}


//var websocket=new WebSocket('ws://192.168.0.87:9998');
/*
var websocket=new WebSocket('ws://95.96.169.85:9998');
websocket.onmessage=function(event){
  //document.forms[0].slider.value=event.data;
  var obj = s.select("#Gamepad2_4");
  console.log("PD data: ", event.data, s);
  setButton(event.data, obj);
};
*/
function setButton(value, obj) {
  if(value==1) {
    obj.attr({ stroke: "#fff", strokeWidth: 10 });
  } else {
    obj.attr({ stroke: "#f00", strokeWidth: 5 });
  }
}

s.mouseup(function(e){
  var target = e.target.id;
  console.log("MOUSEUP EVENT: ", target);
  var obj = s.select("#"+target);
  obj.attr({ stroke: "#ccc", strokeWidth: 0 });
  console.log([samples.indexOf(target)]);
  group.sounds[samples.indexOf(target)].stop();

  //websocket.send('; slider-recv '+(1));
});

s.mousedown(function(e){
  var target = e.target.id;
  console.log("MOUSEDOWN EVENT: ", target);
  var obj = s.select("#"+target);
  obj.attr({ stroke: "#fff", strokeWidth: 5 });
  group.sounds[samples.indexOf(target)].play();
  //websocket.send('; slider-recv '+(1));
});

s.touchstart(function(e){
    var obj = s.select("#"+event.target.id);
  //console.log("EVENT: ", event.target.id, e.type);
  //alert("EVENT: "+ event.target.id + " type: " + e.type);
  if (e.type === 'touchstart') {
    // Stop propagation : on touch devices the first click will be used and not the second.
    //alert("touchstart EVENT: "+ event.target.id + " type: " + e.type);
    obj.attr({ stroke: "#fff", strokeWidth: 10 });
    //websocket.send('; slider-recv '+(1));
    e.stopPropagation();
    e.preventDefault();
  }
});

s.touchend(function(e){
  if (e.type === 'touchend') {
    var obj = s.select("#"+event.target.id);
    obj.attr({ stroke: "#f00", strokeWidth: 5 });
    //websocket.send('; slider-recv '+(0));
    e.stopPropagation();
    e.preventDefault();
  }
});

