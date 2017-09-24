
var h = require('hyperscript')
var TAU = 2 * Math.PI

document.body.style.background = 'rgb(20, 20, 20)'

var stage = createStage()
document.body.appendChild(stage)
var poly = createPolygon({radius: 250, n: 24})
stage.appendChild(poly.el)
poly.update()

// window.requestAnimationFrame(updateLoop)

function updateLoop () {
  // window.requestAnimationFrame(updateLoop)
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

  var points = new Array(nPoints).fill(0).map(function (point, i) {
    point = point || {}
    point.theta = i / nPoints * TAU
    point.x = 0.5 * Math.cos(point.theta) + 0.5
    point.y = 0.5 * Math.sin(point.theta) + 0.5
    return point
  })

  console.log('points', points)

  // var lines = points.map(function (point, i) {
  //   var prev = points[i - 1] || points[points.length - 1]
  //   return line(point, prev)
  // })

  var lines = []
  points.forEach(function (p1, i) {
    var adj = points[i - 1] || points[points.length - 1]
    // lines.push(line(point, prev))

    // if (i % 4) return
    points.forEach(function (p2, j) {
      if (p2 === adj) return

      if ((j - 1) > i) lines.push(line(p1, p2))
    })
  })

  console.log('lines', lines)

  return {
    el: parent,
    svg: svg,
    points: points,
    lines: lines,
    update: function () {
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
        child.setAttributeNS(null, 'stroke', 'white')
        child.setAttributeNS(null, 'stroke-width', '0.001')
      })
    }
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
