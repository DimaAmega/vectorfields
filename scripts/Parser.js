var sin = (x)=>Math.sin(x);
var cos = (x)=>Math.cos(x);
var tan = (x)=>Math.tan(x);
var asin = (x)=>Math.asin(x);
var acos = (x)=>Math.acos(x);

function createInputs(params){
    var after_Element = document.getElementById("dy");
    var variables = Object.keys(Parser.Variables);
    for(var i = 0; i<variables.length;i++){
        var name = document.createElement("p");
        name.innerHTML = variables[i];
        name.setAttribute("class","variables st");
        var input = document.createElement("input");
        input.setAttribute("type","number");
        input.setAttribute("step","0.01");
        input.setAttribute("class","variables");
        input.setAttribute("name",variables[i]);
        input.value = params[variables[i]] || 0;
        input.addEventListener("change",(e)=>{

            var num = Number(e.target.value);
            if(num==NaN) alert("Неправильное задание значения переменной");
            Parser.Variables[e.target.getAttribute("name")]=Number(e.target.value);
            
        });
        after_Element.after(input);
        after_Element.after(name)
    };
    if(Object.keys(Parser.Variables).length){
        var title = document.createElement("p");
        title.innerHTML = "Variables";
        title.setAttribute("class","variables st");
        after_Element.after(title);
    };
};

var Parser = {
    matchFunction: function(match){
        this.Variables[match] = 0;
        return ` Parser.Variables.${match}`;
    },
    parse: function(x_string,y_string){
        var lastVar = document.getElementsByClassName("variables");
        while(lastVar.length) lastVar[0].remove();
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
            alert("wrong!");
            return false;
        }
        try{
            this.Pole([]);
            return true;
        }
        catch{
            this.Pole = undefined;
            alert("wrong!");
            return false;
        }
    },
};



