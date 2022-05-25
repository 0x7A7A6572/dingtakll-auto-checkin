importClass(android.graphics.Color);
importClass(android.widget.TextView);
importClass(android.content.Context);
importClass(android.view.WindowManager);
importClass("android.view.Gravity");
importClass("android.graphics.PixelFormat");

let iConsole = require("../components/iConsole.js");
BroadcastUtil = require("../utils/BroadcastUtil.js");
//BroadcastUtil.send(iConsole.BROADCAST_CLOSE_EXTRA,true);
//exit()
iConsole
  .setLogLine(2)
  .show();

/*let fw = iConsole.getRawWindow();
Object.keys(fw).forEach(function(k,v){
    toastLog(k,v)
})*/
//setTouchable(iConsole.getWindowParams(),false)

iConsole.log("uuuuuuuu")


    //脚本退出监听
    events.on("exit", function() {
        if (iConsole != null) {
            iConsole.close();
            iConsole = null;
        }else{
            BroadcastUtil.send("iConsoleCloseView",true);
        }
    });



/*

wm = context.getSystemService(Context.WINDOW_SERVICE);

//设置TextView的属性

let layoutParams = new WindowManager.LayoutParams();

layoutParams.width = WindowManager.LayoutParams.WRAP_CONTENT;

layoutParams.height = WindowManager.LayoutParams.WRAP_CONTENT;

//这⾥是关键。使控件始终在最上⽅

layoutParams.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;

layoutParams.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE |
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
                //WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS|
                //WindowManager.LayoutParams.FLAG_FULLSCREEN|
                //WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN|
               // WindowManager.LayoutParams.TYPE_STATUS_BAR;

//这个Gravity也不能少。不然的话，以下"移动歌词"的时候就会出问题了～ 能够试试[官⽹⽂档有说明]

layoutParams.gravity = Gravity.LEFT | Gravity.TOP;
layoutParams.alpha = 0.8;
//创建⾃⼰定义的TextView

let myView = new TextView(context);

myView.setText("Test Touch\n  d fff\nfff");

myView.setTextColor(Color.RED);
//myView.setTextSize(20.0);
myView.setBackgroundColor(Color.TRANSPARENT);

//监听 OnTouch 事件 为了实现"移动歌词"功能

//myView.setOnTouchListener(this);
let nnn = ui.inflate(<vertical gravity="center" bg="#33000000" >
            <text text="运行中，请勿打断运行！"/>
                <text id="logText" textSize="16sp" textColor="#6633CC55" text="????"/>
            </vertical>)
console.log("11---1")
wm.addView(nnn, layoutParams);

*/

/*
//2. 布局
var w = floaty.rawWindow(
  <frame id="parent" gravity="center" bg="#00f0f0f0">
    <text id="btn" textSize="12sp">
      
    </text>
  </frame>
);

//3. 设置按钮点击事件, 用于测试触摸功能
w.btn.click(function () {
  toastLog("牙叔教程 简单易懂");
});


//4. 设置触摸属性
let  = w.parent.parent;
setTouchable(parentParent, false);


w.setSize(600, 600);


*/
let ggg= 880;
setInterval( ()=> { 
    ggg++;
  // iConsole.log("[" + new Date()+ "]\n" + random(0,19900)); 
   
}, 2000);
setTimeout(()=>{
iConsole.watermarkModule(true)
},5000)
setTimeout(()=>{
    BroadcastUtil.send(iConsole.BROADCAST_CLOSE_EXTRA,true);
},28000)
