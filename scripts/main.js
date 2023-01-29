///////////////////////////
//    ADDITIONAL FUNC
///////////////////////////
const removeSpaces = str => str.replace(/ /g, '')
function shareData() {
  const baseData = {
    x_str: removeSpaces(document.getElementById('dx').value),
    y_str: removeSpaces(document.getElementById('dy').value),
    xspeed: document.getElementById('xspeed').value,
    count: document.getElementById('count').value,
    M_Time_Alive_particle: document.getElementById('M_Time_Alive_particle')
      .value,
    M_n_lines: document.getElementById('M_n_lines').value,
    // h_integrate: document.getElementById("h_integrate").value
  }
  return { ...baseData, ...Parser.Variables }
}

function createDialog(message) {
  const div = document.createElement('div')
  div.setAttribute('id', 'messageContainer')
  const div2 = document.createElement('div')
  div2.setAttribute('id', 'welcome_message')
  div2.setAttribute('class', 'middle')
  div2.innerHTML = message
  div.append(div2)
  document.body.prepend(div)
  return div
}

function createHelpDialog() {
  const startMessage = createDialog(START_MESSAGE)
  startMessage.addEventListener('click', e => {
    if (e.target.nodeName == 'A') {
      return
    }
    startMessage.firstChild.setAttribute('class', 'tophide')
    setTimeout(() => startMessage.remove(), 600)
  })
}

///////////////////////////
//        SOME DATA
///////////////////////////
const MY_DOMEN = `${location.origin}${location.pathname}`
const SOURCE_CODE_LINK = 'https://github.com/DimaAmega/vectorfields'
const START_MESSAGE = `<h1>Visualization of vector fields online</h1>
<p class="message">
  This program allows you to visualize two-dimensional
  vector fields, as well as two-dimensional
  systems of autonomous differential equations.
  Here is the <a target="_blank" href=${SOURCE_CODE_LINK}>Source code</a>
</p>
<p class="message">
  How to use: <br>
  <ol>
  <li>Enter your vector field into the input fields, then click the "Update field equation" button</li>
  <li>You can use variables, all variables start with a capital letter, then you
    can dynamically change them in the corresponding field. On <a target="_blank" href="${MY_DOMEN}?x_str=A*y&y_str=-2*A*x&A=0.3&count=3000&xspeed=5&skip_welcome">example</a>:
    <pre>x' = A*y,<br>y' = -2*A*x</pre> <pre style="display: inline">'A'</pre> is the variable here. The variable name can contain one or more letters
  </li>
  <li>With the Alt/Option key held down, you can see the coordinates in the phase space</li>
  <li>With the Ctrl/Command key held down, you can click on specific point on the phase space to set initial conditions you want integrate from</li>
  <li>A weak vector field is colored red, thereby allowing you to notice, for example, a fixed points</li>
  </ol>
</p>`

///////////////////////////
//     INITIALIZATING
///////////////////////////
const world = new World().initializate()
world.ticker.add(() => world.updateParticles())

///////////////////////////
//  ADD EVENTS LISTENERS
///////////////////////////
document.getElementById('count').addEventListener('change', e => {
  if (world.getLength() < Number(e.target.value))
    world.ADDParticle(Number(e.target.value) - world.getLength())
  else world.DROPParticle(world.getLength() - Number(e.target.value))
})
document
  .getElementById('M_Time_Alive_particle')
  .addEventListener('change', e => {
    world.change_alive_particle(Number(e.target.value))
  })
document.getElementById('h_integrate').addEventListener('change', e => {
  world.change_h_integrate(Number(e.target.value))
})
document.getElementById('xspeed').addEventListener('change', e => {
  world.change_x_speed(Number(e.target.value))
})
document.getElementById('M_n_lines').addEventListener('change', e => {
  world.change_M_n_lines(Number(e.target.value))
})
document.getElementById('set').addEventListener('click', e => {
  const x_str = document.getElementById('dx').value
  const y_str = document.getElementById('dy').value
  if (Parser.parse(x_str, y_str)) {
    world.SetPole(Parser.Pole)
    createInputs({})
  }
})
document.getElementById('scale_p').addEventListener('click', e => {
  world.ADDScale(10)
})
document.getElementById('scale_s').addEventListener('click', e => {
  world.ADDScale(-10)
})

document.getElementById('help').addEventListener('click', e => {
  createHelpDialog()
})

document.getElementById('share').addEventListener('click', e => {
  const dataKeys = shareData()
  let url = `${MY_DOMEN}?` + ''
  for (let nameKey in dataKeys) url += `${nameKey}=${dataKeys[nameKey]}&`
  const linkDialog = createDialog(
    `<h3>Link</h3> <p class="message" >${encodeURI(url)}</p>`,
  )
  const button = document.createElement('button')
  button.innerHTML = 'CLOSE'
  button.addEventListener('click', e => {
    linkDialog.firstChild.setAttribute('class', 'tophide')
    setTimeout(() => {
      linkDialog.remove()
    }, 600)
  })
  linkDialog.firstChild.append(button)
})
document.getElementById('hide').addEventListener('click', e => {
  const type = e.target.getAttribute('data')
  if (type == 'on') {
    e.target.setAttribute('data', 'off')
    e.target.style.bottom = '-30px'
    document.getElementById('Form').style.right = '-150px'
    e.target.innerHTML = 'Show pannel'
  } else {
    e.target.setAttribute('data', 'on')
    document.getElementById('Form').style.right = '0'
    e.target.innerHTML = 'Hide pannel'
  }
})
document.getElementById('hovered').addEventListener('mouseover', () => {
  document.getElementById('hide').style.bottom = '0'
})
const coords = document.getElementById('coords')
document.getElementsByTagName('canvas')[0].addEventListener('mousemove', e => {
  if (e.altKey) {
    coords.style.top = `${e.clientY - 60}px`
    coords.style.left = `${e.clientX + 10}px`
    const c = world.getCoordinates(e.clientX, e.clientY)
    coords.innerHTML = `x: ${c.x}<br>y: ${c.y}`
  } else {
    coords.style.top = `-100px`
    coords.style.left = `-100px`
  }
})
document.getElementsByTagName('canvas')[0].addEventListener('click', e => {
  if (e.ctrlKey || e.metaKey) {
    const coords = world.getCoordinates(e.clientX, e.clientY)
    world.toMouseCoord(coords.x, coords.y)
  }
})

///////////////////////////
//   SHARE PROPERTIES
///////////////////////////
const params = window.location.search
  .replace('?', '')
  .split('&')
  .reduce(function (p, e) {
    const a = e.split('=')
    p[decodeURIComponent(a[0])] = decodeURIComponent(a[1])
    return p
  }, {})

if (params.add_scale) {
  const addScale = Number(params.add_scale)
  world.ADDScale(addScale)
}

if (!params.skip_welcome) {
  createHelpDialog()
}

if (params.x_str && params.y_str) {
  document.getElementById('dx').value = params.x_str
  document.getElementById('dy').value = params.y_str
  if (Parser.parse(params.x_str, params.y_str)) {
    world.SetPole(Parser.Pole)
    for (const i in Parser.Variables)
      Parser.Variables[i] = Number(params[i]) || 0
    createInputs(params)
  }
}

if (params.xspeed) {
  document.getElementById('xspeed').value = params.xspeed
  world.change_x_speed(Number(params.xspeed))
}
if (params.count) {
  document.getElementById('count').value = params.count
  world.ADDParticle(Number(params.count))
} else {
  world.ADDParticle(1000)
}

if (params.M_Time_Alive_particle) {
  document.getElementById('M_Time_Alive_particle').value =
    params.M_Time_Alive_particle
  world.change_alive_particle(Number(params.M_Time_Alive_particle))
} else {
  world.change_alive_particle(1.5)
}

if (params.h_integrate) {
  document.getElementById('h_integrate').value = params.h_integrate
  world.change_h_integrate(Number(params.h_integrate))
} else {
  world.change_h_integrate(1e-3)
}

if (params.M_n_lines) {
  document.getElementById('M_n_lines').value = params.M_n_lines
  world.change_M_n_lines(Number(params.M_n_lines))
} else {
  world.change_M_n_lines(20)
}
