var sin = (x)=>Math.sin(x);
var cos = (x)=>Math.cos(x);


function createInputs(){
    var old_inputs = document.getElementsByClassName("Variables");
    console.log(old_inputs);
    var after_Element = document.getElementById("dy");
    while(old_inputs.length>0) old_inputs[0].remove();
    var variables = Object.keys(Parser.Variables);
    for(var i = 0; i<variables.length;i++){
        var input = document.createElement("input");
        input.setAttribute("type","number");
        input.setAttribute("step","0.01");
        input.setAttribute("class","Variables");
        input.setAttribute("placeholder",variables[i]);
        input.addEventListener("change",(e)=>{

            var num = Number(e.target.value);
            if(num==NaN) alert("Неправильное задание значения переменной");
            Parser.Variables[e.target.getAttribute("placeholder")]=Number(e.target.value);
       
        });
        after_Element.after(input);
    };
    if(Object.keys(Parser.Variables).length){
        var title = document.createElement("p");
        title.innerHTML = "Variables";
        title.setAttribute("class","Variables st");
        after_Element.after(title);
    };
};

var Parser = {
    matchFunction: function(match){
        this.Variables[match] = 0;
        return ` Parser.Variables.${match}`;
    },
    parse: function(x_string,y_string){
        this.Variables = {};
        var regExp = /[A-Z][a-z]{0,}/g;
        x_string = x_string.replace(regExp,this.matchFunction.bind(this));
        y_string = y_string.replace(regExp,this.matchFunction.bind(this));
        try{
            var x_fun = new Function("x,y,","return "+x_string);
            var y_fun = new Function("x,y,","return "+y_string);
            this.Pole = (q)=>[x_fun(q[0],q[1]),y_fun(q[0],q[1])];
        }
        catch{
            this.Pole = undefined;
            return false;
        }
        try{
            this.Pole([]);
            createInputs();
            return true;
        }
        catch(e){
            console.log(e);
            this.Pole = undefined;
            return false;
        }
    },
}