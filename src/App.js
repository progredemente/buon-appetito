import React, { Component } from 'react';
import './App.css';
import { GIFer } from 'components/GIFer';

class App extends Component {

    constructor(props){
        super(props);
        try{
            this.lang = navigator.language.toLowerCase().split('-')[0];
        } catch(_){}
        if(!['en', 'es'].includes(this.lang)){
            this.lang = 'en';
        }
    }

    create(encoder, context, image, customImage, scaleFactor, side, clear) {
        encoder.setRepeat(0);
        encoder.setDelay(150);
        clear(context);
        this.draw(0, context, image, customImage, scaleFactor, side);
        encoder.addFrame(context);
        clear(context);
        this.draw(1, context, image, customImage, scaleFactor, side);
        encoder.addFrame(context);
        clear(context);
        this.draw(2, context, image, customImage, scaleFactor, side);
        encoder.addFrame(context);
    }

    draw(frameNumber, context, image, customImage, scaleFactor, side) {
        var bezierCurve = {};
        bezierCurve.p1 = {x : 220, y : 140};
        bezierCurve.p2 = {x : 100, y : 300};
        bezierCurve.cp1 = {x : 150, y : 140};
        bezierCurve.cp2 = {x : 200, y : 300};
        if(customImage) {
            if(frameNumber === 1){
                bezierCurve.p1 = {x : 215, y : 130};
                bezierCurve.cp1 = {x : 145, y : 160};
            }
            else if(frameNumber === 2) {
                bezierCurve.p1 = {x : 220, y : 150};
                bezierCurve.cp1 = {x : 150, y : 150};
            }
            this.drawFlag(context, bezierCurve, customImage, scaleFactor, side);
        }
        context.drawImage(image, side * frameNumber, 0, side, side, 0, 0, side * scaleFactor, side * scaleFactor);
        this.drawUrl(context, scaleFactor, side);
    }

    drawFlag(context, bezierCurve, customImage, scaleFactor, side) {
        const imgW = side * scaleFactor * .5;
        const imgH = side * scaleFactor * .20;

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
        can.width= side * scaleFactor;
        can.height= side * scaleFactor;
        let gl = can.getContext("webgl");
        gl.viewportWidth = can.width;
        gl.viewportHeight = can.height;
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        var glMesh = createMesh(createBezierMesh(bezierCurve, imgW), 4);
        glMesh.program = createShaders();
        glMesh.W = imgW;
        glMesh.H = imgH;
        glMesh.texture = createTextureFromImage(customImage);
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

    drawUrl(context, scaleFactor, side) {
        context.font = `${80 * scaleFactor}px ComicTypo`;
        context.textAlign = "center";
        context.fillStyle = "rgba(0, 0, 0, .5)";
        context.fillText("progredemente.com/buon-appetito", side * scaleFactor / 2 , 70 * scaleFactor);
    }

    render() {
        return (
            <GIFer
                appId="buon-appetito"
                loadingImageUrl={`${process.env.RESOURCES_URL}/buon_appetito.png`}
                sourceImageUrl="./buon_appetito.png"
                title='Buon Appetito'
                create={this.create.bind(this)}

                lang={this.lang}
                loadButtonText='Elegir&nbsp;bandera'
                defaultImgs={[
                    './lgtbiq.svg',
                    './estelada.svg',
                    './franco.svg'
                ]}
                
            />
        )
    }
}

export default App;
