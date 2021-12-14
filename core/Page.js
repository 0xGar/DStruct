import {DStructElement} from "./DStructElement.js";
export class Page extends DStructElement {
    constructor(obj) {
        super(obj.html,obj.css);
        for (var i=0;i<obj.customElements.length;i++){ //Not for this main class; for custom elements in obj.customElements, contained within obj.html
            if (customElements.get(obj.customElements[i].name)===undefined){
                customElements.define(obj.customElements[i].name, obj.customElements[i].page);
            }
        }
    }
    NUU(url){ //notify update url
    }
}