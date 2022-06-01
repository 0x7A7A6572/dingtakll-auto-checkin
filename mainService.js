let config = require("config.js");
let DingTalkUtil = require("utils/DingTalkUtil.js");
let AppUtil = require("utils/AppUtil.js");
let SystemUtil = require("utils/SystemUtil.js");
let DateUtil = require("utils/DateUtil.js");
let NotifyUtil = require("utils/NotifyUtil.js");
//iConsole = require("components/iConsole.js");
// let BroadcastUtil = require("utils/BroadcastUtil.js");
iConsole = require("components/consoleN.js");

//脚本退出监听
events.on("exit", function() {
    console.log(">>>auto punch in server EXit;")
    iConsole.close();
    if ($files.exists(config.temp_img_path)) {
        $files.remove(config.temp_img_path);
    }
    //BroadcastUtil.send("iConsoleCloseView",true);
});


config.init();
if (config.show_logcat_flotwindow) {
    iConsole.init(null, engines.myEngine());
}
SystemUtil.unlock(config.lock_password, {
    success: function() {
        serviceMain();
    },
    failed: function(log) {
        console.warn(log);
    }
},config.true_device_text);

function serviceMain() {
    DingTalkUtil.openTablePage(config.CORP_ID);
    waitForActivity(config.TABLE_PAGE_ACTIVITY, 5000);
    iConsole.info("启动钉钉智能填表页面");
    let missionAccomplished = false;
    let array_find_step = config.find_form_step_is_from_text.split("->");
    let find_form_failure_limit = 5;
    for (let i = 0; i < array_find_step.length; i++) {
        //findOne(5000) -> 可能因网络不佳，内存不足等多种问题造成延迟
        if (textContains(array_find_step[i]).findOne(5000) != null) {
            click(array_find_step[i]);
            if (array_find_step[i] == "填写") {
                sleep(2000);
                if (text("暂无数据").exists()) {
                    //如果表格未显示，就在"已完成"找
                    click("已完成");
                }
            }
        } else {
            toastLog("未找到[" + array_find_step[i] + "]");
            iConsole.error("未找到[" + array_find_step[i] + "]");
            exit();
        }
    }
    iConsole.info("进入健康打卡表");
    // missionAccomplished = (notfound && i == FIND_FORM_STEP_IS_FROM_TEXT.length - 1) ? false : true;
    //while ( text(FORM_TITLE).findOne()) {}
    // Util.gpsCheck(DING_TAILK_PAGE_NAME, true);
    //console.log(currentActivity());
    SystemUtil.gpsCheckAndDo(config.DING_TAILK_PAGE_NAME, true, 5);
    iConsole.info("打开GPS定位成功");
    /* importClass(android.location.LocationManager);

    importClass(android.content.Context);

    var locationManager = context.getSystemService(Context.LOCATION_SERVICE);
  
    console.warn("GPS是否打开",locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER));
  */
    waitForPackage(config.DING_TAILK_PAGE_NAME, 3000);
    iConsole.verbose("跳转回表格界面");
    //textContains("获取").waitFor();
    //toastLog("waitForPackage(DING_TAILK_PAGE_NAME) ok")
    //autojs 控件查找不在屏幕上也可以点击
    /* 报错空值
   className("android.view.View")
    .text("获取")
    .findOne(2000)
    .click();
  toastLog("auto click 获取 ok")
  */
    /*while (!text("获取").exists()){
        print("text 获取 no exitsts , do swipe");
        swipe(900, 1000, 900, 900, 1000);
        sleep(1000);
    }*/
    clickGetAddress(5);
    /*AutoJsUtil.clickCoordinate(className("android.view.View")
        .text("获取")
        .findOne());
        
    // toastLog("util click 获取 ok")
    //textContains("刷新").waitFor();
    while (!text("刷新").exists() || !text("地点微调").exists()) {
        console.log("点击获取ing")
        text("获取")
            .findOne().clickCenter();
        sleep(1000);
    }*/

    iConsole.info("点击获取√")
    toast("正在关闭定位");
    SystemUtil.gpsCheckAndDo(config.DING_TAILK_PAGE_NAME, false, 5);
    //获取定位之后直接拉到最后提交{控件"提交"没在页面显示时也存在}
    //有时候不存在 原因不明
    while (!text("提交").exists()) {
        //滑到底部弃用 页面存在提交按钮 可直接click
        swipe(900, 1500, 900, 900, 1000)
        sleep(1000);
    }
    text("提交").findOne().click()

    iConsole.info("你成功提交运营分公司每日健康打卡");
    //查看你(提交/修改)的表单
    textContains("的表单").waitFor();

    iConsole.watermarkModule(true);
    SystemUtil.autoScreenshot(config.image_path);
    iConsole.watermarkModule(false);
    iConsole.info("已完成自动截屏，正在发送至" + config.group_name);
    DingTalkUtil.shareImageToDingTallk(config.group_name, config.image_path);
    sleep(1000);
    iConsole.info("打卡截图已发送");
    //记录日志 发送通知
    writeLog(DateUtil.getFormatLogDate() + "已完成" + DateUtil.getFormatDate() + "打卡");

    let notifyTitle = "√已完成今日打卡";
    let notifyText = "已发送至打卡群 " + DateUtil.getFormatLogDate();
    NotifyUtil.sendNotify(0x7A7A6573, notifyTitle, notifyText);
    iConsole.close();
    //结束所有脚本
    exit();

}

/**
 * 写入日志
 */
function writeLog(text) {
    var storage = storages.create("AutoHealthPunchInDataBase");
    let str = storage.get("log");
    str = text + "\n" + str;
    storage.put("log", str);
}

/* */
function clickGetAddress(limit) {
    let stopCount = 0;
    while (!text("刷新").exists() || !text("地点微调").exists()) {
        console.log("点击获取.. (" + stopCount + "/" + limit + ")");
        if (text("获取").exists()) {
            text("获取")
                .findOne().clickCenter();
            sleep(1000);
        } else {
            console.log("[获取]按钮已不存在");
        }
        stopCount++;
        if (stopCount >= limit) {
            break;
        }
    }

}



setInterval(() => {}, 2000);