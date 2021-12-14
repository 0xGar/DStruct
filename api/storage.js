export class Storage {
    constructor(apiInstance){
        this.API=apiInstance;
        this.dataStorage={};
        this.dataStorage.$internal={};
        this.binders=[];
    }

    glue(callingClass) {
        this.binders.push(callingClass);
        this.updateStorageAll(callingClass);
    }

    checkError(){
    }

    unglue(binderToRemove)
    {
        this.checkError();
        let removeIndex=-1;

        for (var i=0;i < this.binders.length;i++){
            if (this.binders[i]===binderToRemove){
                removeIndex=i;
                break;
            }
        }
        if (removeIndex > -1){
            this.binders[removeIndex] = this.binders[this.binders.length-1];
            this.binders.length = this.binders.length-1;
        }

        if (this.binders.length < 1 ){
            this.dataStorage={};
            this.dataStorage.$internal={};
        }
    }

    setStorage(index,newData) {
        this.checkError();
        let oldState = Object.assign({},this.dataStorage);
        if (this.dataStorage[index]===undefined){
            this.dataStorage[index]={};
        }
        if (oldState[index]===undefined){
            oldState[index]={};
        }
        this.dataStorage[index]=newData;
        this.updateStorage(index,newData,oldState);
    }

    updateStorage(indexStorage,newState, oldState){
        this.checkError();
        this.binders.forEach(
            (binder,index)=> {
                binder.setState(indexStorage,newState,oldState);
            }
        )
    }

    updateStorageAll($this){
        Object.keys(this.dataStorage).forEach(function(key) {
            if (key!=="$internal") 
                $this.setState(key,this.dataStorage[key],{});
          }.bind(this))
    }

    resetStorage(index,value){
        if (this.dataStorage[index]!==undefined)
            this.dataStorage[index]=value;
    }
}
