/*
 * @Author: zzerX
 * @Date:
 * @Last Modified by: zzerX
 * @Last Modified time:
 * @Description: 悬浮穿透控制台，用于在脚本运行时显示关键操作日志
 */
importPackage(android.view);
importClass(android.graphics.Color);
importClass(android.content.Context);
importClass(android.view.WindowManager);
importClass("android.view.Gravity");
//let BroadcastUtil = require("../utils/BroadcastUtil.js");

let consoleN = {
    // 悬浮实例
    floatWindow_statu: false,
    BROADCAST_CLOSE_EXTRA: "iConsoleCloseView",
    logList: [],
    stopScriptOnExit: true,
    instacne: null,
    thread: null,
    logLine: 8, //显示的日志条目
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
    // 初始化

    init: function(wm) {

        if (!!this.instacne) return;

        this.instacne = ui.inflate(
            <vertical bg="#000000">
                        <text text="consoleN" textStyle="bold" textColor="red"/>
                        <text id="logText" textSize="10sp" textColor="green" text=""/>
                    </vertical>);
        wm = wm || getWindowManager();
        let lp = new WindowManager.LayoutParams();
        lp.width = WindowManager.LayoutParams.WRAP_CONTENT;
        lp.height = WindowManager.LayoutParams.WRAP_CONTENT;
        //使控件始终在最上⽅
        lp.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        //无焦点无触摸事件
        lp.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE |
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS;
        //这个Gravity  移动需要
        lp.gravity = Gravity.LEFT | Gravity.BOTTOM;
        lp.alpha = 0.5; //穿透必须


        ui.post(() => {
            wm.addView(this.instacne, lp);
            this.floatWindow_statu = true;
        });

        /*  threads.start(() => {
            //设置一个空的定时来保持线程的运行状态
            setInterval(function() {}, 1000);
        });*/
    },


    // 销毁


    close: function() {
        //console.warn(".close");
        if (this.instacne != null && this.floatWindow_statu == true) {
            getWindowManager().removeView(this.instacne);
            this.floatWindow_statu = false;
        }
        if (this.stopScriptOnExit) {
            $engines.stopAll();
        }
    },
    log: function() {
        this.updateLogView([].slice.call(arguments));
        console.log([].slice.call(arguments));
    },
    verbose: function() {
        this.updateLogView([].slice.call(arguments));
        console.verbose([].slice.call(arguments));
    },
    warn: function() {
        this.updateLogView([].slice.call(arguments));
        console.warn([].slice.call(arguments));
    },
    info: function() {
        this.updateLogView([].slice.call(arguments));
        console.info([].slice.call(arguments));
    },
    error: function() {
        this.updateLogView([].slice.call(arguments));
        console.error([].slice.call(arguments));
    },
    updateLogView: function() {
        let arg = "";
        for (let i = 0; i < arguments.length; i++) {
            arg += arguments[i] + " ";
        }
        this.logList.push(arg);
        let [limit_array, maxlength] = getTextLines(this.logList, this.logLine, true);
        let line_text = createLineText("_", maxlength);
        if (this.instacne != null && this.instacne.logText != null) {
            ui.post(() => {
                this.instacne.logText.setText(line_text + "\n" + limit_array.join("\n"));
            });
        }

    },
    watermarkModule: function(isSet) {
        ui.post(() => {
            this.instacne.logText.setVisibility(isSet ? View.GONE : View.VISIBLE);
        });
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

module.exports = consoleN;