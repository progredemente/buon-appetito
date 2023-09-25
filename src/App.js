import React, { Component } from 'react';
import './App.css';
import { GIFEncoder } from './GIFEncoder';
import { Icon } from 'components/Icon';

class App extends Component {

    constructor(props){
        super(props);
        this.isSpanish = navigator.language.toLowerCase().startsWith("es");
        this.state = {
            loaded: false,
            gif: null,
            flag: null
        }
        this.scaleFactor = .25;
        this.side = 1500;
        this.img = null;
    }

    componentDidMount(){
        this.img = new Image();
        this.img.src = './buon_appetito.png';
        this.img.onload = () => {
            this.setState({loaded: true});
            this.create();
        }
    }

    create() {
        let encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setDelay(150);
        encoder.start();
        let canvas = document.createElement('canvas');
        canvas.width = this.side * this.scaleFactor;
        canvas.height = this.side * this.scaleFactor;
        let context = canvas.getContext('2d');
        this.clear(context);
        this.draw(0, context);
        encoder.addFrame(context);
        this.clear(context);
        this.draw(1, context);
        encoder.addFrame(context);
        this.clear(context);
        this.draw(2, context);
        encoder.addFrame(context);

        encoder.finish();
        let binaryGif = encoder.stream().getData();
        this.setState({ gif: `data:image/gif;base64,${window.btoa(binaryGif)}`})
    }

    drawFlag(context, bezierCurve) {
        const imgW = this.side * this.scaleFactor * .5;
        const imgH = this.side * this.scaleFactor * .20;

        function getBezierAt(bezier, position){
            let a = (1 - position); 
            let c = position * position; 
            let b = 3 * a * a * position; 
            let b1 = 3 * c * a; 
            a = a*a*a;
            c *= position;
            return {
                x: bezier.p1.x * a + bezier.cp1.x * b + bezier.cp2.x * b1 + bezier.p2.x * c,
                y: bezier.p1.y * a + bezier.cp1.y * b + bezier.cp2.y * b1 + bezier.p2.y * c
            };
        };

        function tangentAt(bezier, position) {  // returns the normalised tangent at position
            let a  = (1 - position)
            let b  = 6 * a * position;        // (6*(1-t)*t)
            a *= 3 * a;                  // 3 * ( 1 - t) ^ 2
            let c  = 3 * position * position; // 3 * t ^ 2
            let tng = {
                x: -bezier.p1.x * a + bezier.cp1.x * (a - b) + bezier.cp2.x * (b - c) + bezier.p2.x * c,
                y: -bezier.p1.y * a + bezier.cp1.y * (a - b) + bezier.cp2.y * (b - c) + bezier.p2.y * c
            }
            var u = Math.sqrt(tng.x * tng.x + tng.y * tng.y);
            tng.x /= u;
            tng.y /= u;
            return tng;
        }

        // Creates a mesh with texture coords for webGL to render
        function createBezierMesh(bezier, tHeight){
            var bezierMesh = [];
            var step = 1 / 50;
            for(var i = 0; i < 1 + step / 2; i += step){
                if(i > 1){  // sometimes there is a slight error
                    i = 1;
                }
                let curvePos = getBezierAt(bezier,i);
                let tng = tangentAt(bezier,i);
                bezierMesh.push({
                    x: curvePos.x - tng.y * (tHeight/2),
                    y: curvePos.y + tng.x * (tHeight/2),
                    tx: i,
                    ty: 0
                },{
                    x: curvePos.x + tng.y * (tHeight/2),
                    y: curvePos.y - tng.x * (tHeight/2),
                    tx: i,
                    ty: 1
                });
            }
            return bezierMesh;
        }

        function createShaders(){
            var fShaderSrc = ` 
                precision mediump float; 
                uniform sampler2D image;  // texture to draw  
                varying vec2 texCoord;   // holds text coordinates
                void main() {
                gl_FragColor = texture2D(image,texCoord);
                }`;
            var vShaderSrc = `
                attribute vec4 vert;     // holds a vert with pos as xy textures as zw
                varying vec2 texCoord;   // holds text coordinates
                void main(){
                    gl_Position = vec4(vert.x,vert.y,0.0,1.0); // seperate out the position
                    texCoord = vec2(vert.z,vert.w);        // and texture coordinate
                }`;
            var fShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fShader, fShaderSrc);
            gl.compileShader(fShader);
            var vShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vShader, vShaderSrc);
            gl.compileShader(vShader);
            var program = gl.createProgram();
            gl.attachShader(program, fShader);
            gl.attachShader(program, vShader);
            gl.linkProgram(program);
            gl.useProgram(program);    
            program.vertAtr = gl.getAttribLocation(program, "vert"); // save location of verts
            gl.enableVertexAttribArray(program.vertAtr);    // turn em on
            return program;
        }
        function createTextureFromImage(image){
            var texture = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.bindTexture(gl.TEXTURE_2D, null);    
            return texture;
        }
        function createMesh(array,vertSize) {
            var meshBuf ;
            var w = gl.canvas.width;
            var h = gl.canvas.height;
            var verts = [];
            for(var i = 0; i < array.length; i += 1){
                var v = array[i];
                verts.push((v.x - w / 2) / w * 2 , -(v.y - h / 2) / h * 2, v.tx, v.ty);
            }
            verts = new Float32Array(verts);
            gl.bindBuffer(gl.ARRAY_BUFFER, meshBuf = gl.createBuffer());    
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
            meshBuf.vertSize = vertSize;
            meshBuf.numVerts = array.length ;  
            return {verts,meshBuf}
        }
        function drawMesh(mesh){
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    
            gl.useProgram(mesh.program);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.meshBuf);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.verts, gl.STATIC_DRAW);
            gl.vertexAttribPointer(mesh.program.vertAtr, mesh.meshBuf.vertSize, gl.FLOAT, false, 0, 0);    
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, mesh.texture);    
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, mesh.meshBuf.numVerts);
        }
        let can = document.createElement("canvas");
        can.width=this.side * this.scaleFactor;
        can.height=this.side * this.scaleFactor;
        let gl = can.getContext("webgl");
        gl.viewportWidth = can.width;
        gl.viewportHeight = can.height;
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        var glMesh = createMesh(createBezierMesh(bezierCurve, imgW), 4);
        glMesh.program = createShaders();
        glMesh.W = imgW;
        glMesh.H = imgH;
        glMesh.texture = createTextureFromImage(this.state.flag);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);    
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0,0,0,0);
        let bezierMesh = createBezierMesh(bezierCurve, imgH);
        var index = 0;
        var w = gl.canvas.width;
        var h = gl.canvas.height;    
        for(var i = 0; i < bezierMesh.length; i += 1){
            var v = bezierMesh[i];
            glMesh.verts[index ++] = (v.x - w / 2) / w * 2;
            glMesh.verts[index ++] = -(v.y - h / 2) / h * 2;
            glMesh.verts[index ++] = v.tx;
            glMesh.verts[index ++] = v.ty;
        }    
        drawMesh(glMesh);
        context.drawImage(can,0,0);
    }

    
    draw(frameNumber, context) {
        var bezierCurve = {};
        bezierCurve.p1 = {x : 220, y : 140};
        bezierCurve.p2 = {x : 100, y : 300};
        bezierCurve.cp1 = {x : 150, y : 140};
        bezierCurve.cp2 = {x : 200, y : 300};
        if(this.state.flag) {
            if(frameNumber === 1){
                bezierCurve.p1 = {x : 215, y : 130};
                bezierCurve.cp1 = {x : 145, y : 160};
            }
            else if(frameNumber === 2) {
                bezierCurve.p1 = {x : 220, y : 150};
                bezierCurve.cp1 = {x : 150, y : 150};
            }
            this.drawFlag(context, bezierCurve);
        }
        context.drawImage(this.img, this.side * frameNumber, 0, this.side, this.side, 0, 0, this.side * this.scaleFactor, this.side * this.scaleFactor);
        this.drawUrl(context);
    }

    drawUrl(context) {
        context.font = `${80 * this.scaleFactor}px ComicTypo`;
        context.textAlign = "center";
        context.fillStyle = "rgba(0, 0, 0, .5)";
        context.fillText("progredemente.com/buon-appetito", this.side * this.scaleFactor / 2 , 70 * this.scaleFactor);
    }

    clear(context) {
        context.fillStyle = "white";
        context.fillRect(0, 0, this.side * this.scaleFactor, this.side * this.scaleFactor);
    }

    download() {
        let link = document.createElement('a');
        link.download = 'buon_appetito.gif';
        link.href = this.state.gif;
        link.click();
    }

    upload() {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg';
        input.onchange = () => {
            let fr = new FileReader();
            fr.addEventListener('load', (e) => {
                let flag = new Image();
                flag.src = e.target.result;
                flag.onload = () => {
                    this.setState({flag}, this.create);
                }
            });
            fr.readAsDataURL(input.files[0]);
        }
        input.click();
    }

    render() {
        return (
            <>
                {
                    !this.state.loaded &&
                    <div className="loading">
                        <img src={`${process.env.RESOURCES_URL}/buon_appetito.png`} alt="Cargando" />
                            {
                                this.isSpanish && 
                                <>
                                Cargando
                                </>
                            }
                            {
                                !this.isSpanish && 
                                <>
                                Loading
                                </>
                            }
                    </div>
                }
                {
                    this.state.loaded && this.state.gif &&
                    <div className="app">
                        <div
                            className="title"
                        >
                            <img
                                src="./buon_appetito.png"
                                alt="Buon Appetito"
                            />
                            <div>
                                {
                                    this.isSpanish && 
                                    <>
                                    por
                                    </>
                                }
                                {
                                    !this.isSpanish && 
                                    <>
                                    by
                                    </>
                                } <a href="/" target="_blank">progredemente</a></div>
                        </div>
                        <img
                            src={this.state.gif}
                            alt="gif"
                            className="gif"
                        />
                        <div className="buttons">
                            <div
                                className="button"
                                onClick={() => {
                                    this.upload()
                                }}
                            >
                                {
                                    this.isSpanish && 
                                    <>
                                    Elegir&nbsp;bandera&nbsp;
                                    </>
                                }
                                {
                                    !this.isSpanish && 
                                    <>
                                    Choose&nbsp;a&nbsp;flag&nbsp;
                                    </>
                                }
                                <Icon icon="🏳️" />
                            </div>
                            {
                                this.state.flag &&
                                <div
                                    className="button download"
                                    onClick={() => {
                                        this.download()
                                    }}
                                >
                                {
                                    this.isSpanish && 
                                    <>
                                    Descargar&nbsp;
                                    </>
                                }
                                {
                                    !this.isSpanish && 
                                    <>
                                    Download&nbsp;
                                    </>
                                }
                                <Icon icon="D" />
                                </div>
                            }
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default App;
