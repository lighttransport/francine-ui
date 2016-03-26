ColorPicker = ( function() {

  let ColorPicker = class {

    constructor() {
      let it = this;

      it.size = 48;

      it.color = {
        h: 0,
        s: 0.5,
        l: 0.5,
        r: 0.75,
        g: 0.25,
        b: 0.25,
        hsl: 'hsl( 0, 50%, 50% )',
        rgb: '#a35c5c'
      };

      it.open = false;
      it.openAni = 0.0;

      it.clickState = '';

      it.mother = document.createElement( 'div' );
      it.setStyle( it.mother, {
        position: 'relative',
        width: it.size + 'px',
        height: it.size + 'px',
        overflow: 'visible',
        cursor: 'pointer',
        display: 'inline-block'
      } );

      it.button = document.createElement( 'div' );
      it.setStyle( it.button, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: '0%',
        top: '0%',

        background: it.color.hsl,
        borderRadius: '9999999px'
      } );
      it.button.addEventListener( 'click', function() {
        it.open = true;
        it.mother.style.zIndex = 10000;
        it.operator.style.display = 'block';
      } );

      it.buttonRing = document.createElement( 'div' );
      it.setStyle( it.buttonRing, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: '0%',
        top: '0%',

        background: '#222',
        borderRadius: '9999999px'
      } );

      it.interfaceH = document.createElement( 'canvas' );
      it.interfaceH.width = 256;
      it.interfaceH.height = 256;
      it.setStyle( it.interfaceH, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: '0%',
        top: '0%',

        opacity: 1.0,
        borderRadius: '9999999px',
        filter: 'invert( 0.25 )',
        webkitFilter: 'invert( 0.25 )'
      } );
      ( function() {
        let context = it.interfaceH.getContext( '2d' );
        let imageData = context.createImageData( 256, 256 );
        for ( let i = 0; i < 256 * 256; i ++ ) {
          let rgb = it.hsltorgb( {
            h: ( Math.atan2( Math.floor( i / 256 ) - 128, i % 256 - 128 ) / Math.PI / 2.0 + 1.0 ) % 1.0,
            s: 1.0,
            l: 0.5
          } );

          imageData.data[ i * 4 + 0 ] = rgb.r * 255.0;
          imageData.data[ i * 4 + 1 ] = rgb.g * 255.0;
          imageData.data[ i * 4 + 2 ] = rgb.b * 255.0;
          imageData.data[ i * 4 + 3 ] = 255;
        }
        context.putImageData( imageData, 0, 0 );
      } )();

      it.interfaceHbg = document.createElement( 'div' );
      it.setStyle( it.interfaceHbg, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: '0%',
        top: '0%',

        background: '#fff',
        borderRadius: '9999999px'
      } );

      it.interfaceHRing = document.createElement( 'div' );
      it.setStyle( it.interfaceHRing, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: '0%',
        top: '0%',

        background: '#222',
        borderRadius: '9999999px'
      } );

      it.interfaceS = document.createElement( 'canvas' );
      it.interfaceS.width = 128;
      it.interfaceS.height = 256;
      it.setStyle( it.interfaceS, {
        position: 'absolute',
        width: '50%',
        height: '100%',
        left: '0%',
        top: '0%',
        transformOrigin: '100%',

        borderRadius: '999999px 0px 0px 999999px'
      } );
      ( function() {
        let context = it.interfaceS.getContext( '2d' );
        let imageData = context.createImageData( 128, 256 );
        for ( let i = 0; i < 128 * 256; i ++ ) {
          let rgb = it.hsltorgb( {
            h: 0.0,
            s: Math.atan2( -( i % 128 ) + 128, Math.floor( i / 128 ) - 128 ) / Math.PI,
            l: 0.5
          } );

          imageData.data[ i * 4 + 0 ] = rgb.r * 255.0;
          imageData.data[ i * 4 + 1 ] = rgb.g * 255.0;
          imageData.data[ i * 4 + 2 ] = rgb.b * 255.0;
          imageData.data[ i * 4 + 3 ] = 255;
        }
        context.putImageData( imageData, 0, 0 );
      } )();

      it.interfaceSbg = document.createElement( 'div' );
      it.interfaceSbg.width = 128;
      it.interfaceSbg.height = 256;
      it.setStyle( it.interfaceSbg, {
        position: 'absolute',
        width: '50%',
        height: '100%',
        left: '0%',
        top: '0%',
        transformOrigin: '100%',

        background: '#fff',
        borderRadius: '999999px 0px 0px 999999px'
      } );

      it.interfaceL = document.createElement( 'canvas' );
      it.interfaceL.width = 128;
      it.interfaceL.height = 256;
      it.setStyle( it.interfaceL, {
        position: 'absolute',
        width: '50%',
        height: '100%',
        left: '50%',
        top: '0%',
        transformOrigin: '0%',

        background: '#f00',
        borderRadius: '0px 999999px 999999px 0px'
      } );
      ( function() {
        let context = it.interfaceL.getContext( '2d' );
        let imageData = context.createImageData( 128, 256 );
        for ( let i = 0; i < 128 * 256; i ++ ) {
          let phase = Math.atan2( i % 128, Math.floor( i / 128 ) - 128 ) / Math.PI;
          let color = phase < 0.5 ? 0 : 255;
          let alpha = 255 * ( Math.abs( phase - 0.5 ) * 2.0 );

          imageData.data[ i * 4 + 0 ] = color;
          imageData.data[ i * 4 + 1 ] = color;
          imageData.data[ i * 4 + 2 ] = color;
          imageData.data[ i * 4 + 3 ] = alpha;
        }
        context.putImageData( imageData, 0, 0 );
      } )();

      it.interfaceLbg = document.createElement( 'div' );
      it.interfaceLbg.width = 128;
      it.interfaceLbg.height = 256;
      it.setStyle( it.interfaceLbg, {
        position: 'absolute',
        width: '50%',
        height: '100%',
        left: '50%',
        top: '0%',
        transformOrigin: '0%',

        borderRadius: '0px 999999px 999999px 0px'
      } );

      it.interfaceSLRing = document.createElement( 'div' );
      it.setStyle( it.interfaceSLRing, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: '0%',
        top: '0%',

        background: '#222',
        borderRadius: '9999999px'
      } );

      it.interfaceSLBorder = document.createElement( 'div' );
      it.setStyle( it.interfaceSLBorder, {
        position: 'absolute',
        width: '10%',
        height: '100%',
        left: '45%',
        top: '0%',

        background: '#222'
      } );

      it.operator = document.createElement( 'div' );
      it.setStyle( it.operator, {
        position: 'absolute',
        width: '200000%',
        height: '200000%',
        left: '-100000%',
        top: '-100000%',
        display: 'none'
      } );

      it.mother.appendChild( it.interfaceSLRing );
      it.mother.appendChild( it.interfaceLbg );
      it.mother.appendChild( it.interfaceSbg );
      it.mother.appendChild( it.interfaceL );
      it.mother.appendChild( it.interfaceS );
      it.mother.appendChild( it.interfaceSLBorder );
      it.mother.appendChild( it.interfaceHRing );
      it.mother.appendChild( it.interfaceHbg );
      it.mother.appendChild( it.interfaceH );
      it.mother.appendChild( it.buttonRing );
      it.mother.appendChild( it.button );
      it.mother.appendChild( it.operator );

      it.operateState = '';
      it.operator.addEventListener( 'mousedown', function( _event ) {
        _event.preventDefault();
        it.operate( _event.clientX, _event.clientY, 'down' );
      } );

      it.operator.addEventListener( 'mousemove', function( _event ) {
        _event.preventDefault();
        it.operate( _event.clientX, _event.clientY );
      } );

      it.operator.addEventListener( 'mouseup', function( _event ) {
        _event.preventDefault();
        it.operate( _event.clientX, _event.clientY, 'up' );
      } );

      it.operator.addEventListener( 'touchstart', function( _event ) {
        _event.preventDefault();
        if ( _event.touches.length === 1 ) {
          it.operate( _event.touches[ 0 ].clientX, _event.touches[ 0 ].clientY, 'down' );
        }
      } );

      it.operator.addEventListener( 'touchmove', function( _event ) {
        _event.preventDefault();
        it.operate( _event.touches[ 0 ].clientX, _event.touches[ 0 ].clientY );
      } );

      it.operator.addEventListener( 'touchend', function( _event ) {
        _event.preventDefault();
        it.operate( 0, 0, 'up' );
      } );

      it.textbox = document.createElement( 'input' );
      it.textbox.type = 'text';
      it.textbox.value = it.color.rgb;
      it.textbox.style.fontSize = it.size * 0.3 + 'px';
      it.textbox.style.textAlign = 'center';
      it.textbox.style.width = it.size * 1.8 + 'px';
      it.textbox.style.height = it.size * 0.6 + 'px';
      it.textbox.style.background = '#666';
      it.textbox.style.border = 'none';
      it.textbox.style.color = '#ddd';
      it.textbox.style.borderRadius = '4px';
      it.textbox.addEventListener( 'keydown', function( _e ) {
        if ( _e.which === 13 ) { it.setHex( it.textbox.value ) };
      } );

      it.update();
    }

    setStyle( _element, _object ) {
      for ( let prop in _object ) {
        _element.style[ prop ] = _object[ prop ];
      }
    }

    operate( _x, _y, _type ) {
      let it = this;

      let rect = it.mother.getBoundingClientRect();
      let x = ( _x - it.size / 2.0 - rect.left );
      let y = ( _y - it.size / 2.0 - rect.top );

      if ( _type === 'down' ) {
        let l = Math.sqrt( x * x + y * y );
          //alert( l + ' , ' + it.size + ' , ' + it.operateState );
        if ( l < it.size * 0.4 ) {
          it.open = false;
          it.mother.style.zIndex = 'auto';
          it.operator.style.display = 'none';
        } else if ( l < it.size * 0.8 ) {
          it.operateState = 'h';
        } else if ( l < it.size * 1.2 ) {
          if ( x < 0 ) {
            it.operateState = 's';
          } else {
            it.operateState = 'l';
          }
        } else {
          it.open = false;
          it.mother.style.zIndex = 'auto';
          it.operator.style.display = 'none';
        }
      } else if ( _type === 'up' ) {
        it.operateState = '';
      }

      if ( it.operateState === 'h' ) {
        it.color.h = ( Math.atan2( y, x ) / Math.PI / 2.0 + 1.0 ) % 1.0;
        it.change();
      } else if ( it.operateState === 's' ) {
        it.color.s = Math.min( Math.max( ( ( Math.atan2( y, x ) / Math.PI / 2.0 + 1.0 ) % 1.0 ) * 2.0 - 0.5, 0.0 ), 1.0 );
        it.change();
      } else if ( it.operateState === 'l' ) {
        it.color.l = Math.min( Math.max( ( ( Math.atan2( y, -x ) / Math.PI / 2.0 + 1.0 ) % 1.0 ) * 2.0 - 0.5, 0.0 ), 1.0 );
        it.change();
      }
    }

    update() {
      let it = this;

      if ( it.open ) {
        it.openAni += ( 1.0 - it.openAni ) * 0.2;
      } else {
        it.openAni += ( 0.0 - it.openAni ) * 0.2;
      }

      let o1 = Math.sqrt( it.openAni );
      let o2 = it.openAni;
      let o3 = o1 * o2;
      let o4 = o2 * o2;
      let o5 = o1 * o4;

      it.button.style.transform = 'scale( ' + ( 0.8 - 0.2 * o5 ) + ' )';
      it.buttonRing.style.transform = 'scale( ' + ( 1.0 - 0.2 * o5 ) + ' )';
      it.interfaceH.style.transform = 'scale( ' + ( o4 * 1.4 ) + ')';
      it.interfaceHbg.style.transform = 'scale( ' + ( o4 * 1.4 ) + ')';
      it.interfaceHRing.style.transform = 'scale( ' + ( o3 * 1.6 ) + ')';
      it.interfaceS.style.transform = 'scale( ' + ( o2 * 2.2 ) + ')';
      it.interfaceSbg.style.transform = 'scale( ' + ( o2 * 2.2 ) + ')';
      it.interfaceL.style.transform = 'scale( ' + ( o2 * 2.2 ) + ')';
      it.interfaceLbg.style.transform = 'scale( ' + ( o2 * 2.2 ) + ')';
      it.interfaceSLRing.style.transform = 'scale( ' + ( o1 * 2.4 ) + ')';
      it.interfaceSLBorder.style.transform = 'scale( 1, ' + ( o1 * 2.4 ) + ')';

      requestAnimationFrame( function() { it.update(); } );
    }

    setSize( _size ) {
      let it = this;

      it.size = _size;
      it.setStyle( it.mother, {
        width: it.size + 'px',
        height: it.size + 'px'
      } );
    }

    hsltorgb( _hsl ) {
      let c = ( 1.0 - Math.abs( _hsl.l * 2.0 - 1.0 ) ) * _hsl.s;
      let x = c * ( 1.0 - Math.abs( ( ( _hsl.h * 6.0 ) % 2.0 ) - 1.0 ) );

      let r, g, b;

      if ( _hsl.h < 1.0 / 6.0 ) { r = c; g = x; b = 0; }
      else if ( _hsl.h < 2.0 / 6.0 ) { r = x; g = c; b = 0; }
      else if ( _hsl.h < 3.0 / 6.0 ) { r = 0; g = c; b = x; }
      else if ( _hsl.h < 4.0 / 6.0 ) { r = 0; g = x; b = c; }
      else if ( _hsl.h < 5.0 / 6.0 ) { r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }

      let m = _hsl.l - c / 2.0;
      return {
        r: r + m,
        g: g + m,
        b: b + m
      };
    }

    getHex( _hsl ) {
      let it = this;

      let rgb = it.hsltorgb( _hsl );

      let hex = function( _i ) {
        return Math.round( _i * 255 ).toString( 16 ).replace( /^.$/, '0$&' );
      }

      return '#' + hex( rgb.r ) + hex( rgb.g ) + hex( rgb.b );
    }

    setHex( _hex ) {
      let it = this;

      let r = parseInt( _hex.substring( 1, 3 ), 16 ) / 255.0;
      let g = parseInt( _hex.substring( 3, 5 ), 16 ) / 255.0;
      let b = parseInt( _hex.substring( 5, 7 ), 16 ) / 255.0;

      if ( isNaN( r ) || isNaN( g ) || isNaN( b ) ) {
        it.change();
        return;
      }

      let cMin = Math.min( Math.min( r, g ), b );
      let cMax = Math.max( Math.max( r, g ), b );
      let cDelta = cMax - cMin;

      it.color.l = ( cMin + cMax ) / 2.0;

      if ( cDelta === 0 ) {
        it.color.s = 0;
        it.color.h = 0;
      } else {
        it.color.s = cDelta / ( 1.0 - Math.abs( it.color.l * 2.0 - 1.0 ) );
        if ( r === cMax ) { it.color.h = ( ( ( ( g - b ) / cDelta ) + 6.0 ) % 6.0 ) / 6.0; }
        else if ( g === cMax ) { it.color.h = ( ( ( b - r ) / cDelta ) + 2.0 ) / 6.0; }
        else { it.color.h = ( ( ( r - g ) / cDelta ) + 4.0 ) / 6.0; }
      }

      it.change();
    }

    hslString( _hsl ) {
      let str = 'hsl( ';
      str += Math.floor( _hsl.h * 360.0 ) + ', ';
      str += Math.floor( _hsl.s * 100.0 ) + '%, ';
      str += Math.floor( _hsl.l * 100.0 ) + '% )';
      return str;
    }

    change( _e ) {
      let it = this;

      it.color.hsl = it.hslString( it.color );
      it.button.style.background = it.color.hsl;

      it.color.rgb = it.getHex( it.color );
      it.textbox.value = it.color.rgb;

      let finv = 'invert( ' + ( 1.0 - it.color.s ) * 0.5 + ') ';
      let fhue = 'hue-rotate( ' + it.color.h * 360.0 + 'deg ) ';

      it.interfaceH.style.filter = finv;
      it.interfaceH.style.webkitFilter = finv;
      it.interfaceH.style.opacity = ( 1.0 - Math.abs( it.color.l - 0.5 ) * 2.0 );
      it.interfaceHbg.style.background = 0.5 < it.color.l ? '#fff' : '#000';

      it.interfaceS.style.filter = fhue;
      it.interfaceS.style.webkitFilter = fhue;
      it.interfaceS.style.opacity = ( 1.0 - Math.abs( it.color.l - 0.5 ) * 2.0 );
      it.interfaceSbg.style.background = 0.5 < it.color.l ? '#fff' : '#000';

      it.interfaceL.style.background = it.hslString( {
        h: it.color.h,
        s: it.color.s,
        l: 0.5
      } );

      if ( typeof it.onChange === 'function' ) { it.onChange( it.color ); }
    }

    canvasMouseDown( _e ) {
      let it = this;

      let rect = it.canvas.getBoundingClientRect();
      it.position.x = ( rect.left + it.size * 0.5 );
      it.position.y = ( rect.top + it.size * 0.5 );
      it.open = true;
      it.clickState = 'open';
    }

  };

  return ColorPicker;

} )();

if ( typeof module !== 'undefined' && module.exportsbsbs ) { module.exports = ColorPicker; }
