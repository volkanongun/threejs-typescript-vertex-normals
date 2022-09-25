import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {GUI} from 'dat.gui'

import {VertexNormalsHelper} from 'three/examples/jsm/helpers/VertexNormalsHelper'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(-1.91, 1.44, 2.04)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const orbit = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BufferGeometry();

let vertices = new Float32Array([
    // -1.0, -1.0, 0,
    // 1.0,  -1.0, 0,
    // 1.0,   1.0, 0,
    1.0,   1.0,  0,
    -1.0,  1.0,  0,
    -1.0, -1.0,  0
]);

const material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
    // wireframe: true
})

const centerOfGravity = {
    x: (vertices[0]+vertices[3]+vertices[6])/3,
    y: (vertices[1]+vertices[4]+vertices[7])/3,
    z: 0
}

const sphereGeometry = new THREE.SphereGeometry(.02,10,10)
const sphere = new THREE.Mesh( sphereGeometry, material )
scene.add(sphere)
sphere.position.set(centerOfGravity.x,centerOfGravity.y,centerOfGravity.z)

const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } )
const linePoints = []
linePoints.push( new THREE.Vector3( (vertices[0]+vertices[3]+vertices[6])/3, (vertices[1]+vertices[4]+vertices[7])/3, 0 ) )
linePoints.push( new THREE.Vector3( (vertices[0]+vertices[3]+vertices[6])/3, (vertices[1]+vertices[4]+vertices[7])/3, 1 ) )
const lineGeometry = new THREE.BufferGeometry().setFromPoints( linePoints )
const line = new THREE.Line( lineGeometry, lineMaterial )
scene.add(line)


geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))

geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
]), 3))

const triangle = new THREE.Mesh(geometry, material)
scene.add(triangle)

const helper = new VertexNormalsHelper( triangle, 1, 0x00ff00 )
scene.add( helper )

const boxGeometry = new THREE.BoxGeometry(1,1,1)

const boxMesh: THREE.Mesh = new THREE.Mesh(boxGeometry, material)
scene.add(boxMesh)
boxMesh.position.x = 3

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const cubeFolder = gui.addFolder('cube')
//cubeFolder.add(icosohedron.rotation, "x", 0, Math.PI * 2)
//cubeFolder.add(icosohedron.rotation, "y", 0, Math.PI * 2)
//cubeFolder.add(icosohedron.rotation, "z", 0, Math.PI * 2)
cubeFolder.open()

const cameraFolder = gui.addFolder('camera')
cameraFolder.add(camera.position, 'z', 0, 20)
cameraFolder.open()


function animate() {
    
    stats.update()

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)