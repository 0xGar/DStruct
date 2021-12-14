class Register {
    constructor(){
        this.collection = {};
    }
    putSubscription(action,channel,subscriberFunc,caller){ //string, function, channel
        this._checks(action,channel);
        this.collection[channel][action].subscribers.push({func:subscriberFunc,caller:caller});
        //Send current buffer to the new subscriber
        this._sendToSubscriber(subscriberFunc,this.collection[channel][action].historyBuffer);
    }

    deleteSubscription(action,channel,caller){
        let deleteIndex=-1;
        for (var i=0;i<this.collection[channel][action].subscribers.length;i++){
            if (this.collection[channel][action].subscribers[i].caller===caller){
                deleteIndex=i;
                break;
            }
        }
        if (deleteIndex > -1){
            this.collection[channel][action].subscribers.splice(i,1);
        }
    }

    Broadcast(action,channel,data){
        this._checks(action,channel);
        //Buffer control
        if (this.collection[channel][action].historyBuffer.length > 5) this.collection[channel][action].historyBuffer=[];
        //Add data update to history buffer. Newest goes first.
        this.collection[channel][action].historyBuffer.unshift(data);
        //Send history buffer to all subscribers
        for (var i=0; i < this.collection[channel][action].subscribers.length;i++){
            this._sendToSubscriber(this.collection[channel][action].subscribers[i].func,
                this.collection[channel][action].historyBuffer);
        }
    }
    _checks(action,channel){
        if (this.collection[channel]===undefined){
            this.collection[channel]=[];
        }
        if (this.collection[channel][action]===undefined){
            this.collection[channel][action]={subscribers:[],historyBuffer:[]};
        }
    }
    _sendToSubscriber(func,historyBuffer){
        if (historyBuffer.length > 0)
            func(historyBuffer);
    }
}

export let $Register = new Register();