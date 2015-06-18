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
}

ColorPicker.prototype.setSize = function( _size ){
  var it = this;

  it.size = _size;
  it.canvas.width = it.size;
  it.canvas.height = it.size;
}

ColorPicker.prototype.change = function( _e ){
  var it = this;

  if( typeof it.onChange == 'function' ){ it.onChange( it.color ); }
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
    it.color.h = Math.floor( Math.atan2( _e.clientY - it.position.y, _e.clientX - it.position.x ) * 180.0 / Math.PI );
    it.change();
  }else if( dist < it.size * 1.6 ){
    if( _e.clientX < it.position.x ){
      it.clickState = 's';
      it.color.s = Math.floor( ( it.position.y - _e.clientY ) / ( it.size ) * 50.0 + 50.0 );
      it.change();
    }else{
      it.clickState = 'l';
      it.color.l = Math.floor( ( it.position.y - _e.clientY ) / ( it.size ) * 50.0 + 50.0 );
      it.change();
    }
  }else{
    it.open = false;
    it.clickState = 'close';
  }
};

ColorPicker.prototype.canvasExMouseMove = function( _e ){
  var it = this;

  if( it.clickState == 'h' ){
    it.color.h = Math.atan2( _e.clientY - it.position.y, _e.clientX - it.position.x ) * 180.0 / Math.PI;
    it.change();
  }else if( it.clickState == 's' ){
    it.color.s = Math.floor( ( it.position.y - _e.clientY ) / ( it.size ) * 50.0 + 50.0 );
    it.change();
  }else if( it.clickState == 'l' ){
    it.color.l = Math.floor( ( it.position.y - _e.clientY ) / ( it.size ) * 50.0 + 50.0 );
    it.change();
  }
};

ColorPicker.prototype.canvasExMouseUp = function( _e ){
  var it = this;

  it.clickState = '';
};
