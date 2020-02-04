PIXI.utils.skipHello();
function World() {
  //////////////////
  //    PRIVATE
  //////////////////
  var divStage = document.getElementById("stage");
  var cw = divStage.clientWidth,ch = divStage.clientHeight,scale=60,x_off=0,y_off=0,o_x_off=0,o_y_off=0,start_p; 
  var coord_Lines = new PIXI.Graphics();
  var arr_particles=[],M_Time_Alive_particle=1.5,h_integrate=1e-3,M_n_lines=20,xspeed =1,defSpeed=10;
  var Pole = (vec)=>{return [ 0 , 0 ]};
  var app = new PIXI.Application({ 
    antialias: true,    // default: false s
    resizeTo:document.getElementById("stage")}
  );
  app.stage.addChild(coord_Lines);

  var getRandomArbitary = (min, max) =>{
    return Math.random() * (max - min) + min;
  };
  var gxLeft = () => {
    return - (cw/2+x_off)/scale;
  };
  var gxRight = () => {
      return (cw/2-x_off)/scale;
  };
  var gyTop = () => {
      return (ch/2+y_off)/scale;
  };
  var gyBottom = () => {
        return - (ch/2-y_off)/scale; 
  };
  var arrayData = (data,n) =>{
    var res = [];
    for(var i = 0;i<n;i++) res.push([data[0],data[1]]);
    return res;
  }
  var getRandomCoords = ()=>{
    return [getRandomArbitary(gxLeft(),gxRight()),getRandomArbitary(gyBottom(),gyTop())];
  };
  var gxc = (x)=> x*scale+cw/2 + x_off;
  var gyc = (y)=> ch/2 - y*scale + y_off;
  var addOnWheel = (elem, handler) => {
    if (elem.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+
        elem.addEventListener("wheel", handler);
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        elem.addEventListener("mousewheel", handler);
      } else {
        // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
        elem.addEventListener("MozMousePixelScroll", handler);
      }
    } else { // IE8-
      text.attachEvent("onmousewheel", handler);
    }
  };
  var getLengthOfVec = (vec)=>{
    return Math.pow( vec[0]**2 + vec[1]**2 ,0.5);
  };

  var getColorPole = (vec)=>{
    var rgbToHex = (vec)=>  {
      var res = "";
      for(var i = 0; i<3;i++){
        var hex = vec[i].toString(16);
        res+=hex.length == 1 ? "0" + hex : hex;
      };
      return parseInt(res,16);
    };
    var length = getLengthOfVec(vec);
    var slope = 70;
    var component = Math.floor(slope*length);
    if(component>255) component=255;
    return rgbToHex([component,0,255-component]);
  };
  var mousemove = (e)=>{
    var dx = e.clientX - start_p.x;
    var dy = e.clientY - start_p.y; 
    x_off = o_x_off + dx;
    y_off = o_y_off + dy;
    drawPlan();
  };
  var fingerMouse = (e)=>{
    if(e.changedTouches.length==1){
      var dx = e.changedTouches[0].clientX - start_p.x;
      var dy = e.changedTouches[0].clientY - start_p.y;
      x_off = o_x_off + dx;
      y_off = o_y_off + dy;
      drawPlan();
    }
  };
    var drawPlan = ()=>{
      var iterxL = Math.floor((cw/2+x_off)/scale);
      var iterxR = Math.floor((cw/2-x_off)/scale);
      var iteryT = Math.floor((ch/2+y_off)/scale);
      var iteryB = Math.floor((ch/2-y_off)/scale);
      coord_Lines.clear();
      coord_Lines.lineStyle(3,0xffffff,.6);
      if (((ch/2 + y_off)>0)&&((ch/2 + y_off)<ch)) { //Добавить Горизонт линию
        coord_Lines.moveTo(0,ch/2 + y_off).lineTo(cw,(ch/2)+y_off);  // paper.path("M0," + ((ch)/2 + y_off) + "L"+ cw + "," + ((ch/2)+y_off  )) ;
      } 
      if (((cw/2 + x_off)>0)&&((cw/2 + x_off)<cw))  { //Добавить Вертик линию
        coord_Lines.moveTo(cw/2 + x_off,0).lineTo(cw/2 + x_off,ch);  // paper.path("M0," + ((ch)/2 + y_off) + "L"+ cw + "," + ((ch/2)+y_off  )) ;
      } 
      coord_Lines.lineStyle(1,0xffffff,.212);


      for(var i = -iterxL; i<=iterxR;i++) //Добавить Вертик линию
      coord_Lines.moveTo(x_off+((cw)/2) + i*scale  , 0 ).lineTo(x_off + ((cw)/2) +i*scale  ,ch);
      // obj_coord_line.push(paper.path("M" + (World.x_off+((cw)/2) + i*scale) + ",0" + "L"+ (World.x_off + ((cw)/2) +i*scale) + "," + ch).attr(othline));
      for(var i = -iteryT; i<=iteryB;i++) //Добавить Горизонт линию
      coord_Lines.moveTo( 0 , y_off + ch/2 +i*scale ).lineTo( cw , y_off + ch/2 + i*scale );
  };
  var addParticle = () =>{
    var lines_count = Math.floor(getRandomArbitary(2, 2*M_n_lines - 2));
    var particle = {
      self: new PIXI.Graphics(),
      data:arrayData(getRandomCoords(),lines_count),
      time_live:Math.floor(getRandomArbitary(lines_count,M_Time_Alive_particle*lines_count)),
      c_time:0,
    };
    app.stage.addChild(particle.self);
    arr_particles.push(particle);  
  };
  var dropParticle = ()=>{
    arr_particles.pop().self.clear();
  };
  //////////////////
  //    PUBLIC
  //////////////////
  //тикер
  this.ticker = app.ticker;
  this.initializate = ()=>{
    divStage.appendChild(app.view);
    //СОБЫТИЕ RESIZE
    window.addEventListener("resize",()=>{
      cw = divStage.clientWidth;
      ch = divStage.clientHeight;
      drawPlan();
    });
    //СОБЫТИЕ DRUG & DROP
    app.view.addEventListener("mousedown",(e)=>{
      start_p = {x:e.clientX,y:e.clientY};
      o_x_off = x_off;
      o_y_off = y_off;
      app.view.addEventListener("mousemove",mousemove);
    });
    app.view.addEventListener("mouseup",(e)=>{
      app.view.removeEventListener("mousemove",mousemove);
    });
    app.view.addEventListener("touchstart",(e)=>{
      console.log(e);
      start_p = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
      o_x_off = x_off;
      o_y_off = y_off;
      app.view.addEventListener("touchmove",fingerMouse);
    });
    app.view.addEventListener("touchend",(e)=>{
      console.log(e);
      app.view.removeEventListener("touchmove",fingerMouse);
    });
    //СОБЫТИЕ КОЛЕСО
    addOnWheel(app.view,(e)=>{
      var delta = e.deltaY || e.detail || e.wheelDelta;
        // отмасштабируем при помощи CSS

        var X =(e.clientX - cw/2 - x_off)/scale;
        var Y =(ch/2 + y_off - e.clientY)/scale;

        if((scale <=30)&&(delta>0)) scale = 30; else 
        if((scale >= 300)&&(delta<0)) scale = 300; else
        if (delta > 0) scale -= 2;
        else scale += 2;

        /*  РАССУЖДЕНИЯ 
          var gxc = (x)=> x*scale+cw/2 + x_off;
          var gyc = (y)=> ch/2 - y*scale + y_off;

          X*SCALE + CW/2 + X_OFF = X*SCALE + 2*X + CW/2 + X_OFF2
        */
      if(delta>0) {
        x_off +=2*X;
        y_off -=2*Y;
      } else {
        x_off -=2*X;
        y_off +=2*Y;
      }
        drawPlan();
        e.preventDefault();
    });
    drawPlan();
    return this;
  };
  this.ADDParticle = (number)=>{
    for(var i = 0; i<number;i++) addParticle();
  };
  this.DROPParticle = (number)=>{
    for(var i = 0; i<number;i++) dropParticle();
  };
  this.getLength = ()=>{
    return arr_particles.length;
  };
  this.change_alive_particle = (value)=>{
    M_Time_Alive_particle = value;
  };
  this.change_x_speed = (value)=>{
    xspeed = value;
  };
  this.change_M_n_lines = (value)=>{
    M_n_lines = value;
  };
  this.SetPole = (pole)=>{
    Pole = pole;
  };
  this.getCoordinates = (w,h)=>{
    return {x:((w-x_off-cw/2)/scale).toFixed(2),y:((y_off-h+ch/2)/scale).toFixed(2)};
  };
  this.ADDScale = (n)=>{
    var X = -(x_off)/scale;
    var Y =(y_off)/scale;

    if((scale <=30)&&(n<0)) scale = 30; else 
    if((scale >= 300)&&(n>0)) scale = 300;
    else scale+=n;

    x_off -=n*X;
    y_off +=n*Y;

    drawPlan();
  };
  this.updateParticles = ()=>{
    var arr = arr_particles;
    var n = arr.length;
    for(var i = 0; i<n;i++){
      var part = arr[i];
      if(part.c_time==part.time_live){
        if(part.data.length == 1){
          // UPDATE
          var lines_count = Math.floor(getRandomArbitary(2, 2*M_n_lines - 2));
          part.time_live=Math.floor(getRandomArbitary(lines_count,M_Time_Alive_particle*lines_count))
          part.c_time = 0;
          part.data = arrayData(getRandomCoords(),lines_count);
        }
        else{
          part.data.length-=1;
        }
      }
      else{
        var new_Vec = part.data[0];
        var iterations = xspeed*defSpeed+1;
        while(--iterations>0) new_Vec = RungKut(Pole,new_Vec,h_integrate);
        var j = part.data.length-1;
        while(j>0) part.data[j] = part.data[--j];
        part.data[0] = new_Vec;
        part.c_time+=1;
      }
      part.self.clear();
      part.self.lineStyle(1,0x4f09e7);
      part.self.moveTo(gxc(part.data[0][0]),gyc( part.data[0][1] ));
        var N = part.data.length;
      for(var j = 1; j < N ;j++) part.self.lineTo(gxc(part.data[j][0]),gyc( part.data[j][1] ));
    };
  };
  this.toMouseCoord = (x_c,y_c)=>{
    var trace = arr_particles[Math.floor(getRandomArbitary(0, arr_particles.length))];
    var j = trace.data.length;
    while(j>=0) trace.data[--j] = [Number(x_c),Number(y_c)];
    trace.c_time = 0;
  };
};