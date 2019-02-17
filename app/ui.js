var s = Snap();
Snap.load("img/index.svg", onSVGLoaded ) ;

function onSVGLoaded( data ){
  s.append( data );
}

