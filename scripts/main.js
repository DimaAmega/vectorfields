var world = new World().initializate();

world.ADDParticle(1000);

function updateWorld() {  
    world.updateParticles();
};
world.ticker.add(updateWorld);




document.getElementById("count").addEventListener("change",(e)=>{
  if(world.getLength()<Number(e.target.value)) world.ADDParticle(Number(e.target.value)-world.getLength());
  else world.DROPParticle(world.getLength()-Number(e.target.value));
});

document.getElementById("M_Time_Alive_particle").addEventListener("change",(e)=>{
  world.change_alive_particle(Number(e.target.value));
});
document.getElementById("h_integrate").addEventListener("change",(e)=>{
  world.change_h_intergate(Number(e.target.value));
});
document.getElementById("M_n_lines").addEventListener("change",(e)=>{
  world.change_M_n_lines(Number(e.target.value));
});
document.getElementById("set").addEventListener("click",(e)=>{ 
  var x_str = document.getElementById("dx").value;
  var y_str = document.getElementById("dy").value;
if(Parser.parse(x_str,y_str)){
    world.SetPole(Parser.Pole);
  }
});

document.getElementById("scale_p").addEventListener("click",(e)=>{
  world.ADDScale(10);
})
document.getElementById("scale_s").addEventListener("click",(e)=>{
  world.ADDScale(-10);
})


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
})

document.getElementsByTagName("canvas")[0].addEventListener("click",(e)=>{
  if(e.ctrlKey){
    var coords = world.getCoordinates(e.clientX,e.clientY)
    world.toMouseCoord(coords.x,coords.y);
  }
})



