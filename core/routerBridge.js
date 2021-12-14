/*import {$RootRouter} from "./RootRouter.js";

class RouterBridge {
    constructor(){

    }
    subscribeToUrlChange($this){
  
        $RootRouter.subscribeToUrlChange($this);
    }
    unsubscribeToUrlChange(t){
        let r = customElements.get("r-router");
        if (r === undefined){
            console.log("Can't unsubscribe to URL changes; router not found.");
            return;
        }
        r.unsubscribeToUrlChange(t);
    }
}

export let $RouterBridge = new RouterBridge();*/