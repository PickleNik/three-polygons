// import './style.css'
import gsap from 'gsap'
import * as t from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

var s, c, r
var g, m, o
var l, l1

var gui = new dat.GUI()
var wld = {
  o: {
    w: 1000,
    h: 1000,
    wsegs: 50,
    hsegs: 50
  }
}

const raycaster = new t.Raycaster()
const mouse = {
  x: undefined,
  y: undefined
}

function i () {
  s = new t.Scene()
  c = new t.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 3000)
  c.position.z = 420

  r = new t.WebGLRenderer()
  r.setSize(innerWidth, innerHeight)
  r.setPixelRatio(devicePixelRatio)
  document.body.appendChild(r.domElement)

  new OrbitControls(c, r.domElement)

  l = new t.DirectionalLight(0xffffff, 1)
  // l.position.y = 200
  // l.position.z = -100
  l.position.z = 0.1
  s.add(l)

  l1 = new t.DirectionalLight(0xffffff, 1)
  l1.position.z = -0.1
  s.add(l1)

  g = new t.PlaneGeometry(wld.o.w, wld.o.h, wld.o.wsegs, wld.o.hsegs)
  m = new t.MeshPhongMaterial({
    // color: 0xff5555, // vertexColors set below instead
    wireframe: false,
    side: t.DoubleSide,
    flatShading: t.FlatShading,
    vertexColors: true,
    metalness: 1,
    roughness: 0,
    // shininess: 1,
  })
  o = new t.Mesh(g, m)
  // o.rotation.x -= 1.5
  // o.rotation.z -= 0.75
  s.add(o)

  v(o.geometry.attributes.position) // vertices Z

  paint() // vertixColors

  gui.add(wld.o, 'w', 1, 1000).onChange(regenO)
  gui.add(wld.o, 'h', 1, 1000).onChange(regenO)
  gui.add(wld.o, 'wsegs', 1, 200).onChange(regenO)
  gui.add(wld.o, 'hsegs', 1, 200).onChange(regenO)

}

function regenO () {
  o.geometry.dispose()
  o.geometry = new t.PlaneGeometry(wld.o.w, wld.o.h, wld.o.wsegs, wld.o.hsegs)
  v(o.geometry.attributes.position)
  paint()
}

function v (vertices) {
  const { array } = vertices
  const randomValues = []
  for (let j = 0; j < array.length; j++) { randomValues.push(Math.random() * Math.PI * 2) }
  for (let i = 0; i < array.length; i += 3) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      array[i] = x + (Math.random() - 0.5) * 10
      array[i + 1] = y + (Math.random() - 0.5) * 10
      array[i + 2] = z + (Math.random() - 0.5) * 10
  }
  
  o.geometry.attributes.position.randomValues = randomValues
  o.geometry.attributes.position.originalPosition = o.geometry.attributes.position.array
}

function paint () {
  const colors = []
  for (let i = 0; i < o.geometry.attributes.position.count; i++) {
    colors.push(1, 0.2, 0.2)
  }
  o.geometry.setAttribute(
    'color',
    new t.BufferAttribute(
      new Float32Array(colors),
      3
    )
  )
}

let frame = 0
function a (time) {

  frame += 0.01
  // o.rotation.x = 0.1
  // o.rotation.y = time * 0.001
  // o.rotation.z = time * 0.001

  l.position.x = mouse.x
  l1.position.x = mouse.x
  l.position.y = mouse.y
  l1.position.y = mouse.y

  raycaster.setFromCamera(mouse, c)

  const { array, originalPosition, randomValues } = o.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] = originalPosition[i]
      + Math.cos(frame + randomValues[i])
      * 0.075
    // y
    array[i + 1] = originalPosition[i + 1]
      + Math.sin(frame + randomValues[i + 1])
      * 0.075
    // z
    array[i + 2] = originalPosition[i + 2]
      // + Math.tan(frame + randomValues[i + 2])
      + Math.sin(frame + randomValues[i + 2])
      * 0.001
    o.geometry.attributes.position.needsUpdate = true
  }

  const intersects = raycaster.intersectObject(o)
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes

    const initialColor = { // initial vertexColors
      r: 1,
      g: 0.2,
      b: 0.2
    }

    const hoverColor = {
      r: 1,
      g: 1,
      b: 1
    }

    // vertice1
    color.setX(intersects[0].face.a, hoverColor.r)
    color.setY(intersects[0].face.a, hoverColor.g)
    color.setZ(intersects[0].face.a, hoverColor.b)
    // vertice2
    color.setX(intersects[0].face.b, hoverColor.r)
    color.setY(intersects[0].face.b, hoverColor.g)
    color.setZ(intersects[0].face.b, hoverColor.b)
    // vertice3
    color.setX(intersects[0].face.c, hoverColor.r)
    color.setY(intersects[0].face.c, hoverColor.g)
    color.setZ(intersects[0].face.c, hoverColor.b)
    color.needsUpdate = true

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        // vertice1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)
        // vertice2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)
        // vertice3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
        color.needsUpdate = true

      }
    })
  }

  r.render(s, c)
  requestAnimationFrame(a)

}

i() // init
a() // anim
// requestAnimationFrame(a)

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})

// function move (event) {
//   mouse.x = (event.clientX / innerWidth) * 2 - 1
//   mouse.y = -(event.clientY / innerHeight) * 2 - 1
// }