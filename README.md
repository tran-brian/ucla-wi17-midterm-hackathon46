# midterm-hackathon46

## Concept:
Audio frequency visualizer (bar graph) using WebGL and the Web Audio API

## Instructions:
An audio file must first be loaded using the provided file chooser input. A few sample files have been included under "/Common/audio". Then, please press the "Play" button to start the playback and visualization. Please look at the controls section below for other functionality.

## Controls:
#### (AFTER LOADING AN AUDIO FILE)
* "Play" button: Start audio playback 
* "Pause" button: Pause audio playback
* "Stop" button: Stop audio playback
* 1-9: Adjust unit (n) for movement and degree of rotation
* w: Move forward by n
* a: Move left by n
* s: Move backward by n
* d: Move right by n
* q: Move up (along y-axis) by n
* e: Move down (along y-axis) by n
* left: Adjust heading to the left by n
* right: Adjust heading to the right by n
* up: Adjust pitch up by n
* down: Adjust pitch down by n
* , (comma): Adjusts yaw right
* . (period): Adjusts yaw left
* r: Reset camera view
* t/F5: Toggle debug
* Alt+g: Turn on gourand shading for vertices
* Alt+n: Turn on shading based on normals

## Notes:
* Only one point light is in scene
* Spheres are textured 
* Even-numbered spheres are flat-shaded
* Odd-numbered spheres are smooth-shaded
* You may load another file during playback, but you will have to press "Play" again, to start the playback.
