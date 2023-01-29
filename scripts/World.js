PIXI.utils.skipHello()
function World() {
  //////////////////
  //    PRIVATE
  //////////////////
  const coord_Lines = new PIXI.Graphics()
  const divStage = document.getElementById('stage')
  let start_p = undefined
  let cw = divStage.clientWidth,
    ch = divStage.clientHeight,
    scale = 60,
    x_off = 0,
    y_off = 0,
    o_x_off = 0,
    o_y_off = 0
  let arr_particles = [],
    M_Time_Alive_particle = 1.5,
    h_integrate = 1e-3,
    M_n_lines = 20,
    xspeed = 1,
    defSpeed = 10
  let Pole = _ => {
    return [0, 0]
  }
  const app = new PIXI.Application({
    antialias: true,
    resizeTo: document.getElementById('stage'),
  })
  app.stage.addChild(coord_Lines)

  const getRandomArbitary = (min, max) => {
    return Math.random() * (max - min) + min
  }
  const gxLeft = () => {
    return -(cw / 2 + x_off) / scale
  }
  const gxRight = () => {
    return (cw / 2 - x_off) / scale
  }
  const gyTop = () => {
    return (ch / 2 + y_off) / scale
  }
  const gyBottom = () => {
    return -(ch / 2 - y_off) / scale
  }
  const arrayData = (data, n) => {
    const res = []
    for (let i = 0; i < n; i++) res.push([data[0], data[1]])
    return res
  }
  const getRandomCoords = () => {
    return [
      getRandomArbitary(gxLeft(), gxRight()),
      getRandomArbitary(gyBottom(), gyTop()),
    ]
  }
  const gxc = x => x * scale + cw / 2 + x_off
  const gyc = y => ch / 2 - y * scale + y_off
  const addOnWheel = (elem, handler) => {
    if (elem.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+
        elem.addEventListener('wheel', handler)
      } else if ('onmousewheel' in document) {
        elem.addEventListener('mousewheel', handler)
      } else {
        elem.addEventListener('MozMousePixelScroll', handler)
      }
    } else {
      // IE8-
      text.attachEvent('onmousewheel', handler)
    }
  }
  const getLengthOfVec = vec => {
    return Math.pow(vec[0] ** 2 + vec[1] ** 2, 0.5)
  }

  const getColorPole = vec => {
    const length = getLengthOfVec(vec)
    const LR = 150
    let component = Math.floor(LR * length)
    if (component > 255) component = 255
    return ((255 - component) << 16) | component
  }

  const mousemove = e => {
    const dx = e.clientX - start_p.x
    const dy = e.clientY - start_p.y
    x_off = o_x_off + dx
    y_off = o_y_off + dy
    drawPlan()
  }
  const fingerMouse = e => {
    if (e.changedTouches.length == 1) {
      const dx = e.changedTouches[0].clientX - start_p.x
      const dy = e.changedTouches[0].clientY - start_p.y
      x_off = o_x_off + dx
      y_off = o_y_off + dy
      drawPlan()
    }
  }
  const drawPlan = () => {
    const iterxL = Math.floor((cw / 2 + x_off) / scale)
    const iterxR = Math.floor((cw / 2 - x_off) / scale)
    const iteryT = Math.floor((ch / 2 + y_off) / scale)
    const iteryB = Math.floor((ch / 2 - y_off) / scale)
    coord_Lines.clear()
    coord_Lines.lineStyle(3, 0xffffff, 0.6)
    if (ch / 2 + y_off > 0 && ch / 2 + y_off < ch) {
      coord_Lines.moveTo(0, ch / 2 + y_off).lineTo(cw, ch / 2 + y_off)
    }
    if (cw / 2 + x_off > 0 && cw / 2 + x_off < cw) {
      coord_Lines.moveTo(cw / 2 + x_off, 0).lineTo(cw / 2 + x_off, ch)
    }
    coord_Lines.lineStyle(1, 0xffffff, 0.212)

    for (let i = -iterxL; i <= iterxR; i++)
      coord_Lines
        .moveTo(x_off + cw / 2 + i * scale, 0)
        .lineTo(x_off + cw / 2 + i * scale, ch)
    for (let i = -iteryT; i <= iteryB; i++)
      coord_Lines
        .moveTo(0, y_off + ch / 2 + i * scale)
        .lineTo(cw, y_off + ch / 2 + i * scale)
  }
  const addParticle = () => {
    const lines_count = Math.floor(getRandomArbitary(2, 2 * M_n_lines - 2))
    const particle = {
      self: new PIXI.Graphics(),
      data: arrayData(getRandomCoords(), lines_count),
      time_live: Math.floor(
        getRandomArbitary(lines_count, M_Time_Alive_particle * lines_count),
      ),
      c_time: 0,
    }
    app.stage.addChild(particle.self)
    arr_particles.push(particle)
  }
  const dropParticle = () => {
    arr_particles.pop().self.clear()
  }
  //////////////////
  //    PUBLIC
  //////////////////

  this.ticker = app.ticker
  this.initializate = () => {
    divStage.appendChild(app.view)
    window.addEventListener('resize', () => {
      cw = divStage.clientWidth
      ch = divStage.clientHeight
      drawPlan()
    })
    app.view.addEventListener('mousedown', e => {
      start_p = { x: e.clientX, y: e.clientY }
      o_x_off = x_off
      o_y_off = y_off
      app.view.addEventListener('mousemove', mousemove)
    })
    app.view.addEventListener('mouseup', e => {
      app.view.removeEventListener('mousemove', mousemove)
    })
    app.view.addEventListener('touchstart', e => {
      console.log(e)
      start_p = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }
      o_x_off = x_off
      o_y_off = y_off
      app.view.addEventListener('touchmove', fingerMouse)
    })
    app.view.addEventListener('touchend', e => {
      console.log(e)
      app.view.removeEventListener('touchmove', fingerMouse)
    })
    addOnWheel(app.view, e => {
      const delta = e.deltaY || e.detail || e.wheelDelta

      const X = (e.clientX - cw / 2 - x_off) / scale
      const Y = (ch / 2 + y_off - e.clientY) / scale

      if (scale <= 30 && delta > 0) scale = 30
      else if (scale >= 300 && delta < 0) scale = 300
      else if (delta > 0) scale -= 2
      else scale += 2

      if (delta > 0) {
        x_off += 2 * X
        y_off -= 2 * Y
      } else {
        x_off -= 2 * X
        y_off += 2 * Y
      }
      drawPlan()
      e.preventDefault()
    })
    drawPlan()
    return this
  }
  this.ADDParticle = number => {
    for (let i = 0; i < number; i++) addParticle()
  }
  this.DROPParticle = number => {
    for (let i = 0; i < number; i++) dropParticle()
  }
  this.getLength = () => {
    return arr_particles.length
  }
  this.change_alive_particle = value => {
    M_Time_Alive_particle = value
  }
  this.change_h_integrate = value => {
    h_integrate = value
  }
  this.change_x_speed = value => {
    xspeed = value
  }
  this.change_M_n_lines = value => {
    M_n_lines = value
  }
  this.SetPole = pole => {
    Pole = pole
  }
  this.getCoordinates = (w, h) => {
    return {
      x: ((w - x_off - cw / 2) / scale).toFixed(2),
      y: ((y_off - h + ch / 2) / scale).toFixed(2),
    }
  }
  this.ADDScale = n => {
    const X = -x_off / scale
    const Y = y_off / scale

    if (scale <= 30 && n < 0) scale = 30
    else if (scale >= 300 && n > 0) scale = 300
    else scale += n

    x_off -= n * X
    y_off += n * Y

    drawPlan()
  }
  this.updateParticles = () => {
    const arr = arr_particles
    const n = arr.length
    for (let i = 0; i < n; i++) {
      const part = arr[i]
      if (part.c_time == part.time_live) {
        if (part.data.length == 1) {
          // UPDATE
          const lines_count = Math.floor(
            getRandomArbitary(2, 2 * M_n_lines - 2),
          )
          part.time_live = Math.floor(
            getRandomArbitary(lines_count, M_Time_Alive_particle * lines_count),
          )
          part.c_time = 0
          part.data = arrayData(getRandomCoords(), lines_count)
        } else {
          part.data.length -= 1
        }
      } else {
        let new_Vec = part.data[0]
        let iterations = xspeed * defSpeed + 1
        while (--iterations > 0) new_Vec = RungKut(Pole, new_Vec, h_integrate)
        let j = part.data.length - 1
        while (j > 0) {
          part.data[j] = part.data[j - 1]
          j--
        }
        part.data[0] = new_Vec
        part.c_time += 1
      }
      part.self.clear()
      part.self.lineStyle(1, getColorPole(Pole(part.data[0])))
      part.self.moveTo(gxc(part.data[0][0]), gyc(part.data[0][1]))
      const N = part.data.length
      for (let j = 1; j < N; j++)
        part.self.lineTo(gxc(part.data[j][0]), gyc(part.data[j][1]))
    }
  }
  this.toMouseCoord = (x_c, y_c) => {
    const trace =
      arr_particles[Math.floor(getRandomArbitary(0, arr_particles.length))]
    let j = trace.data.length
    while (j >= 0) trace.data[--j] = [Number(x_c), Number(y_c)]
    trace.c_time = 0
  }
}
