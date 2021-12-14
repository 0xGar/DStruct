import {$API} from "../api/api.js";
//import {$RouterBridge} from "./routerBridge.js";
import {$GlobalNumber} from "./global.js";

export class DStructElement extends HTMLElement{
    notify(){}
    constructor(html,css){
      super();
    //  this.RouterBridge = $RouterBridge;
      this.API=$API;
      this.html=html;
      this.css=css;
      this.trackerHTML={};
      this.trackerCSS=[];
      this.dataStorage={};
      this.init=false;
      this.renderQueue=[];
      this.onConnectedCallbackVar=[];
      this.onDisconnectedCallbackVar=[];
      this.onSetStateVar=[];
      this.dataStorage={};
      this.id=$GlobalNumber.get();
    }

    setState(index,newState,oldState){
      this.dataStorage[index]=newState;
     // console.log(newState); //TODO Uncomment this. Seems to be running way too much. Why?
      if (this.init===true){
        this.connectedCallback();
      } 
     // this.onSetState(newState,oldState,index);
    }

    /*onSetState(val,oldState,index){
      if (val instanceof Function) 
        this.onSetStateVar.push(val);
      else {
        let f = function() {
          for (var i = 0; i < this.onSetStateVar.length;i++){
              this.onSetStateVar[i](oldState,val,index);
            } 
            this.onSetStateVar=[];
          }.bind(this);
        if (this.init===false){
          this.whenRendered(f);
        } else {
          f();
        }
      }
    }*/

    whenRendered(func){
      if (func !== null) this.renderQueue.push(func);
      if (!this.init) return;
      if (this.renderQueue.length < 1) return;

      let secureArray = [...this.renderQueue]; //Calling setState inside of a renderQueue's function can cause infinite looping. This prevents it.
      this.renderQueue = [];

      for (var i = 0; i < secureArray.length;i++){
        secureArray[i]();
      }
    }

    onConnectedCallback(func){
      if (func !== null) this.onConnectedCallbackVar.push(func);
      if (!this.init) return;
      for (var i = 0; i < this.onConnectedCallbackVar.length;i++){
        this.onConnectedCallbackVar[i]();
      }
    }

    onDisconnectedCallback(func){
      if (func !== null) this.onDisconnectedCallbackVar.push(func);
      if (!this.init) return;
      for (var i = 0; i < this.onDisconnectedCallbackVar.length;i++){
        this.onDisconnectedCallbackVar[i]();
      }
    }

    disconnectedCallback(){
      this.onDisconnectedCallback(null);
    }

    connectedCallback() {
      if (!this.init) {
        let css=this.walkerCSS();
        let final = "<style>" + css + "</style>" + this.walker();
        this.innerHTML = final;
      //  this.appendChild(this.walker());
       // this.walkerCSS();
        this.init=true;

      } else {
        this.walkTheWalker(); //TODO: only execute once page already loaded; not on first load...
      }

      this.whenRendered(null);
      this.onConnectedCallback(null);
    }

    walker(){
      let doc = new DOMParser().parseFromString(this.html, "text/html");
      var ele = doc.querySelectorAll("[d-variable]"); //TODO: Too slow? querySelector isn't O(1)?
      for (var i=0;i<ele.length; i++) {
        let htmlId=$GlobalNumber.get();
        this.walkerProcessor(ele[i],htmlId);
        ele[i].setAttribute("d-id",htmlId);

      }
      return doc.body.innerHTML;
    }

    walkerProcessor(ele,htmlId){
      let variableName = ele.getAttribute("d-variable");
      let variableValue = this.isset(variableName,this.dataStorage);
      let htmlValue = ele.innerText;

      if (variableValue === undefined) { variableValue=""; }

      if (this.trackerHTML[htmlId]===undefined) {
        this.trackerHTML[htmlId]={};
      }

      if (htmlValue !== variableValue) {
        this.trackerHTML[htmlId]=variableValue;

        let htmlValue = document.createTextNode(variableValue);
        let firstChild = ele.firstChild;

        if (firstChild === null){
          ele.appendChild(htmlValue);
        } else {
          ele.firstChild.replaceWith(htmlValue);
        }
      }
    }

    walkTheWalker(){ 
     for (var id in this.trackerHTML){
        let ele = document.querySelector(`[d-id="${id}"]`);
        let htmlId = ele.getAttribute("d-id");
        this.walkerProcessor(ele,htmlId);
      }
    }

    walkTheWalkerCSS(){
      for (var i=0;i<this.trackerCSS.length;i++){
        let track=this.trackerCSS[i];

        let dataKey=track.dataKey;
        let dataValue=track.dataValue;
        let classKey=track.classKey;
        let classNumber=track.classNumber;
        let classValue=track.classValue;

        let oldValue=dataValue;
        let newValue=this.isset(dataKey,this.dataStorage);
        let newVal={};
        let parts={};
        let prop={};

        if (oldValue!=newValue && newValue!==undefined){
          parts=classValue.split(":"); 
          prop=this.CSSToJS(parts[0]);
          newVal=parts[1].replace(/\/\*\{\*\/(.*)\/\*\}\*\//, newValue);
          this.trackerCSS[i].dataValue=newVal;
        } else continue;

        if (!classKey.includes(".")){
          let ele = document[classKey].style;
          if (ele===undefined){
            return;
          }

          ele[prop]=newVal;
  
        } else if (classKey.includes(".")) {
          let ele = document.getElementsByClassName(classKey.replace(".",""));
          if (ele===undefined){
            return;
          }
          for (var i=0;i<ele.length;i++){
            ele[i].style[prop]=newVal;
          }
        }
      }
    }

    CSSToJS(prop){
      let parts = prop.split("-");
      for (var i=1;i<parts.length;i++){
        parts[i][0] = parts[i][0].toUpperCase();
      }
      return parts.join();
    }
    walkerCSS(){ //TODO: remove inner white spaces that're extra for classProperty & className. using trim(), but add another for inner.
      let start=-1;
      let end=-1;
      let inside=-1;
      let dataName="";
      let cssClassName="";
      let cssClassNameCounter=[];
      let cssProperty="";
      let shadow="";
      let dataVal="";
      let found=false;

      for (var i=0;i<this.css.length;i++) {
        if (start == -1 ){
          let checker=false;
          if (this.css[i]==='{' && inside==-1){
            inside=1;
            checker=true;
          }
          else if (this.css[i]==='}') {
            inside=-1;
            checker=true;
            cssClassName="";
          }
          else if (inside==-1) { //Get class name
            cssClassName +=this.css[i];
            checker=true;
          }
          if (checker == true){
            shadow+=this.css[i];
            continue;
          }
        }

        //Eliminated other possibilities above, so must be reading CSS property now.
        //Now have full classname also

        if (this.css[i]!==";"){
          if (this.css[i]=='{') { start=this.css[i]; }
          if (this.css[i]=='}') end=this.css[i];

          if (start == -1) cssProperty += this.css[i];
          else if (end>start){
            dataVal = this.isset(dataName,this.dataStorage);
            if (dataVal!==undefined) {
              cssProperty += `/*{*/` + dataVal + `/*}*/`;

              //Tracker begin
              cssClassName=cssClassName.trim();
              cssProperty=cssProperty.trim();
      
              if (cssClassNameCounter[cssClassName]===undefined)
                cssClassNameCounter[cssClassName]=0;
              else 
                cssClassNameCounter[cssClassName]+=1;
      
              this.trackerCSS.push({
                dataKey:dataName,
                dataValue:dataVal,
                classKey:cssClassName,
                classNumber:cssClassNameCounter[cssClassName],
                classValue:cssProperty
              }) 
              //Tracker end 
            }
            else {
              cssProperty +="/*undef*/";
            }
            //Reset
            cssClassName="";
            dataVal="";
            start=-1;
            end=-1;
          }
          else {
            if (this.css[i]!='{')
              dataName +=this.css[i];
          }
          continue;
        } 

        //Eliminated other possibilities above; must be at end of the property.
        cssProperty=cssProperty.trim();
        shadow += cssProperty + ";";
        cssProperty="";
      }
      return shadow;
    }

    isset(varName,dataStorage) {
      if (dataStorage===undefined) {return undefined;}
      if (dataStorage==={}) { return undefined;}
      let parts=varName.split(".");
      let partial={};
      for (var i=0;i<parts.length;i++){
        if (i==0) {
          if (dataStorage[parts[i]] === undefined) return undefined;
          partial=dataStorage[parts[i]];
        }
        else {
          if (partial[parts[i]]===undefined) return undefined;
            partial=partial[parts[i]];
        }
      }
      if (partial==={}) return undefined;
      return partial;
    }

  }