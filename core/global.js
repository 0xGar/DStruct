class GlobalNumber {
    constructor(){
        this.id=0;
    }
    get(){
        this.id++;
        return this.id;
    }
}

export let $GlobalNumber = new GlobalNumber();