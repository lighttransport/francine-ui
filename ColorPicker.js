var ColorPicker = function( _parent ){
  var it = this;

  it.size = 48;

  it.position = {};
  it.position.x = 0;
  it.position.y = 0;

  it.color = {};
  it.color.h = 0;
  it.color.s = 50;
  it.color.l = 50;
  it.color.r = 191;
  it.color.g = 64;
  it.color.b = 64;
  it.color.mode = 'hsl';
  it.color.text = 'hsl( 0, 50%, 50% )';

  it.open = false;
  it.openAni = 0.0;

  it.clickState = '';

  it.gradientImage = new Image();
  it.gradientImage.src = 'gradient.png';

  it.canvas = document.createElement( 'canvas' );
  it.context = it.canvas.getContext( '2d' );
  it.canvas.width = it.size;
  it.canvas.height = it.size;
  it.canvas.addEventListener( 'mousedown', function( _e ){ it.canvasMouseDown( _e ); } );

  it.canvasEx = document.createElement( 'canvas' );
  it.contextEx = it.canvasEx.getContext( '2d' );
  it.canvasEx.style.position = 'fixed';
  it.canvasEx.style.left = 0 + 'px';
  it.canvasEx.style.top = 0 + 'px';
  it.canvasEx.style.zIndex = 10;
  it.canvasEx.width = window.innerWidth;
  it.canvasEx.height = window.innerHeight;
  it.canvasEx.style.display = 'none';

  it.canvasEx.addEventListener( 'mousedown', function( _e ){ it.canvasExMouseDown( _e ); } );
  it.canvasEx.addEventListener( 'mousemove', function( _e ){ it.canvasExMouseMove( _e ); } );
  it.canvasEx.addEventListener( 'mouseup', function( _e ){ it.canvasExMouseUp( _e ); } );
  document.body.appendChild( it.canvasEx );

  it.textbox = document.createElement( 'input' );
  it.textbox.type = 'text';
  it.textbox.value = it.getHex();
  it.textbox.style.fontSize = it.size * 0.3 + 'px';
  it.textbox.style.textAlign = 'center';
  it.textbox.style.width = it.size * 1.8 + 'px';
  it.textbox.style.height = it.size * 0.6 + 'px';
  it.textbox.style.position = 'absolute';
  it.textbox.style.background = '#666';
  it.textbox.style.border = 'none';
  it.textbox.style.color = '#ddd';
  it.textbox.style.borderRadius = '4px';
  it.textbox.addEventListener( 'keydown', function( _e ){
    if( _e.which === 13 ){ it.setHex( it.textbox.value ) };
  } );
};

ColorPicker.prototype.update = function(){
  var it = this;

  if( it.open ){
    it.openAni += ( 1.0 - it.openAni ) * 0.2;
  }else{
    it.openAni += ( 0.0 - it.openAni ) * 0.2;
  }

  it.context.clearRect( 0, 0, it.size, it.size );

  it.context.fillStyle = '#FFF';
  it.context.beginPath();
  it.context.arc( it.size * 0.5, it.size * 0.5, it.size * 0.5, 0.0, 2.0 * Math.PI );
  it.context.fill();

  it.context.fillStyle = 'hsl( ' + it.color.h + ', ' + it.color.s + '%, ' + it.color.l + '% )';
  it.context.beginPath();
  it.context.arc( it.size * 0.5, it.size * 0.5, it.size * 0.45, 0.0, 2.0 * Math.PI );
  it.context.fill();

  if( 0.1 < it.openAni ){
    it.canvasEx.style.display = 'block';

    it.contextEx.clearRect( 0, 0, it.canvasEx.width, it.canvasEx.height );

    it.contextEx.fillStyle = '#222';
    it.contextEx.beginPath();
    it.contextEx.arc( it.position.x, it.position.y, it.size * 1.7 * Math.pow( it.openAni, 3.0 ), 0.0, 2.0 * Math.PI );
    it.contextEx.fill();

    var gradS = it.contextEx.createLinearGradient( 0, it.position.y - it.size, 0, it.position.y + it.size );
    gradS.addColorStop( 0, 'hsl( ' + it.color.h + ', 100%, ' + it.color.l + '% )' );
    gradS.addColorStop( 1, 'hsl( ' + it.color.h + ', 0%, ' + it.color.l + '% )' );
    it.contextEx.fillStyle = gradS;
    it.contextEx.beginPath();
    it.contextEx.arc( it.position.x, it.position.y, it.size * 1.6 * Math.pow( it.openAni, 3.0 ), Math.PI * 0.5, Math.PI * 1.5 );
    it.contextEx.fill();

    var gradL = it.contextEx.createLinearGradient( 0, it.position.y - it.size, 0, it.position.y + it.size );
    gradL.addColorStop( 0, 'hsl( ' + it.color.h + ', ' + it.color.s + '%, 100% )' );
    gradL.addColorStop( 0.5, 'hsl( ' + it.color.h + ', ' + it.color.s + '%, 50% )' );
    gradL.addColorStop( 1, 'hsl( ' + it.color.h + ', ' + it.color.s + '%, 0% )' );
    it.contextEx.fillStyle = gradL;
    it.contextEx.beginPath();
    it.contextEx.arc( it.position.x, it.position.y, it.size * 1.6 * Math.pow( it.openAni, 3.0 ), Math.PI * 1.5, Math.PI * 2.5 );
    it.contextEx.fill();

    it.contextEx.fillStyle = '#222';
    it.contextEx.beginPath();
    it.contextEx.arc( it.position.x, it.position.y, it.size * 1.1 * it.openAni, 0.0, 2.0 * Math.PI );
    it.contextEx.fill();

    it.contextEx.beginPath();
    it.contextEx.arc( it.position.x, it.position.y, it.size * 1.61 * Math.pow( it.openAni, 3.0 ), Math.PI * 1.5 - 0.04, Math.PI * 1.5 + 0.04 );
    it.contextEx.arc( it.position.x, it.position.y, it.size * 1.61 * Math.pow( it.openAni, 3.0 ), Math.PI * 0.5 - 0.04, Math.PI * 0.5 + 0.04 );
    it.contextEx.fill();

    it.contextEx.drawImage( it.gradientImage, it.position.x - it.size * it.openAni, it.position.y - it.size * it.openAni, it.size * 2.0 * it.openAni, it.size * 2.0 * it.openAni );

    it.contextEx.fillStyle = '#222';
    it.contextEx.beginPath();
    it.contextEx.arc( it.position.x, it.position.y, it.size * 0.5, 0.0, 2.0 * Math.PI );
    it.contextEx.fill();

    it.contextEx.fillStyle = '#FFF';
    it.contextEx.beginPath();
    it.contextEx.arc( it.position.x, it.position.y, it.size * ( 0.5 - 0.1 * it.openAni ), 0.0, 2.0 * Math.PI );
    it.contextEx.fill();

    it.contextEx.fillStyle = 'hsl( ' + it.color.h + ', ' + it.color.s + '%, ' + it.color.l + '% )';
    it.contextEx.beginPath();
    it.contextEx.arc( it.position.x, it.position.y, it.size * ( 0.45 - 0.1 * it.openAni ), 0.0, 2.0 * Math.PI );
    it.contextEx.fill();
  }else{
    it.canvasEx.style.display = 'none';
  }
};

ColorPicker.prototype.resize = function(){
  var it = this;

  it.canvasEx.width = window.innerWidth;
  it.canvasEx.height = window.innerHeight;
};

ColorPicker.prototype.setSize = function( _size ){
  var it = this;

  it.size = _size;
  it.canvas.width = it.size;
  it.canvas.height = it.size;
};

ColorPicker.prototype.getHex = function(){
  var it = this;

  var c = ( 1.0 - Math.abs( it.color.l * 2.0 / 100.0 - 1.0 ) ) * it.color.s / 100.0;
  var x = c * ( 1.0 - Math.abs( ( ( it.color.h / 60.0 ) % 2.0 ) - 1.0 ) );

  var r, g, b;
  if( it.color.h < 60 ){ r = c; g = x; b = 0; }
  else if( it.color.h < 120 ){ r = x; g = c; b = 0; }
  else if( it.color.h < 180 ){ r = 0; g = c; b = x; }
  else if( it.color.h < 240 ){ r = 0; g = x; b = c; }
  else if( it.color.h < 300 ){ r = x; g = 0; b = c; }
  else{ r = c; g = 0; b = x; }

  var m = it.color.l / 100.0 - c / 2.0;
  function hex( _i ){
    return Math.round( _i * 255 ).toString( 16 ).replace( /^.$/, '0$&' );
  }
  return '#' + hex( r + m ) + hex( g + m ) + hex( b + m );
};

ColorPicker.prototype.setHex = function( _hex ){
  var it = this;

  var r = parseInt( _hex.substring( 1, 3 ), 16 ) / 255.0;
  var g = parseInt( _hex.substring( 3, 5 ), 16 ) / 255.0;
  var b = parseInt( _hex.substring( 5, 7 ), 16 ) / 255.0;

  if( isNaN( r ) || isNaN( g ) || isNaN( b ) ){
    it.change();
    return;
  }

  var cMin = Math.min( Math.min( r, g ), b );
  var cMax = Math.max( Math.max( r, g ), b );
  var cDelta = cMax - cMin;

  it.color.l = Math.floor( ( cMin + cMax ) / 2.0 * 100.0 );

  if( cDelta === 0 ){
    it.color.s = 0;
    it.color.h = 0;
  }else{
    it.color.s = Math.floor( cDelta / ( 1.0 - Math.abs( it.color.l / 100.0 * 2.0 - 1.0 ) ) * 100.0 );
    if( r === cMax ){ it.color.h = Math.floor( ( ( ( ( g - b ) / cDelta ) + 6.0 ) % 6.0 ) * 60.0 ); }
    else if( g === cMax ){ it.color.h = Math.floor( ( ( ( b - r ) / cDelta ) + 2.0 ) * 60.0 ); }
    else{ it.color.h = Math.floor( ( ( ( r - g ) / cDelta ) + 4.0 ) * 60.0 ); }
  }

  it.color.mode = 'rgb';

  it.change();
};

ColorPicker.prototype.change = function( _e ){
  var it = this;

  if( it.color.mode === 'hsl' ){
    it.textbox.value = it.getHex();
  }
  if( typeof it.onChange === 'function' ){ it.onChange( it.color ); }
}

ColorPicker.prototype.canvasMouseDown = function( _e ){
  var it = this;

  var rect = it.canvas.getBoundingClientRect();
  it.position.x = ( rect.left + it.size * 0.5 );
  it.position.y = ( rect.top + it.size * 0.5 );
  it.open = true;
  it.clickState = 'open';
};

ColorPicker.prototype.canvasExMouseDown = function( _e ){
  var it = this;

  var dist = Math.sqrt( ( _e.clientX - it.position.x ) * ( _e.clientX - it.position.x ) + ( _e.clientY - it.position.y ) * ( _e.clientY - it.position.y ) );
  if( dist < it.size * 0.5 ){
    it.open = false;
    it.clickState = 'close';
  }else if( dist < it.size ){
    it.clickState = 'h';
    it.color.h = ( Math.round( Math.atan2( _e.clientY - it.position.y, _e.clientX - it.position.x ) * 180.0 / Math.PI ) + 360 ) % 360;
    it.color.mode = 'hsl';
    it.change();
  }else if( dist < it.size * 1.6 ){
    if( _e.clientX < it.position.x ){
      it.clickState = 's';
      it.color.s = Math.min( Math.max( Math.round( ( it.position.y - _e.clientY ) / ( it.size ) * 50.0 + 50.0 ), 0 ), 100 );
      it.color.mode = 'hsl';
      it.change();
    }else{
      it.clickState = 'l';
      it.color.l = Math.min( Math.max( Math.round( ( it.position.y - _e.clientY ) / ( it.size ) * 50.0 + 50.0 ), 0 ), 100 );
      it.color.mode = 'hsl';
      it.change();
    }
  }else{
    it.open = false;
    it.clickState = 'close';
  }
};

ColorPicker.prototype.canvasExMouseMove = function( _e ){
  var it = this;

  if( it.clickState === 'h' ){
    it.color.h = ( Math.round( Math.atan2( _e.clientY - it.position.y, _e.clientX - it.position.x ) * 180.0 / Math.PI ) + 360 ) % 360;
    it.color.mode = 'hsl';
    it.change();
  }else if( it.clickState === 's' ){
    it.color.s = Math.min( Math.max( Math.round( ( it.position.y - _e.clientY ) / ( it.size ) * 50.0 + 50.0 ), 0 ), 100 );
    it.color.mode = 'hsl';
    it.change();
  }else if( it.clickState === 'l' ){
    it.color.l = Math.min( Math.max( Math.round( ( it.position.y - _e.clientY ) / ( it.size ) * 50.0 + 50.0 ), 0 ), 100 );
    it.color.mode = 'hsl';
    it.change();
  }
};

ColorPicker.prototype.canvasExMouseUp = function( _e ){
  var it = this;

  it.clickState = '';
};
