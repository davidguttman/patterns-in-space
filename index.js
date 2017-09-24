
var h = require('hyperscript')
var TAU = 2 * Math.PI

document.body.style.background = 'rgb(20, 20, 20)'

var stage = createStage()
document.body.appendChild(stage)
var poly = createPolygon({radius: 250, n: 24})
stage.appendChild(poly.el)

// var nPoints = 24
// window.addEventListener('mousemove', function (evt) {
//   nPoints = 2 + Math.floor(46 * evt.clientX / window.innerWidth)
// })

window.requestAnimationFrame(updateLoop)

function updateLoop () {
  window.requestAnimationFrame(updateLoop)
  // poly.n = nPoints
  poly.update()
}

function createPolygon (opts) {
  var nPoints = opts.n

  var ns = 'http://www.w3.org/2000/svg'
  var viewBox = [0, 0, 1, 1].join(' ')

  var parent = document.createElement('div')
  parent.style.width = '100%'
  parent.style.height = '100%'
  parent.innerHTML = `
    <svg xmlns='${ns}'
      viewBox='${viewBox}'
      width='100%'
      height='100%'
      stroke='none'
      fill='none'>
    </svg>
  `

  var svg = parent.children[0]

  return {
    el: parent,
    svg: svg,
    n: nPoints,
    update: function () {
      // svg.innerHTML = ''
      var lines = createLines(createPoints(this.n))
      lines.forEach(function (line, i) {
        var child = svg.children[i]
        if (!child) {
          child = document.createElementNS(ns, 'line')
          child.setAttributeNS(null, 'stroke', 'none')
          svg.appendChild(child)
        }

        child.setAttributeNS(null, 'x1', line.x1)
        child.setAttributeNS(null, 'y1', line.y1)
        child.setAttributeNS(null, 'x2', line.x2)
        child.setAttributeNS(null, 'y2', line.y2)
        child.setAttributeNS(null, 'stroke', 'rgba(255, 255, 255, 0.25)')
        child.setAttributeNS(null, 'stroke-width', '0.001')
      })
    }
  }

  function createPoints (nPoints) {
    return new Array(nPoints).fill(0).map(function (point, i) {
      point = point || {}
      point.theta = i / nPoints * TAU
      point.x = 0.5 * Math.cos(point.theta) + 0.5
      point.y = 0.5 * Math.sin(point.theta) + 0.5
      return point
    })
  }

  function createLines (points) {
    var dur = 48 * 10 * 1000

    var nFocus = 12

    var focusPoints = new Array(nFocus).fill(0).map(function (focus, i) {
      var pr = ((i + 1) * Date.now() % dur) / dur

      var theta = pr * TAU
      return {
        x: 0.5 * Math.cos(theta) + 0.5,
        y: 0.5 * Math.sin(theta) + 0.5
      }
    })

    var lines = []
    points.forEach(function (p2) {
      focusPoints.forEach(function (fp) {
        lines.push(line(fp, p2))
      })
    })

    return lines
  }
}

function line (pa, pb) {
  return {x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y}
}

function createStage (w, h) {
  var stage = document.createElement('div')
  stage.style.position = 'absolute'
  stage.style.top = '10%'
  stage.style.left = '10%'
  stage.style.width = '80%'
  stage.style.height = '80%'
  return stage
}

function mod (a, n) {
  return ((a % n) + n) % n
}
