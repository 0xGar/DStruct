import {$Register} from "./register.js";

class RootRouter {
    constructor() {
       // super();
        this.routes = [];
        this.currentPage="";
        this.subscribeToUrlChangeVariable=[];
    }

    bootloader(){
        this.pushState(window.location.pathname);
        this.listenToLinks();
        this.listenToPopState();
        this.navigator(window.location.pathname);
    }  
    innerHTML(html){
        let ele = document.getElementById("d-router");
        ele.innerHTML = html;
    }

    pushState(url){
        history.pushState({url:url},"", url);    
       // console.log(history);    
    }

    listenToPopState(){
        window.onpopstate = function (event) { 
         //   if (history.state) { 
           //     alert(url);
         //  console.log(history.state);
                this.navigator(history.state.url);
         //   }
        }.bind(this);
    }

    listenToLinks(){
        window.addEventListener("click", function (event) {
            if (event.target.tagName=='A'){
                event.preventDefault();
                //event.stopPropagation();
                let url = new URL(event.target.href).pathname;
                let didNavigateUrl=this.navigator(url);
                if (didNavigateUrl!==undefined){
                    this.pushState(didNavigateUrl);
                }
            }
        }.bind(this));        
    }
    addRoute(path,func,tagName){
        this.routes.push({
            urlPattern:"^" + this.parseUrl(path) + "$",
            page:func,
            tagName:tagName,
            tag:`<`+tagName+`>` + `</`+tagName+`>`});
    }

    navigator(url){
        url = this.parseUrl(url);
        for (var i=0;i<this.routes.length;i++) {
            if (this.compareUrl(url,this.routes[i].urlPattern)){
                return this.navigate(url,this.routes[i]);
            }
        }
        return undefined;
    }
    navigate(url,route) {
        if (this.currentPage != route.tag){
            if (customElements.get(route.tagName)===undefined){
                customElements.define(route.tagName,route.page);
            }
            this.innerHTML(route.tag);
            this.currentPage = route.tag;
            $Register.Broadcast("url","RootRouter",url);  
        } // else {
           document.getElementsByTagName(route.tagName)[0].NUU(url);
     //   }
        return url;
    }
    parseUrl(url){
        url = url + "";
        url = url.toLowerCase();
        //url = url.split('/');
        return url;
    }
    compareUrl(url,urlExp) {
        let exp = new RegExp(urlExp,"");
        if (url.match(exp)===null)
            return false;
        return true;
    }
}

export let $RootRouter = new RootRouter();