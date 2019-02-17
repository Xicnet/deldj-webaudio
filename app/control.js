$(document).ready(function() {
  // Attach it to the window so it can be inspected at the console.
  window.gamepad = new Gamepad();

  gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
    console.log('Connected', device);

    $('#gamepads').append('<li id="gamepad-' + device.index + '"><h1>Gamepad #' + device.index + ': &quot;' + device.id + '&quot;</h1></li>');

    var mainWrap = $('#gamepad-' + device.index),
    statesWrap,
    logWrap,
    control,
    value,
    i;

    //mainWrap.append('<strong>State</strong><ul id="states-' + device.index + '"></ul>');
    mainWrap.append('<strong>Events</strong><ul id="log-' + device.index + '"></ul>');

    statesWrap = $('#states-' + device.index)
      logWrap = $('#log-' + device.index)

      for (control in device.state) {
        value = device.state[control];

        //statesWrap.append('<li>' + control + ': <span id="state-' + device.index + '-' + control + '">' + value + '</span></li>');
      }
    for (i = 0; i < device.buttons.length; i++) {
      value = device.buttons[i];
      //statesWrap.append('<li>Raw Button ' + i + ': <span id="button-' + device.index + '-' + i + '">' + value + '</span></li>');
    }
    for (i = 0; i < device.axes.length; i++) {
      value = device.axes[i];
      //statesWrap.append('<li>Raw Axis ' + i + ': <span id="axis-' + device.index + '-' + i + '">' + value + '</span></li>');
    }

    $('#connect-notice').hide();
  });

  gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
    console.log('Disconnected', device);

    $('#gamepad-' + device.index).remove();

    if (gamepad.count() == 0) {
      $('#connect-notice').show();
    }
  });

  gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
    var gamepad,
    wrap,
    control,
    value,
    i,
    j;

    for (i = 0; i < gamepads.length; i++) {
      gamepad = gamepads[i];
      wrap = $('#gamepad-' + i);

      if (gamepad) {
        for (control in gamepad.state) {
          value = gamepad.state[control];
          $('#state-' + gamepad.index + '-' + control + '').html(value);
        }
        for (j = 0; j < gamepad.buttons.length; j++) {
          value = gamepad.buttons[j];
          $('#button-' + gamepad.index + '-' + j + '').html(value);
        }
        for (j = 0; j < gamepad.axes.length; j++) {
          value = gamepad.axes[j];
          $('#axis-' + gamepad.index + '-' + j + '').html(value);
        }
      }
    }
  });

  gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
    $('#log-' + e.gamepad.index).html('<li>' + e.control + ' down</li>');
  });

  gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
    $('#log-' + e.gamepad.index).html('<li>' + e.control + ' up</li>');
  });

  gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
    $('#log-' + e.gamepad.index).html('<li>' + e.axis + ' changed to ' + e.value + '</li>');
    try { lowPassFilter.frequency =  e.value * 2000; }
    catch(err) { console.log("no filter: ", err); }
  });

  if (!gamepad.init()) {
    alert('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
  }

  // Sound control
  gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
    console.log(e.control, group.sounds);
    try {
      group.sounds[samples.indexOf(e.control)].play();
      var obj = s.select("#"+e.control);
      obj.attr({ stroke: "#fff", strokeWidth: 5 });
    }
    catch(err) { console.log("Error trying to play ", e.control, " : ", err); }
  });

  gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
    try {
      group.sounds[samples.indexOf(e.control)].stop();
    var obj = s.select("#"+e.control);
    obj.attr({ stroke: "#fff", strokeWidth: 0 });
    }
    catch(err) { console.log("Error trying to stop ", e.control, " : ", err); }
  });

  s.mouseup(function(e){
    var obj = s.select("#"+e.target.id).attr({ stroke: "#fff", strokeWidth: 0 });
    group.sounds[samples.indexOf(e.target.id)].stop();
  });

  s.mousedown(function(e){
    var obj = s.select("#"+e.target.id).attr({ stroke: "#fff", strokeWidth: 5 });
    group.sounds[samples.indexOf(e.target.id)].play();
  });

  s.touchstart(function(e){
    if (e.type === 'touchstart') {
      // Stop propagation : on touch devices the first click will be used and not the second.
      var obj = s.select("#"+e.target.id).attr({ stroke: "#fff", strokeWidth: 5 });
      group.sounds[samples.indexOf(e.target.id)].play();
      e.stopPropagation();
      e.preventDefault();
    }
  });

  s.touchend(function(e){
    if (e.type === 'touchend') {
      var obj = s.select("#"+e.target.id).attr({ stroke: "#fff", strokeWidth: 0 });
      group.sounds[samples.indexOf(e.target.id)].stop();
    }
  });

});
