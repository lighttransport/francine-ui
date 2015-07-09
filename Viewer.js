var Viewer = function(){
  var it = this;

  it.width = 480;
  it.height = 480;

  it.keys = [];

  it.scene = new THREE.Scene();
  it.planeGeometry = new THREE.PlaneGeometry( 32, 32, 32, 32 );
  it.planeMaterial = new THREE.MeshBasicMaterial( {
    wireframe : true
  } );
  it.plane = new THREE.Mesh( it.planeGeometry, it.planeMaterial );
  it.scene.add( it.plane );
  it.plane.rotation.x = Math.PI * 0.5;

  it.camera = new THREE.PerspectiveCamera( 75, it.width / it.height, 0.1, 100 );
  it.camPos = new THREE.Vector3( 0, 1, 5 );
  it.camDir = new THREE.Vector3( 0, 0, -1 );
  it.camSid = new THREE.Vector3( 1, 0, 0 );
  it.camTop = new THREE.Vector3( 0, 1, 0 );
  it.camLon = 0.0;
  it.camLat = 0.0;
  it.camRot = 0.0;
  it.camera.position.copy( it.camPos );
  it.setCam();

  it.renderer = new THREE.WebGLRenderer( { alpha : true } );
  it.renderer.setSize( it.width, it.height );
  it.canvas = it.renderer.domElement;

  it.hammer = new Hammer( it.canvas );
  it.hammer.get( 'pinch' ).set( { enable : true } );
  it.hammer.get( 'rotate' ).set( { enable : true } );

  it.hammerMode = '';

  it.hammer.on( 'panstart', function( _e ){
    it.hammerPanstart( _e );
  } );
  it.hammer.on( 'panmove', function( _e ){
    it.hammerPanmove( _e );
  } );
  it.hammer.on( 'panend pancancel', function( _e ){
    it.hammerPanend( _e );
  } );

  it.hammer.on( 'pinchstart', function( _e ){
    it.hammerPinchstart( _e );
  } );
  it.hammer.on( 'pinchmove', function( _e ){
    it.hammerPinchmove( _e );
  } );
  it.hammer.on( 'pinchend pinchcancel', function( _e ){
    it.hammerPinchend( _e );
  } );

  it.hammer.on( 'rotatestart', function( _e ){
    it.hammerRotatestart( _e );
  } );
  it.hammer.on( 'rotatemove', function( _e ){
    it.hammerRotatemove( _e );
  } );
  it.hammer.on( 'rotateend rotatecancel', function( _e ){
    it.hammerRotateend( _e );
  } );
};

Viewer.prototype.update = function(){
  var it = this;

  var vel = 0.03;
  if( it.keys[ 65 ] ){ // a
    it.camPos.add( it.camSid.clone().multiplyScalar( -vel ) );
  }
  if( it.keys[ 68 ] ){ // d
    it.camPos.add( it.camSid.clone().multiplyScalar( vel ) );
  }
  if( it.keys[ 83 ] ){ // s
    it.camPos.add( it.camDir.clone().multiplyScalar( -vel ) );
  }
  if( it.keys[ 87 ] ){ // w
    it.camPos.add( it.camDir.clone().multiplyScalar( vel ) );
  }
  if( it.keys[ 70 ] ){ // f
    it.camPos.add( it.camTop.clone().multiplyScalar( -vel ) );
  }
  if( it.keys[ 82 ] ){ // r
    it.camPos.add( it.camTop.clone().multiplyScalar( vel ) );
  }

  if( it.keys[ 81 ] ){ // q
    it.camRot -= vel;
  }
  if( it.keys[ 69 ] ){ // e
    it.camRot += vel;
  }
  it.setCam();

  it.renderer.render( it.scene, it.camera );
};

Viewer.prototype.setSize = function( _width, _height ){
  var it = this;

  it.width = _width;
  it.height = _height;

  it.camera.aspect = it.width / it.height;
  it.renderer.setSize( it.width, it.height );
  it.camera.updateProjectionMatrix();
};

Viewer.prototype.setCam = function(){
  var it = this;

  it.camera.position.copy( it.camPos );
  it.camDir.copy( new THREE.Vector3( 0, 0, -1 ) );
  it.camDir.applyAxisAngle( new THREE.Vector3( 1, 0, 0 ), it.camLat );
  it.camDir.applyAxisAngle( new THREE.Vector3( 0, 1, 0 ), it.camLon );
  it.camSid.crossVectors( it.camDir, new THREE.Vector3( 0, 1, 0 ) ).normalize();
  it.camTop.crossVectors( it.camSid, it.camDir ).normalize();
  it.camTop.applyAxisAngle( it.camDir, it.camRot );
  it.camSid.crossVectors( it.camDir, it.camTop ).normalize();

  it.camera.lookAt( it.camPos.clone().add( it.camDir ) );
  it.camera.up.copy( it.camTop );
};

Viewer.prototype.mousedown = function( _e ){
  var it = this;

  it.dragging = true;
  it.dragX = _e.clientX;
  it.dragY = _e.clientY;
};

Viewer.prototype.mousemove = function( _e ){
  var it = this;

  if( it.dragging ){
    var vel = 0.005;

    it.camLon += ( _e.clientX - it.dragX ) * vel * Math.cos( it.camRot ) - ( _e.clientY - it.dragY ) * vel * Math.sin( it.camRot );
    it.camLat += ( _e.clientX - it.dragX ) * vel * Math.sin( it.camRot ) + ( _e.clientY - it.dragY ) * vel * Math.cos( it.camRot );
    it.dragX = _e.clientX;
    it.dragY = _e.clientY;

    if( it.camLat < -Math.PI * 0.45 ){ it.camLat = -Math.PI * 0.45; }
    if( Math.PI * 0.45 < it.camLat ){ it.camLat = Math.PI * 0.45; }
  }
};

Viewer.prototype.hammerPanstart = function( _e ){
  var it = this;

  it.lastX = _e.center.x;
  it.lastY = _e.center.y;
};

Viewer.prototype.hammerPanmove = function( _e ){
  var it = this;

  if( !it.hammerMode && ( 5.0 < _e.distance ) ){
    it.hammerMode = 'turn';
  }

  if( it.hammerMode === 'turn' ){
    it.camLon += ( _e.center.x - it.lastX ) * 0.003 * Math.cos( it.camRot ) - ( _e.center.x - it.lastX ) * 0.003 * Math.sin( it.camRot );
    it.camLat += ( _e.center.y - it.lastY ) * 0.003 * Math.sin( it.camRot ) + ( _e.center.y - it.lastY ) * 0.003 * Math.cos( it.camRot );
    it.lastX = _e.center.x;
    it.lastY = _e.center.y;
  }
};

Viewer.prototype.hammerPanend = function( _e ){
  var it = this;

  it.hammerMode = '';
};

Viewer.prototype.hammerPinchstart = function( _e ){
  var it = this;

  console.log( _e);

  var distX = _e.pointers[ 1 ].clientX - _e.pointers[ 0 ].clientX;
  var distY = _e.pointers[ 1 ].clientY - _e.pointers[ 0 ].clientY;
  var dist = Math.sqrt( distX * distX + distY * distY );
  it.firstDist = dist;

  it.lastDist = dist;
  it.lastX = _e.center.x;
  it.lastY = _e.center.y;
};

Viewer.prototype.hammerPinchmove = function( _e ){
  var it = this;

  var distX = _e.pointers[ 1 ].clientX - _e.pointers[ 0 ].clientX;
  var distY = _e.pointers[ 1 ].clientY - _e.pointers[ 0 ].clientY;
  var dist = Math.sqrt( distX * distX + distY * distY );

  if( !it.hammerMode && 20 < Math.abs( dist - it.firstDist ) ){
    it.hammerMode = 'pinch';
  }

  if( !it.hammerMode && ( 10.0 < _e.distance ) ){
    it.hammerMode = 'move';
  }

  if( it.hammerMode === 'pinch' ){
    it.camPos.add( it.camDir.clone().multiplyScalar( ( dist - it.lastDist ) * 0.01 ) );
  }
  it.lastDist = dist;

  if( it.hammerMode === 'move' ){
    it.camPos.add( it.camSid.clone().multiplyScalar( ( it.lastX - _e.center.x ) * 0.012 ) );
    it.camPos.sub( it.camTop.clone().multiplyScalar( ( it.lastY - _e.center.y ) * 0.012 ) );
  }
  it.lastX = _e.center.x;
  it.lastY = _e.center.y;
};

Viewer.prototype.hammerPinchend = function( _e ){
  var it = this;

  it.hammerMode = '';
};

Viewer.prototype.hammerRotatestart = function( _e ){
  var it = this;

  it.lastRotation = _e.rotation;
  it.enableRotation = false;
};

Viewer.prototype.hammerRotatemove = function( _e ){
  var it = this;

  if( !it.hammerMode && ( 5.0 < Math.abs( _e.rotation ) ) ){
    it.hammerMode = 'rotate';
  }

  if( it.hammerMode === 'rotate' ){
    var r = ( _e.rotation - it.lastRotation );
    if( r < -180.0 ){ r += 360.0; }
    if( 180.0 < r ){ r -= 360.0; }
    it.camRot -= r * 0.03;
  }
  it.lastRotation = _e.rotation;
};

Viewer.prototype.hammerRotateend = function( _e ){
  var it = this;

  it.hammerMode = '';
};

Viewer.prototype.mouseup = function( _e ){
  var it = this;
  it.dragging = false;
};

Viewer.prototype.keydown = function( _e ){
  var it = this;

  it.keys[ _e.which ] = true;
};

Viewer.prototype.keyup = function( _e ){
  var it = this;

  it.keys[ _e.which ] = false;
};
