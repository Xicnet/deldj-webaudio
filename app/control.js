$(document).ready(function() {
  var bankCounter = 1;

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
    if(e.control == 'SELECT_BACK') bankPrevious();
    else if(e.control == 'START_FORWARD') bankNext();
    else {
      try {
        group.sounds[samples.indexOf(e.control)].play();
        s.select("#"+e.control).attr({ stroke: "#fff", strokeWidth: 5 });
      }
      catch(err) { console.log("Error trying to play ", e.control); }
    }
  });

  gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
    try {
      group.sounds[samples.indexOf(e.control)].stop();
      s.select("#"+e.control).attr({ stroke: "#fff", strokeWidth: 0 });
    }
    catch(err) { console.log("Error trying to stop ", e.control); }
  });

  function samplePlay(sample) {
    var obj = s.select("#"+sample).attr({ stroke: "#fff", strokeWidth: 5 });
    group.sounds[samples.indexOf(sample)].play();
  }

  function sampleStop(sample) {
    var obj = s.select("#"+sample).attr({ stroke: "#fff", strokeWidth: 0 });
    group.sounds[samples.indexOf(sample)].stop();
  }

  s.mouseup(function(e){
    sampleStop(samples.indexOf(e.target.id));
  });

  s.mousedown(function(e){
    samplePlay(samples.indexOf(e.target.id));
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

  // Bank control //


  function bankSet(bank) {
    loadBank(bank);
    $('#bank-number').html(bank);
    console.log(bank);
  }

  function bankPrevious() {
    if(bankCounter > 1) {
      bankCounter--;
      bankSet(bankCounter);
    }
  }

  function bankNext() {
    if(bankCounter < 9) {
      bankCounter++;
      bankSet(bankCounter);
    }
  }

  document.onkeydown = function(evt) {
    evt = evt || window.event;
    if(evt.repeat === false) console.log("KeyPress: ", evt.keyCode, evt.code);
    if(evt.repeat === true) return;

    // Change bank
    if (evt.code == 'KeyZ') bankPrevious();
    if (evt.code == 'KeyX') bankNext();

    // Play samples
    if (evt.code == 'KeyL') samplePlay('FACE_1');
    if (evt.code == 'KeyP') samplePlay('FACE_2');
    if (evt.code == 'KeyK') samplePlay('FACE_3');
    if (evt.code == 'KeyO') samplePlay('FACE_4');
    if (evt.code == 'KeyQ') samplePlay('LEFT_TOP_SHOULDER');
    if (evt.code == 'KeyW') samplePlay('RIGHT_TOP_SHOULDER');
  };

  document.onkeyup = function(evt) {
    evt = evt || window.event;
    if (evt.code == 'KeyL') sampleStop('FACE_1');
    if (evt.code == 'KeyP') sampleStop('FACE_2');
    if (evt.code == 'KeyK') sampleStop('FACE_3');
    if (evt.code == 'KeyO') sampleStop('FACE_4');
    if (evt.code == 'KeyQ') sampleStop('LEFT_TOP_SHOULDER');
    if (evt.code == 'KeyW') sampleStop('RIGHT_TOP_SHOULDER');
  }

});
