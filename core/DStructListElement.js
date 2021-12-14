
import {Page} from "./Page.js";

export class DStructListElement extends Page {
    constructor(obj){
        super(obj);
        this.arrayPathToDataStorageArray = obj.dataStorageArrayPath;
        this.dataStorageArrayId = obj.dataStorageArrayId;
        this.dataStorageArrayContent = obj.dataStorageArrayContent;
        this.elementFunction = obj.elementFunction;
        this.HTMLContainer = obj.HTMLContainer;
    }

    setState(index,newState,oldState) {
        super.setState(index,newState,oldState);
        this.whenRendered(
            function (){
                this.updateList(newState,oldState,this.arrayPathToDataStorageArray);
            }.bind(this)
        )
    }

    updateList(newDataStorage,oldDataStorage,index) {
        oldDataStorage = this.isset(index,oldDataStorage);
        newDataStorage = this.isset(index,this.dataStorage);

        if (newDataStorage === null) {
            console.log("DList Error: Null encountered.")
            return;
        }
        if (newDataStorage === undefined){
            console.log("DList Error: arrayPath must be a string pointing to an array within this.dataStorage");
            return;
        }
        if (newDataStorage.constructor !== Array){
            console.log("DList Error: arrayPath is not an array.")
            return;
        }

        if (oldDataStorage === undefined || oldDataStorage=== null){
            oldDataStorage=[];
        }

        let newDataStorageLen = newDataStorage.length;
        let oldDataStorageLen = oldDataStorage.length;
        let valuesToUpdate=[];

        for (var i = 0; i < oldDataStorageLen && i < newDataStorageLen;i++){
            let oldStorageId = oldDataStorage[i][this.dataStorageArrayId];
            let newStorageId = newDataStorage[i][this.dataStorageArrayId];
            let oldText = oldDataStorage[i][this.dataStorageArrayContent];
            let newText = newDataStorage[i][this.dataStorageArrayContent];
            if (oldStorageId !== newStorageId || newText !== oldText){
                valuesToUpdate.push({oldStorageId:oldStorageId,newStorageId:newStorageId,index:i});
            }
        }

        let length=0;
        let resetAll = false;

        if (newDataStorageLen > oldDataStorageLen){ 
            length=oldDataStorageLen; 
        }
        else if (newDataStorageLen < oldDataStorageLen) { length=0; resetAll=true; }

        if (newDataStorageLen > oldDataStorageLen || newDataStorageLen < oldDataStorageLen){
            for (var i = length; i < newDataStorageLen;i++){
                valuesToUpdate.push({oldStorageId:null,newStorageId:newDataStorage[i][this.dataStorageArrayId],index:i});
            }
        }

        for (var i = 0; i < valuesToUpdate.length;i++){
            if (valuesToUpdate[i].oldStorageId===null){
                let ele = document.getElementById(this.HTMLContainer);
                if (resetAll) { ele.innerHTML=""; resetAll=false; }
                ele.appendChild(this._makeElement(valuesToUpdate[i].index,newDataStorage));
            } else {
                let ele = document.querySelector(`[data-id="${valuesToUpdate[i].oldStorageId}"]`);
                ele.replaceWith(this._makeElement(valuesToUpdate[i].index,newDataStorage));
            }

        }
    }

    _makeElement(index,newDataStorage){
        let listEntry = newDataStorage[index];
        let ele = document.createElement("div");
        let resultElement = this.elementFunction(index,newDataStorage);
        let doc = new DOMParser().parseFromString(resultElement, "text/html");
        ele.setAttribute("data-id",listEntry[this.dataStorageArrayId]);
        ele.appendChild(doc.childNodes[0].childNodes[1].childNodes[0]);
        return ele;
    }


}

