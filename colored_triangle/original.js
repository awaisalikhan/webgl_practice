function main() {
	const canvas = document.querySelector('#glCanvas');
	// Initialize the GL context

	const gl = canvas.getContext('webgl2');

	// If we don't have a GL context, give up now
	// Only continue if WebGL is available and working

	if (!gl) {
		alert(
			'Unable to initialize WebGL. Your browser or machine may not support it.'
		);
		return;
	}

	// Vertex Shader Source Code

	const verShaderSource = `#version 300 es
	in vec4 a_position;
	void main() {
		gl_Position = vec4(a_position);
	}
	`;

	// Fragment Shader Source
	const fragShaderSource = `#version 300 es
	precision highp float;
 
	out vec4 outColor;
	void main() {
		outColor = vec4(1.0, 2.0, 0.5, 1.0);
	}
	`;

	// Here we are creating the two vertex shaders
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, verShaderSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);

	// Here we are creating the program

	const program = createProgram(gl, vertexShader, fragmentShader);

	// Here we are finding the attribute to which we will supply data for the vertex

	const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

	// Here we are creating a buffer that will supply the data to various varibles of shader programs

	const positionBuffer = gl.createBuffer();

	// This is a global bind point, through this other function have access to the resources which have bound to this point

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Here we are creating a data for feedding into the buffer that we have just created

	const positions = [0, 0, 0, 0.5, 0.7, 0];

	// This is the actual position, where we load data into our buffer

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	// This creates a vertex array object, that is used to tell the attribute to how to load data from the buffer

	const vao = gl.createVertexArray();

	// Next we find the vertex array buffer

	gl.bindVertexArray(vao);

	// Here we are enabling the vertex attribute arrays

	gl.enableVertexAttribArray(positionAttributeLocation);

	// Here we are actual pulling data from the buffer into the attribue location

	const size = 2;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;

	gl.vertexAttribPointer(
		positionAttributeLocation,
		size,
		type,
		normalize,
		stride,
		offset
	);

	// Here we converting the data of position vertex from clip space to screenspace

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Here we are telling webgl which program to execute

	gl.useProgram(program);

	gl.bindVertexArray(vao);

	// Finally we tell webgl to execute our program

	const primeType = gl.TRIANGLES;
	const drawOffset = 0;
	const count = 3;
	gl.drawArrays(primeType, drawOffset, count);
}

// This function creates, and compiles the shader

function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	const sucess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

	if (sucess) {
		return shader;
	}

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

// This function creates the program

function createProgram(gl, verSh, fragSh) {
	const program = gl.createProgram();
	gl.attachShader(program, verSh);
	gl.attachShader(program, fragSh);
	gl.linkProgram(program);

	const sucess = gl.getProgramParameter(program, gl.LINK_STATUS);

	if (sucess) {
		return program;
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

main();
