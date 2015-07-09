var SunPosition = function(){
  var it = this;

  it.size = 240;

  it.position = {};
  it.position.x = 0;
  it.position.y = 0;

  it.azimuth = 0.0;
  it.altitude = 0.0;

  it.dragging = false;
  it.draggingAni = 0.0;

  it.canvas = document.createElement( 'canvas' );
  it.context = it.canvas.getContext( '2d' );
  it.canvas.width = it.size;
  it.canvas.height = it.size;

  it.hammer = new Hammer( it.canvas );
  it.canvas.addEventListener( 'mousedown', function( _e ){
    it.mousedown( _e );
  })
  it.hammer.on( 'panstart panmove', function( _e ){
    it.hammerPanmove( _e );
  } );
  it.canvas.addEventListener( 'mouseup', function( _e ){
    it.mouseup( _e );
  })

  it.textboxes = document.createElement( 'div' );
  it.textboxes.style.fontSize = it.size * 0.04 + 'px';
  it.textboxes.style.color = '#bbb';

  it.azimuthTextboxDiv = document.createElement( 'div' );
  it.azimuthTextboxDiv.style.textAlign = 'center';
  it.azimuthTextboxDiv.style.position = 'absolute';
  it.azimuthTextboxDiv.innerHTML += 'Azimuth<br>';
  it.textboxes.appendChild( it.azimuthTextboxDiv );

  it.azimuthTextbox = document.createElement( 'input' );
  it.azimuthTextbox.type = 'text';
  it.azimuthTextbox.value = it.azimuth.toFixed( 3 );
  it.azimuthTextbox.style.fontSize = it.size * 0.06 + 'px';
  it.azimuthTextbox.style.textAlign = 'center';
  it.azimuthTextbox.style.width = it.size * 0.3 + 'px';
  it.azimuthTextbox.style.height = it.size * 0.1 + 'px';
  it.azimuthTextbox.style.background = '#666';
  it.azimuthTextbox.style.color = '#ddd';
  it.azimuthTextbox.style.border = 'none';
  it.azimuthTextbox.style.borderRadius = '4px';
  it.azimuthTextbox.addEventListener( 'keydown', function( _e ){
    if( _e.which === 13 ){
      it.azimuth = it.azimuthTextbox.value;
      it.change();
    };
  } );
  it.azimuthTextboxDiv.appendChild( it.azimuthTextbox );

  it.altitudeTextboxDiv = document.createElement( 'div' );
  it.altitudeTextboxDiv.style.textAlign = 'center';
  it.altitudeTextboxDiv.style.position = 'absolute';
  it.altitudeTextboxDiv.style.left = it.size * 0.35 + 'px';
  it.altitudeTextboxDiv.innerHTML += 'Altitude<br>';
  it.textboxes.appendChild( it.altitudeTextboxDiv );

  it.altitudeTextbox = document.createElement( 'input' );
  it.altitudeTextbox.type = 'text';
  it.altitudeTextbox.value = it.altitude.toFixed( 3 );
  it.altitudeTextbox.style.fontSize = it.size * 0.06 + 'px';
  it.altitudeTextbox.style.textAlign = 'center';
  it.altitudeTextbox.style.width = it.size * 0.3 + 'px';
  it.altitudeTextbox.style.height = it.size * 0.1 + 'px';
  it.altitudeTextbox.style.background = '#666';
  it.altitudeTextbox.style.color = '#ddd';
  it.altitudeTextbox.style.border = 'none';
  it.altitudeTextbox.style.borderRadius = '4px';
  it.altitudeTextbox.addEventListener( 'keydown', function( _e ){
    if( _e.which === 13 ){
      it.altitude = it.altitudeTextbox.value;
      it.change();
    };
  } );
  it.altitudeTextboxDiv.appendChild( it.altitudeTextbox );

};

SunPosition.prototype.update = function(){
  var it = this;

  if( it.dragging ){
    it.draggingAni += ( 1.0 - it.draggingAni ) * 0.2;
  }else{
    it.draggingAni += ( 0.0 - it.draggingAni ) * 0.2;
  }

  it.context.clearRect( 0, 0, it.size, it.size );

  it.context.fillStyle = '#FFF';
  it.context.beginPath();
  it.context.arc( it.size * 0.5, it.size * 0.5, it.size * 0.5, 0.0, 2.0 * Math.PI );
  it.context.fill();

  it.context.fillStyle = '#222';
  it.context.beginPath();
  it.context.arc( it.size * 0.5, it.size * 0.5, it.size * 0.5 - 2, 0.0, 2.0 * Math.PI );
  it.context.fill();

  var sunX = it.size * 0.5 + Math.sin( it.azimuth * Math.PI / 180.0 ) * Math.cos( it.altitude * Math.PI / 180.0 ) * it.size * 0.35;
  var sunY = it.size * 0.5 - Math.cos( it.azimuth * Math.PI / 180.0 ) * Math.cos( it.altitude * Math.PI / 180.0 ) * it.size * 0.35;

  it.context.fillStyle = '#e35';
  it.context.beginPath();
  it.context.arc( sunX, sunY, it.size * ( 0.07 - it.draggingAni * 0.02 ), 0.0, 2.0 * Math.PI );
  it.context.fill();

  var ringPhase = ( ( +new Date() ) * 0.001 ) % ( Math.PI * 2.0 ) + it.draggingAni * 9.0;
  var ringSize = it.size * ( 0.05 + it.draggingAni * 0.03 );
  it.context.lineWidth = it.size * 0.03 * it.draggingAni;

  it.context.strokeStyle = '#e35';
  it.context.beginPath();
  it.context.arc( sunX, sunY, ringSize, ringPhase, ringPhase + Math.PI / 3.0 * 1.0 );
  it.context.stroke();

  it.context.beginPath();
  it.context.arc( sunX, sunY, ringSize, ringPhase + Math.PI / 3.0 * 2.0, ringPhase + Math.PI / 3.0 * 3.0 );
  it.context.stroke();

  it.context.beginPath();
  it.context.arc( sunX, sunY, ringSize, ringPhase + Math.PI / 3.0 * 4.0, ringPhase + Math.PI / 3.0 * 5.0 );
  it.context.stroke();
};

SunPosition.prototype.setSize = function( _size ){
  var it = this;

  it.size = _size;
  it.canvas.width = it.size;
  it.canvas.height = it.size;
};

SunPosition.prototype.change = function( _e ){
  var it = this;

  it.azimuthTextbox.value = it.azimuth.toFixed( 3 );
  it.altitudeTextbox.value = it.altitude.toFixed( 3 );

  if( typeof it.onChange === 'function' ){ it.onChange( it.color ); }
}

SunPosition.prototype.mousedown = function( _e ){
  var it = this;

  var x = _e.offsetX;
  var y = _e.offsetY;
  var distX = x - it.size * 0.5;
  var distY = y - it.size * 0.5;
  var r = Math.sqrt( distX * distX + distY * distY );
  var theta = Math.atan2( distY, distX );

  it.azimuth = ( theta ) * 180.0 / Math.PI + 90.0;
  if( it.azimuth < 0.0 ){ it.azimuth += 360.0; }

  it.altitude = Math.acos( Math.min( r / ( it.size * 0.35 ), 1.0 ) ) / Math.PI * 180.0;

  it.change();

  it.dragging = true;
};

SunPosition.prototype.hammerPanmove = function( _e ){
  var it = this;

  var x = _e.pointers[ 0 ].offsetX;
  var y = _e.pointers[ 0 ].offsetY;
  var distX = x - it.size * 0.5;
  var distY = y - it.size * 0.5;
  var r = Math.sqrt( distX * distX + distY * distY );
  var theta = Math.atan2( distY, distX );

  it.azimuth = ( theta ) * 180.0 / Math.PI + 90.0;
  if( it.azimuth < 0.0 ){ it.azimuth += 360.0; }

  it.altitude = Math.acos( Math.min( r / ( it.size * 0.35 ), 1.0 ) ) / Math.PI * 180.0;

  it.change();
};

SunPosition.prototype.mouseup = function( _e ){
  var it = this;

  it.dragging = false;
};
