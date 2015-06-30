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

  it.canvas.addEventListener( 'mousedown', function( _e ){
    if( !it.touched ){
      it.mousedown( _e );
    }
  } );
  it.canvas.addEventListener( 'mousemove', function( _e ){
    if( !it.touched ){
      it.mousemove( _e );
    }
  } );
  it.canvas.addEventListener( 'mouseup', function( _e ){
    if( !it.touched ){
      it.mouseup( _e );
    }
  } );

  it.canvas.addEventListener( 'touchstart', function( _e ){
    it.touched = true;
    it.touchstart( _e );
  } );
  it.canvas.addEventListener( 'touchmove', function( _e ){
    it.touchmove( _e );
  } );
  it.canvas.addEventListener( 'touchend', function( _e ){
    it.touchend( _e );
  } );
  it.canvas.addEventListener( 'touchcancel', function( _e ){
    it.touchend( _e );
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

Viewer.prototype.touchstart = function( _e ){
  var it = this;

  var touchCount = _e.targetTouches.length;
};

Viewer.prototype.touchmove = function( _e ){
  var it = this;

  var touchCount = _e.targetTouches.length;
  // TODO touchstate single move spin zoom
};

Viewer.prototype.touchend = function( _e ){
  var it = this;

  it.touchState = 'end';
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
