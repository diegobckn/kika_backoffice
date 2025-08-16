class LongClick {
    //in seconds
    limit:number = 0
    goInterval:number = 0

    myInterval:any = null

    clickAction:any=null
    longclickAction:any=null

    longActionDone=false

    canceled = false

    myCount = 0

    static count:number = 0
    static list:any = []
    static selectedObj = 0


    constructor(limitInSeconds){
        LongClick.count++
        this.myCount = LongClick.count
        LongClick.list[this.myCount] = (this)
        this.limit = limitInSeconds
    }

    intervalAction(){
        this.goInterval+=1
        // console.log("checkinterval.." + this.goInterval)
        if(this.goInterval >= this.limit){
            // console.log("llego al limite")
            this.goInterval = 0
            this.longActionDone = true
            if(this.longclickAction)
                this.longclickAction()
            this.cancel()
        }
    }

    onStart(){
        LongClick.selectedObj = this.myCount
        this.longActionDone = false
        this.canceled = false
        this.myInterval = setInterval(()=>this.intervalAction(),900)
    }
    
    onEnd(){
        var me = LongClick.list[LongClick.selectedObj]
        me.goInterval = 0
        if(me.myInterval!=null){
            clearInterval(me.myInterval)
        }
        me.myInterval = null
        if(me.longActionDone) return
        if(me.canceled) return
        if(me.clickAction)me.clickAction()
    }

    cancel(){
        this.goInterval = 0
        if(this.myInterval!=null){
            clearInterval(this.myInterval)
        }
        this.myInterval = null
        this.canceled = true
    }

    onClick(callbackAction){
        this.clickAction = callbackAction
    }

    onLongClick(callbackAction){
        this.longclickAction = callbackAction
    }

}


export default LongClick;