var ControlPanel = function(){
  var it = this;

  it.visible = false;
  it.visibleAni = 0.0;

  it.bottomMode = false;

  it.width = window.innerWidth;
  it.height = window.innerHeight;

  it.mother = document.createElement( 'div' );
  it.mother.style.pointerEvents = 'none';
  it.mother.style.width = it.width + 'px';
  it.mother.style.height = it.height + 'px';
  it.mother.style.position = 'absolute';
  it.mother.style.left = '0px';
  it.mother.style.top = '0px';
  it.mother.style.opacity = '0.8';
  document.body.appendChild( it.mother );

  it.panelRight = document.createElement( 'div' );
  it.panelRight.style.pointerEvents = 'auto';
  it.panelRight.width = 240;
  it.panelRight.style.background = '#333';
  it.panelRight.style.width = it.panelRight.width + 'px';
  it.panelRight.style.height = it.height + 'px';
  it.panelRight.style.position = 'absolute';
  it.panelRight.style.right = -it.width + 'px';
  it.panelRight.style.top = '0px';
  it.mother.appendChild( it.panelRight );

  it.panelBottom = document.createElement( 'div' );
  it.panelBottom.style.pointerEvents = 'auto';
  it.panelBottom.height = 240;
  it.panelBottom.style.background = '#333';
  it.panelBottom.style.width = it.width + 'px';
  it.panelBottom.style.height = it.panelBottom.height + 'px';
  it.panelBottom.style.position = 'absolute';
  it.panelBottom.style.left = '0px';
  it.panelBottom.style.bottom = -it.height + '0px';
  it.mother.appendChild( it.panelBottom );

  it.button = document.createElement( 'canvas' );
  it.button.style.pointerEvents = 'auto';
  it.buttonSize = 64;
  it.button.width = it.buttonSize;
  it.button.height = it.buttonSize;
  it.button.style.position = 'absolute';
  it.button.style.right = '16px';
  it.button.style.bottom = '16px';
  it.buttonContext = it.button.getContext( '2d' );

  it.buttonEnter = false;
  it.buttonEnterAni = 0.0;
  it.buttonPress = false;
  it.buttonPressAni = 0.0;

  it.button.addEventListener( 'mousedown', function( _e ){ it.buttonMousedown( _e ); } );
  it.button.addEventListener( 'mouseup', function( _e ){ it.buttonMouseup( _e ); } );
  it.button.addEventListener( 'mouseenter', function( _e ){ it.buttonMouseenter( _e ); } );
  it.button.addEventListener( 'mouseleave', function( _e ){ it.buttonMouseleave( _e ); } );

  it.buttonDraw();
  it.mother.appendChild( it.button );
};

ControlPanel.prototype.update = function(){
  var it = this;

  it.visibleAni += ( ( it.visible ? 1.0 : 0.0 ) - it.visibleAni ) * 0.2;
  it.buttonEnterAni += ( ( it.buttonEnter ? 1.0 : 0.0 ) - it.buttonEnterAni ) * 0.3;
  it.buttonPressAni += ( ( it.buttonPress ? 1.0 : 0.0 ) - it.buttonPressAni ) * 0.2;

  if( it.bottomMode ){
    it.button.style.right = '16px';
    it.button.style.bottom = ( 16 + it.visibleAni * ( it.panelBottom.height - it.buttonSize * 0.5 - 16 ) ) + 'px';
    it.panelBottom.style.right = -it.panelRight.width + 'px';
    it.panelBottom.style.bottom = it.panelBottom.height * ( it.visibleAni - 1.0 ) + 'px';
  }else{
    it.button.style.right = ( 16 + it.visibleAni * ( it.panelRight.width - it.buttonSize * 0.5 - 16 ) ) + 'px';
    it.button.style.bottom = '16px';
    it.panelRight.style.right = it.panelRight.width * ( it.visibleAni - 1.0 ) + 'px';
    it.panelBottom.style.bottom = -it.panelBottom.height + 'px';
  }
  it.buttonDraw();
};

ControlPanel.prototype.buttonDraw = function(){
  var it = this;

  it.buttonContext.clearRect( 0, 0, it.buttonSize, it.buttonSize );

  // draw bg circle
  var bgBright = Math.floor( 51.0 + it.buttonEnterAni * 51.0 );
  it.buttonContext.fillStyle = 'rgb( ' + bgBright + ', ' + bgBright + ', ' + bgBright + ' )';
  it.buttonContext.beginPath();
  it.buttonContext.arc( it.buttonSize * 0.5, it.buttonSize * 0.5, it.buttonSize * 0.5, 0, 2 * Math.PI );
  it.buttonContext.fill();

  // draw cog
  var cogSize = it.buttonSize * ( 0.3 + 0.05 * it.buttonEnterAni );
  var cogOffset = 0.125 - it.visibleAni * 3.0;
  it.buttonContext.fillStyle = '#ccc';
  it.buttonContext.beginPath();
  it.buttonContext.moveTo(
    it.buttonSize * 0.5 + Math.cos( ( cogOffset + i / 4.0 - 0.08 ) * Math.PI ) * cogSize,
    it.buttonSize * 0.5 + Math.sin( ( cogOffset + i / 4.0 - 0.08 ) * Math.PI ) * cogSize
  );
  for( var i=0; i<8; i++ ){
    it.buttonContext.lineTo(
      it.buttonSize * 0.5 + Math.cos( ( cogOffset + i / 4.0 - 0.08 ) * Math.PI ) * cogSize,
      it.buttonSize * 0.5 + Math.sin( ( cogOffset + i / 4.0 - 0.08 ) * Math.PI ) * cogSize
    );
    it.buttonContext.lineTo(
      it.buttonSize * 0.5 + Math.cos( ( cogOffset + i / 4.0 - 0.04 ) * Math.PI ) * cogSize * 0.75,
      it.buttonSize * 0.5 + Math.sin( ( cogOffset + i / 4.0 - 0.04 ) * Math.PI ) * cogSize * 0.75
    );
    it.buttonContext.lineTo(
      it.buttonSize * 0.5 + Math.cos( ( cogOffset + i / 4.0 + 0.04 ) * Math.PI ) * cogSize * 0.75,
      it.buttonSize * 0.5 + Math.sin( ( cogOffset + i / 4.0 + 0.04 ) * Math.PI ) * cogSize * 0.75
    );
    it.buttonContext.lineTo(
      it.buttonSize * 0.5 + Math.cos( ( cogOffset + i / 4.0 + 0.08 ) * Math.PI ) * cogSize,
      it.buttonSize * 0.5 + Math.sin( ( cogOffset + i / 4.0 + 0.08 ) * Math.PI ) * cogSize
    );
  }
  it.buttonContext.closePath();
  it.buttonContext.arc( it.buttonSize * 0.5, it.buttonSize * 0.5, cogSize * 0.3, Math.PI * 2.0, 0, true );
  it.buttonContext.fill();
};

ControlPanel.prototype.buttonMousedown = function(){
  var it = this;

  it.buttonPress = true;
};

ControlPanel.prototype.buttonMouseup = function(){
  var it = this;

  if( it.buttonPress ){
    it.visible = !it.visible;
    it.buttonEnter = false;
    it.buttonPress = false;
  }
};

ControlPanel.prototype.buttonMouseenter = function(){
  var it = this;

  it.buttonEnter = true;
};

ControlPanel.prototype.buttonMouseleave = function(){
  var it = this;

  it.buttonEnter = false;
  it.buttonPress = false;
};

ControlPanel.prototype.setSize = function( _width, _height ){
  var it = this;

  it.width = _width;
  it.height = _height;

  it.mother.style.width = it.width + 'px';
  it.mother.style.height = it.height + 'px';

  it.panelRight.style.height = it.height + 'px';
  it.panelBottom.style.width = it.width + 'px';
};
