function main() {
	// Getting a reference to the canvas of html

	const canvas = document.querySelector('#glCanvas');

	// Getting a handle to the WebGL Context throught the canvas

	const gl = canvas.getContext('webgl2');

	if (!gl) {
		alert('Could not get a reference to the WebGL Context');
	}

	// This code  is used to set the canvas size
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.viewport(0, 0, canvas.width, canvas.height);

	// This is the source for the vertex shader
	const vertexShaderSource = `#version 300 es
    precision highp float;
    in vec2 a_position;
    in vec3 a_vertexColor;
    out vec4 v_FragColor;
    void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_FragColor = vec4(a_vertexColor, 1.0);        
    }
    `;
	// This is the source for the fragment shader

	const fragmentShaderSource = `#version 300 es
    precision highp float;
    in vec4 v_FragColor;
    out vec4 v_FragColorFinal;
    void main() {
        v_FragColorFinal = vec4(v_FragColor);
    }
    `;

	// Here we are creating the vertex shader and fragment shaders

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = createShader(
		gl,
		gl.FRAGMENT_SHADER,
		fragmentShaderSource
	);

	// Here we are creating the program for the vertex and fragment shaders

	const program = createProgram(gl, vertexShader, fragmentShader);

	// Now we need some data for the program

	const triangleVertex = [0, 1, -1, 0, 1, 0];

	// Decalaring a buffer the for data

	const vertexBuffer = gl.createBuffer();

	// Binding the buffer

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Now we are actually loading the data into the buffer

	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(triangleVertex),
		gl.STATIC_DRAW
	);

	// Getting a reference to the attribute of the vertex shader where we want to load the data

	const attributePointLocation = gl.getAttribLocation(program, 'a_position');

	// Here we have to enable the attribute, as i think the are disables by default

	// Write descripiton here

	gl.vertexAttribPointer(
		attributePointLocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT,
		0
	);

	const triangleColor = [1.0, 0.0, 0.0, 0.0, 1.0, 0, 0, 0.0, 0.0, 1.0];

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(triangleColor),
		gl.STATIC_DRAW
	);

	const attributeColorLocation = gl.getAttribLocation(program, 'a_vertexColor');

	gl.vertexAttribPointer(
		attributeColorLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT,
		0
	);

	gl.enableVertexAttribArray(attributePointLocation);
	gl.enableVertexAttribArray(attributeColorLocation);
	// Here we are telling WebGL, which program we want to use

	gl.useProgram(program);

	// Here are drawing the triangle

	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// This function create a shader and returns it

function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	}

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

// This function creates a program for the shaders

function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
		return program;
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

window.load = main();
