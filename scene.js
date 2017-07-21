// UCLA's Graphics Example Code (Javascript and C++ translations available), by Garett Ridge for CS174a.
// example-displayables.js - The subclass definitions here each describe different independent animation processes that you want to fire off each frame, by defining a display
// event and how to react to key and mouse input events.  Make one or two of your own subclasses, and fill them in with all your shape drawing calls and any extra key / mouse controls.

// Now go down to Example_Animation's display() function to see where the sample shapes you see drawn are coded, and a good place to begin filling in your own code.

Declare_Any_Class( "Debug_Screen",  // Debug_Screen - An example of a displayable object that our class Canvas_Manager can manage.  Displays a text user interface.
  { 'construct': function( context )
      { this.define_data_members( { string_map: context.shared_scratchpad.string_map, start_index: 0, tick: 0, visible: false, graphicsState: new Graphics_State() } );
        shapes_in_use.debug_text = new Text_Line( 35 );
      },
    'init_keys': function( controls )
      { controls.add( "t",    this, function() { this.visible ^= 1;                                                                                                             } );
        controls.add( "up",   this, function() { this.start_index = ( this.start_index + 1 ) % Object.keys( this.string_map ).length;                                           } );
        controls.add( "down", this, function() { this.start_index = ( this.start_index - 1   + Object.keys( this.string_map ).length ) % Object.keys( this.string_map ).length; } );
        this.controls = controls;
      },
    'update_strings': function( debug_screen_object )   // Strings that this displayable object (Debug_Screen) contributes to the UI:
      { debug_screen_object.string_map["tick"]              = "Frame: " + this.tick++;
        debug_screen_object.string_map["text_scroll_index"] = "Text scroll index: " + this.start_index;
      },
    'display': function( time )
      { if( !this.visible ) return;

        shaders_in_use["Default"].activate();
        gl.uniform4fv( g_addrs.shapeColor_loc, Color( .8, .8, .8, 1 ) );

        var font_scale = scale( .02, .04, 1 ),
            model_transform = mult( translation( -.95, -.9, 0 ), font_scale ),
            strings = Object.keys( this.string_map );

        for( var i = 0, idx = this.start_index; i < 4 && i < strings.length; i++, idx = (idx + 1) % strings.length )
        {
          shapes_in_use.debug_text.set_string( this.string_map[ strings[idx] ] );
          shapes_in_use.debug_text.draw( this.graphicsState, model_transform, true, vec4(0,0,0,1) );  // Draw some UI text (strings)
          model_transform = mult( translation( 0, .08, 0 ), model_transform );
        }
        model_transform = mult( translation( .7, .9, 0 ), font_scale );
        shapes_in_use.debug_text.set_string( "Controls:" );
        shapes_in_use.debug_text.draw( this.graphicsState, model_transform, true, vec4(0,0,0,1) );    // Draw some UI text (controls title)

        for( let k of Object.keys( this.controls.all_shortcuts ) )
        {
          model_transform = mult( translation( 0, -0.08, 0 ), model_transform );
          shapes_in_use.debug_text.set_string( k );
          shapes_in_use.debug_text.draw( this.graphicsState, model_transform, true, vec4(0,0,0,1) );  // Draw some UI text (controls)
        }
      }
  }, Animation );

Declare_Any_Class( "Example_Camera",     // An example of a displayable object that our class Canvas_Manager can manage.  Adds both first-person and
  { 'construct': function( context )     // third-person style camera matrix controls to the canvas.
      { // 1st parameter below is our starting camera matrix.  2nd is the projection:  The matrix that determines how depth is treated.  It projects 3D points onto a plane.
        context.shared_scratchpad.graphics_state = new Graphics_State( translation(0, 0,-25), perspective(45, canvas.width/canvas.height, .1, 1000), 0 );
        this.define_data_members( { graphics_state: context.shared_scratchpad.graphics_state, thrust: vec3(), origin: vec3( 0, 5, 0 ), looking: false, heading: 0, pitch: 0, n: 1 } );

        // *** Mouse controls: ***
        // this.mouse = { "from_center": vec2() };
        // var mouse_position = function( e ) { return vec2( e.clientX - canvas.width/2, e.clientY - canvas.height/2 ); };   // Measure mouse steering, for rotating the flyaround camera.
        // canvas.addEventListener( "mouseup",   ( function(self) { return function(e) { e = e || window.event;    self.mouse.anchor = undefined;              } } ) (this), false );
        // canvas.addEventListener( "mousedown", ( function(self) { return function(e) { e = e || window.event;    self.mouse.anchor = mouse_position(e);      } } ) (this), false );
        // canvas.addEventListener( "mousemove", ( function(self) { return function(e) { e = e || window.event;    self.mouse.from_center = mouse_position(e); } } ) (this), false );
        // canvas.addEventListener( "mouseout",  ( function(self) { return function(e) { self.mouse.from_center = vec2(); }; } ) (this), false );    // Stop steering if the mouse leaves the canvas.
      },
    'init_keys': function( controls )   // init_keys():  Define any extra keyboard shortcuts here
      { controls.add("1", this, function() {this.n = 1;}, {'type':'keyup'});
        controls.add("2", this, function() {this.n = 2;}, {'type':'keyup'});
        controls.add("3", this, function() {this.n = 3;}, {'type':'keyup'});
        controls.add("4", this, function() {this.n = 4;}, {'type':'keyup'});
        controls.add("5", this, function() {this.n = 5;}, {'type':'keyup'});
        controls.add("6", this, function() {this.n = 6;}, {'type':'keyup'});
        controls.add("7", this, function() {this.n = 7;}, {'type':'keyup'});
        controls.add("8", this, function() {this.n = 8;}, {'type':'keyup'});
        controls.add("9", this, function() {this.n = 9;}, {'type':'keyup'});

        controls.add( "q",     this, function() { this.thrust[1] =  -this.n; } );     controls.add( "q",     this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "e",     this, function() { this.thrust[1] =  this.n; } );     controls.add( "e",     this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "w",     this, function() { this.thrust[2] =  this.n; } );     controls.add( "w",     this, function() { this.thrust[2] =  0; }, {'type':'keyup'} );
        controls.add( "a",     this, function() { this.thrust[0] =  this.n; } );     controls.add( "a",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        controls.add( "s",     this, function() { this.thrust[2] = -this.n; } );     controls.add( "s",     this, function() { this.thrust[2] =  0; }, {'type':'keyup'} );
        controls.add( "d",     this, function() { this.thrust[0] = -this.n; } );     controls.add( "d",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        
        controls.add("left", this, function() {this.heading = -this.n % 360;});   controls.add("left", this, function() {this.heading = 0;}, {'type':'keyup'}); 
        controls.add("right", this, function() {this.heading = this.n % 360;});   controls.add("right", this, function() {this.heading = 0;}, {'type':'keyup'});
        controls.add("up", this, function() {this.pitch = -this.n % 360;});        controls.add("up", this, function() {this.pitch = 0;}, {'type':'keyup'}); 
        controls.add("down", this, function() {this.pitch = this.n % 360;});     controls.add("down", this, function() {this.pitch = 0;}, {'type':'keyup'});
        controls.add( ",",     this, function() { this.graphics_state.camera_transform = mult( rotation( this.n, 0, 0, 1 ), this.graphics_state.camera_transform ); } );
        controls.add( ".",     this, function() { this.graphics_state.camera_transform = mult( rotation( this.n, 0, 0, -1 ), this.graphics_state.camera_transform ); } );
        controls.add( "o",     this, function() { this.origin = mult_vec( inverse( this.graphics_state.camera_transform ), vec4(0,0,0,1) ).slice(0,3)         ; } );
        controls.add( "r",     this, function() { this.graphics_state.camera_transform = mat4()                                                               ; } );
      },
    'update_strings': function( user_interface_string_manager )       // Strings that this displayable object (Animation) contributes to the UI:
      { var C_inv = inverse( this.graphics_state.camera_transform ), pos = mult_vec( C_inv, vec4( 0, 0, 0, 1 ) ),
                                                                  z_axis = mult_vec( C_inv, vec4( 0, 0, 1, 0 ) );                                                                 
        user_interface_string_manager.string_map["origin" ] = "Center of rotation: " + this.origin[0].toFixed(0) + ", " + this.origin[1].toFixed(0) + ", " + this.origin[2].toFixed(0);                                                       
        user_interface_string_manager.string_map["cam_pos"] = "Cam Position: " + pos[0].toFixed(2) + ", " + pos[1].toFixed(2) + ", " + pos[2].toFixed(2);    // The below is affected by left hand rule:
        user_interface_string_manager.string_map["facing" ] = "Facing: "       + ( ( z_axis[0] > 0 ? "West " : "East ") + ( z_axis[1] > 0 ? "Down " : "Up " ) + ( z_axis[2] > 0 ? "North" : "South" ) );
      },
    'display': function( time )
      { var leeway = 70,  degrees_per_frame = .0004 * this.graphics_state.animation_delta_time,
                          meters_per_frame  =   .01 * this.graphics_state.animation_delta_time;
        // Third-person camera mode: Is a mouse drag occurring?
        // if( this.mouse.anchor )
        // {
        //   var dragging_vector = subtract( this.mouse.from_center, this.mouse.anchor );            // Arcball camera: Spin the scene around the world origin on a user-determined axis.
        //   if( length( dragging_vector ) > 0 )
        //     this.graphics_state.camera_transform = mult( this.graphics_state.camera_transform,    // Post-multiply so we rotate the scene instead of the camera.
        //         mult( translation( this.origin ),
        //         mult( rotation( .05 * length( dragging_vector ), dragging_vector[1], dragging_vector[0], 0 ),
        //               translation(scale_vec( -1, this.origin ) ) ) ) );
        // }
        // First-person flyaround mode:  Determine camera rotation movement when the mouse is past a minimum distance (leeway) from the canvas's center.
        // var offset_plus  = [ this.mouse.from_center[0] + leeway, this.mouse.from_center[1] + leeway ];
        // var offset_minus = [ this.mouse.from_center[0] - leeway, this.mouse.from_center[1] - leeway ];

        for( var i = 0; this.looking && i < 2; i++ )      // Steer according to "mouse_from_center" vector, but don't start increasing until outside a leeway window from the center.
        {
          var velocity = ( ( offset_minus[i] > 0 && offset_minus[i] ) || ( offset_plus[i] < 0 && offset_plus[i] ) ) * degrees_per_frame;  // Use movement's quantity unless the &&'s zero it out
          this.graphics_state.camera_transform = mult( rotation( velocity, i, 1-i, 0 ), this.graphics_state.camera_transform );     // On X step, rotate around Y axis, and vice versa.
        }     // Now apply translation movement of the camera, in the newest local coordinate frame
        this.graphics_state.camera_transform = mult(rotation(this.heading, 0, 1, 0), this.graphics_state.camera_transform);
        this.graphics_state.camera_transform = mult(rotation(this.pitch, 1, 0, 0), this.graphics_state.camera_transform);
        this.graphics_state.camera_transform = mult( translation( scale_vec( meters_per_frame, this.thrust ) ), this.graphics_state.camera_transform );
      }
  }, Animation );

Declare_Any_Class( "Example_Animation",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      { this.shared_scratchpad    = context.shared_scratchpad;
        this.shared_scratchpad.animate = true;
      
        shapes_in_use.triangle        = new Triangle();                  // At the beginning of our program, instantiate all shapes we plan to use,
        shapes_in_use.strip           = new Square();                   // each with only one instance in the graphics card's memory.
        shapes_in_use.bad_tetrahedron = new Tetrahedron( false );      // For example we'll only create one "cube" blueprint in the GPU, but we'll re-use
        shapes_in_use.tetrahedron     = new Tetrahedron( true );      // it many times per call to display to get multiple cubes in the scene.
        shapes_in_use.windmill        = new Windmill( 10 );
        shapes_in_use.sphere         = new Sphere(15, 15, 1);
        shapes_in_use.cube            = new Cube(1);
        
        shapes_in_use.triangle_flat        = Triangle.prototype.auto_flat_shaded_version();
        shapes_in_use.strip_flat           = Square.prototype.auto_flat_shaded_version();
        shapes_in_use.bad_tetrahedron_flat = Tetrahedron.prototype.auto_flat_shaded_version( false );
        shapes_in_use.tetrahedron_flat          = Tetrahedron.prototype.auto_flat_shaded_version( true );
        shapes_in_use.windmill_flat             = Windmill.prototype.auto_flat_shaded_version( 10 );
        shapes_in_use.sphere_flat               = Sphere.prototype.auto_flat_shaded_version( 15, 15, 1 );

        textures_in_use.tex_poly = new Texture("tex-poly.jpg", false);

        this.define_data_members( {
          'CANVAS_HEIGHT': canvas.height,
          'CANVAS_WIDTH': canvas.width,
          'audioCtx': null,
          'analyser': null,
          'dataArray': null,
          'source': null
        });

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();

        var out = this; // make reference to this accessible through closure
        document.getElementById('audio_file').onchange = function(){
          var fileReader  = new FileReader;

          fileReader.onload = function(){
             var arrayBuffer = this.result;
          };

          fileReader.readAsArrayBuffer(this.files[0]);

          var url = URL.createObjectURL(this.files[0]); 
          audio_player.src = url; 
          
          // connect media source to analyser
          if(out.source === null) {
             out.source = out.audioCtx.createMediaElementSource(audio_player);
             out.source.connect(out.analyser);
             out.analyser.connect(out.audioCtx.destination);
          }
        };

        document.getElementById("btn_play").onclick = function() {
          audio_player.play(); console.log("play");
        };

        document.getElementById("btn_pause").onclick = function() {
          audio_player.pause();
        };

        document.getElementById("btn_stop").onclick = function() {
          audio_player.pause();
          audio_player.currentTime = 0;
        };
      },
    'init_keys': function( controls )   // init_keys():  Define any extra keyboard shortcuts here
      {
        controls.add( "ALT+g", this, function() { this.shared_scratchpad.graphics_state.gouraud       ^= 1; } );   // Make the keyboard toggle some
        controls.add( "ALT+n", this, function() { this.shared_scratchpad.graphics_state.color_normals ^= 1; } );   // GPU flags on and off.
        // controls.add( "ALT+a", this, function() { this.shared_scratchpad.animate                      ^= 1; } );
      },
    'update_strings': function( user_interface_string_manager )       // Strings that this displayable object (Animation) contributes to the UI:
      {
        user_interface_string_manager.string_map["time"]    = "Animation Time: " + Math.round( this.shared_scratchpad.graphics_state.animation_time )/1000 + "s";
        user_interface_string_manager.string_map["animate"] = "Animation " + (this.shared_scratchpad.animate ? "on" : "off") ;
      },
    'display': function(time)
      {
        var graphics_state  = this.shared_scratchpad.graphics_state,
            model_transform = mat4();             // We have to reset model_transform every frame, so that as each begins, our basis starts as the identity.
        shaders_in_use[ "Default" ].activate();

        // *** Lights: *** Values of vector or point lights over time.  Arguments to construct a Light(): position or vector (homogeneous coordinates), color, size
        // If you want more than two lights, you're going to need to increase a number in the vertex shader file (index.html).  For some reason this won't work in Firefox.
        graphics_state.lights = [];                    // First clear the light list each frame so we can replace & update lights.

        var t = graphics_state.animation_time/1000, light_orbit = [ Math.cos(t), Math.sin(t) ];
        graphics_state.lights.push( new Light( vec4(  0,  0,  -65*light_orbit[0], 1 ), Color( 240/255, 220/255, 240/255, 1 ), 100000000 ) );
        // graphics_state.lights.push( new Light( vec4( -10*light_orbit[0], -20*light_orbit[1], -14*light_orbit[0], 0 ), Color( 1, 1, .3, 1 ), 100*Math.cos( t/10 ) ) );

        // *** Materials: *** Declare new ones as temps when needed; they're just cheap wrappers for some numbers.
        // 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
        var lightBlue = new Material( Color(116/255, 209/255, 234/255, 1), .4, .2, .4, 40, "tex_poly");

        /**********************************
        DRAW LOGIC
        **********************************/                                     

        var SPACER_WIDTH = 5;
        var BAR_WIDTH = 5;
        var OFFSET = 10;
        var numBars = Math.round(this.CANVAS_WIDTH / 20);
        var model_transform_stack = [];

        this.analyser.fftSize = 256; // decrease Fast Fourier Transform size to reduce drawing
        var freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(freqByteData);

        model_transform = mult(model_transform, translation(-100, -15, -255));
        model_transform_stack.push(model_transform);

        if(freqByteData[OFFSET] !== 0) {
          for (var i = 0; i < numBars; ++i) {
            var magnitude = freqByteData[i + OFFSET]/8; // scale down magnitude to improve performance (render less geometry)
            
            model_transform = model_transform_stack.pop();
            model_transform = mult( model_transform, translation( SPACER_WIDTH, 0, 0 ) );
            model_transform_stack.push(model_transform);

            // draw a shape for an 8th of the magnitude
            for (var j = 0; j < magnitude; j++) {
              model_transform = mult( model_transform, translation( 0, 2, 0 ) );
              if(j % 2 == 0) {
                shapes_in_use.sphere_flat.draw( graphics_state, model_transform, lightBlue );
              } else {
                shapes_in_use.sphere.draw( graphics_state, model_transform, lightBlue );
              }
            }
          }
        }
      }
  }, Animation );