var reverb = new Pizzicato.Effects.Reverb({
  time: 0.01,
  decay: 0.01,
  reverse: true,
  mix: 0.3
});

var samples = [ 'A', 'B', 'X', 'Y', 'L1', 'L2' ];

var banks = [];

var group = new Pizzicato.Group();
function loadBank() {
  for(var i=0 ; i<samples.length ; i++) {
    var file = './audio/'+samples[i]+'.wav';
    console.log("loading", samples[i]);

    banks[i] = new Pz.Sound({
      source: 'file',
      options: { path: file, loop: true }

    }, function() {
      console.log(`loaded`);
    });
    group.addSound(banks[i]);
  }
}

loadBank();

