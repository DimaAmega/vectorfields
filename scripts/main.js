
///////////////////////////
//    ADDITIONAL FUNC
///////////////////////////
function updateWorld() {  
  world.updateParticles();
};
function shareData(){
  var baseData = {
    x_str : document.getElementById("dx").value,
    y_str : document.getElementById("dy").value,
    xspeed : document.getElementById("xspeed").value,
    count : document.getElementById("count").value,
    M_Time_Alive_particle : document.getElementById("M_Time_Alive_particle").value,
    M_n_lines : document.getElementById("M_n_lines").value,
   };
 return {...baseData, ...Parser.Variables}  
};
function createDialog(message){
  var div = document.createElement("div");
  div.setAttribute("id","messageContainer");
  var div2 = document.createElement("div");
  div2.setAttribute("id","message");
  div2.setAttribute("class","middle");
  div2.innerHTML = message;
  div.append(div2);
  document.body.prepend(div);
  return div;
};
///////////////////////////
//     INITIALIZATING
///////////////////////////
var world = new World().initializate();
world.ticker.add(updateWorld);
var MY_DOMEN = 'file:///home/superhaker/GitHub_Repositories/RK4/index.html';
// var MY_DOMEN = 'example.com';

///////////////////////////
//        SOME DATA
///////////////////////////
var START_MESSAGE = `<h1>Визуализация векторных полей онлайн</h1>
<p class="mes">
  Данная программа позволяет вам визуализировать двумерные векторные поля,
  а также двумерные системы автономных дифференциальных уравнений.
</p>
<p class="mes" style="text-align: left;">
  Использование: <br>
  Введите своё векторное поле в поля ввода, затем нажмите кнопку "Update field equation".
  Вы можете использовать параметры, все параметры начинаются с большой буквы, затем вы можете
  динамически изменять их в соответствующем поле.
</p>`;


///////////////////////////
//  ADD EVENTS LISTENERS
///////////////////////////
document.getElementById("count").addEventListener("change",(e)=>{
  if(world.getLength()<Number(e.target.value)) world.ADDParticle(Number(e.target.value)-world.getLength());
  else world.DROPParticle(world.getLength()-Number(e.target.value));
});
document.getElementById("M_Time_Alive_particle").addEventListener("change",(e)=>{
  world.change_alive_particle(Number(e.target.value));
});
document.getElementById("xspeed").addEventListener("change",(e)=>{
  world.change_x_speed(Number(e.target.value));
});
document.getElementById("M_n_lines").addEventListener("change",(e)=>{
  world.change_M_n_lines(Number(e.target.value));
});
document.getElementById("set").addEventListener("click",(e)=>{ 
  var x_str = document.getElementById("dx").value;
  var y_str = document.getElementById("dy").value;
if(Parser.parse(x_str,y_str)){
    world.SetPole(Parser.Pole);
    createInputs({});
  }
});
document.getElementById("scale_p").addEventListener("click",(e)=>{
  world.ADDScale(10);
});
document.getElementById("scale_s").addEventListener("click",(e)=>{
  world.ADDScale(-10);
});
document.getElementById("share").addEventListener("click",(e)=>{
var dataKeys = shareData();
var url =  `${MY_DOMEN}?`+"";
for(var nameKey in dataKeys) url+=`${nameKey}=${dataKeys[nameKey]}&`;
  var linkDialog = createDialog(`<h3>Ссылка</h3> <p class="mes" >${url}</p>`);
  var button = document.createElement("button");
  button.innerHTML = "CLOSE";
  button.addEventListener("click",(e)=>{
    linkDialog.firstChild.setAttribute("class","tophide");
  setTimeout(()=>{
    linkDialog.remove();
  },600);
  });
  linkDialog.firstChild.append(button);
});
document.getElementById("hide").addEventListener("click",(e)=>{
  var type = e.target.getAttribute("data");
  if(type=="on"){
    e.target.setAttribute("data","off");
    e.target.style.bottom="-30px";
    document.getElementById("Form").style.right="-150px";
    e.target.innerHTML = "Show pannel";
  }
  else{
    e.target.setAttribute("data","on");
    document.getElementById("Form").style.right="0";
    e.target.innerHTML = "Hide pannel";
  }
});
document.getElementById('hovered').addEventListener("mouseover",()=>{
  document.getElementById("hide").style.bottom="0";
});
var coords = document.getElementById("coords");
document.getElementsByTagName("canvas")[0].addEventListener("mousemove",(e)=>{
if(e.altKey){
  coords.style.top = `${e.clientY-60}px`;
  coords.style.left = `${e.clientX+10}px`;
  var c = world.getCoordinates(e.clientX,e.clientY)
  coords.innerHTML = `x: ${c.x}<br>y: ${c.y}`;
}
else{
  coords.style.top = `-100px`;
  coords.style.left = `-100px`;
}
});
document.getElementsByTagName("canvas")[0].addEventListener("click",(e)=>{
  if(e.ctrlKey){
    var coords = world.getCoordinates(e.clientX,e.clientY)
    world.toMouseCoord(coords.x,coords.y);
  }
});



var startMessage = createDialog(START_MESSAGE);
startMessage.addEventListener("click",(e)=>{
  startMessage.firstChild.setAttribute("class","tophide");
  setTimeout(()=>{
    startMessage.remove();
  },600)
});

///////////////////////////
//   SHARE PROPERTIES
///////////////////////////
var params = window
    .location
    .search
    .replace('?','')
    .split('&')
    .reduce(
        function(p,e){
            var a = e.split('=');
            p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        },
        {}
    );


    if (params.x_str && params.y_str) {
        document.getElementById("dx").value = params.x_str
        document.getElementById("dy").value = params.y_str
        if(Parser.parse(params.x_str,params.y_str)) {
          world.SetPole(Parser.Pole);
          for(var i in Parser.Variables) Parser.Variables[i] =  params[i] || 0;
          createInputs(params);
  }
}

    if (params.xspeed) {
      document.getElementById("xspeed").value = params.xspeed;
      world.change_x_speed(Number(params.xspeed));
    }
    if (params.count) {
      document.getElementById("count").value = params.count;
      world.ADDParticle(Number(params.count));
    }
    else{
      world.ADDParticle(1000);    
    }

    if (params.M_Time_Alive_particle) {
      document.getElementById("M_Time_Alive_particle").value = params.M_Time_Alive_particle;
      world.change_alive_particle(Number(params.M_Time_Alive_particle));
    }
    else{
      world.change_alive_particle(1.5);
    }

    if (params.M_n_lines) {
      document.getElementById("M_n_lines").value = params.M_n_lines;
      world.change_M_n_lines(Number(params.M_n_lines));
    }
    else{
      world.change_M_n_lines(20);
    }



  
