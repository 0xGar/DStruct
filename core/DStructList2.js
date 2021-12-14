
import {Page} from "./Page.js";

export class DStructList2 extends Page {
    constructor(obj){
        super(obj);
        this.listId=obj.listId;
        this.paging=obj.paging;
        this.element=obj.element;
        this.dataPath=obj.dataPath;
    }

    renderBlankList(){
        let elements="";
        let ele = document.querySelector(`[data-dListId="${this.listId}"]`);
        for (var i=0;i<this.paging;i++){
            elements += this.element;
        }
        ele.innerHTML = elements;
    }

    insertIntoList(page,data) {
        data = this.isset(this.dataPath,data);
      //  console.log( data[page][this.dataPath] );
        //Insert all data elements belonging to page entry data[5] would be 5th page)
        let elements = document.querySelector(`[data-dListId="${this.listId}"]`).children;
        for (var i = page*this.paging,x=0; x < data.length && i < elements.length; i++,x++) {
            //Part 1
            let elements2 = elements[i].querySelectorAll(`*`);
            for (var j=0; j < elements2.length; j++){
                let element3 = elements2[j];
                let attributes = element3.attributes;
                for (var w = 0; w < attributes.length;w++){
                    let value = attributes[w].value;
                    let name = attributes[w].name;
                    if (name === "d-variable"){
                        let dataVar = this.isset(value,data[i]);
                        if (dataVar !== undefined){
                            element3.innerText = dataVar;
                        }
                    } else {
                        console.log(value);
                        let dataVariable= value.match(/\{(.*)\}/);
                        if (dataVariable === null) continue;
                        dataVariable = dataVariable[1];

                        let val = this.isset(dataVariable,data[i]);
                        let newValue = value.replace(/\{.*\}/,val);
                        attributes[w].value = newValue;
                    }
                }
            }
            //Part 1 END


        }

        //Remove extra HTML elements
        if (elements.length > data[page].length){
            let elementsToDelete=[];
            for (var i = data[page].length; i < elements.length;i++){
                elementsToDelete.push(elements[i]);
            }
            for (var i=0; i < elementsToDelete.length;i++){
                elements.removeChild(elementsToDelete[i]);
            }
        }
    }
}

