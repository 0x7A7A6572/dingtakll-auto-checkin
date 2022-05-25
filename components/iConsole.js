importPackage(android.view);
importClass(android.graphics.Color);
importClass(android.content.Context);
importClass(android.view.WindowManager);
importClass("android.view.Gravity");
let BroadcastUtil = require("../utils/BroadcastUtil.js");

iConsole = {
    ctx:context,
    BROADCAST_CLOSE_EXTRA: "iConsoleCloseView",
    logList: [],
    stopScriptOnExit: true,
    floatWindow: null,
    decorView: ui.inflate(
            <vertical bg="#FFFFFF">
              <text id="logText" textSize="10sp" textColor="green" text="????"/>
              <text text="POWER FOR zzerX →" textStyle="bold" textColor="green" />
            </vertical>),
    logLine: 4, //显示的日志条目
    getDecorView: function() {
        return this.floatWindow;
    },
    setLogLine: function(count) {
        this.logLine = count;
        return this;
    },
    setStopScriptOnExit: function(boolean) {
        this.stopScriptOnExit = boolean;
        return this;
    },
    show: function(wm) {
         wm = wm || getWindowManager();
        let layoutParams = new WindowManager.LayoutParams();
        layoutParams.width = WindowManager.LayoutParams.WRAP_CONTENT;
        layoutParams.height = WindowManager.LayoutParams.WRAP_CONTENT;
        //使控件始终在最上⽅
        layoutParams.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        //无焦点无触摸事件
        layoutParams.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE |
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS;
        //WindowManager.LayoutParams.FLAG_FULLSCREEN|
        //WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN|
        // WindowManager.LayoutParams.TYPE_STATUS_BAR;

        //这个Gravity  移动需要
        layoutParams.gravity = Gravity.LEFT | Gravity.TOP;
        layoutParams.alpha = 0.5; //穿透必须

        /*this.decorView = ui.inflate(
            <vertical bg="#FFFFFF">
              <text id="logText" textSize="10sp" textColor="#33CC55" text="????"/>
              <text text="POWER FOR zzerX." textStyle="bold"/>
            </vertical>)*/

        wm.addView(this.decorView, layoutParams);
        BroadcastUtil.register((context, intent) => {
            let msg = intent.getStringExtra(this.BROADCAST_CLOSE_EXTRA);
            if (msg || msg == "true") {
                this.close();
                console.verbose("iConsole closed.")
            }
        })
        //return this;
    },
    showRaw: function(){
       this.floatWindow = floaty.window( <vertical bg="#FFFFFF">
              <text id="logText" textSize="10sp" textColor="green" text="????"/>
              <text text="POWER FOR zzerX →" textStyle="bold" textColor="green" />
            </vertical>);
            
    },
    close: function() {
        getWindowManager().removeView(this.decorView);
        if (this.stopScriptOnExit) {
            $engines.stopAll();
        }
    },
    log: function() {
        this.updateLogView([].slice.call(arguments));
        console.log(arguments);
    },
    verbose: function() {
        this.updateLogView([].slice.call(arguments));
        console.verbose(arguments);
    },
    warn: function() {
        this.updateLogView([].slice.call(arguments));
        console.warn(arguments);
    },
    info: function() {
        this.updateLogView([].slice.call(arguments));
        console.info(arguments);
    },
    updateLogView: function(){
        let arg = "";
        for (let i = 0; i < arguments.length; i++) {
            arg += arguments[i] + " ";
        }
        this.logList.push(arg);
        let [limit_array, maxlength] = getTextLines(this.logList,  this.logLine, true);
        let line_text = createLineText("_", maxlength);
        if (this.floatWindow != null) {
             this.floatWindow.logText.setText(line_text + "\n" + limit_array.join("\n"));
        }
        
    },
    watermarkModule: function(isSet){
            this.decorView.logText.setVisibility(isSet ? View.GONE : View.VISIBLE);

    },
    __getParent: function(){
        return this;
    }
    
}


function getWindowManager() {
    return context.getSystemService(Context.WINDOW_SERVICE);
}


function getTextLines(array, count, backwards) {
    let maxlength = 0;
    let _array = [];
    let limit = count >= array.length ? 0 : array.length - count;
    if (backwards) {
        for (let i = limit; i < array.length; i++) {
            _array.push(array[i]);
            maxlength = maxlength < array[i].length ? array[i].length : maxlength;
        }
    } else {
        for (let i = 0; i < limit; i++) {
            _array.push(array[i]);

        }
    }
    return [_array, maxlength];
}

function createLineText(str, length) {
    let t = "";
    for (let i = 0; i < length; i++) {
        t += str;
    }
    return t;
}
module.exports = iConsole;