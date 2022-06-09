let config = require("config.js");
let DingTalkUtil = require("utils/DingTalkUtil.js");
let AppUtil = require("utils/AppUtil.js");
let SystemUtil = require("utils/SystemUtil.js");
let DateUtil = require("utils/DateUtil.js");
let NotifyUtil = require("utils/NotifyUtil.js");
let JavaUtil = require("utils/JavaUtil.js");
let AutojsUtil = require("utils/AutojsUtil.js");
//iConsole = require("components/iConsole.js");
// let BroadcastUtil = require("utils/BroadcastUtil.js");
let iConsole = require("components/consoleN.js");

let _img_target = null;
//脚本退出监听
events.on("exit", function() {
    console.log(">>>auto punch in server Exit;");
    iConsole.close();
    removeTempImage(config.temp_img_path_list);
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
}, config.true_device_text);

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
    if (config.form_diff.location) {
        SystemUtil.gpsCheckAndDo(config.DING_TAILK_PAGE_NAME, true, 5);
        iConsole.info("打开GPS定位成功");
        AutojsUtil.waitForPackage(config.DING_TAILK_PAGE_NAME, 200, 4000);
        iConsole.verbose("跳转回表格界面");
        clickGetAddress(5);
        iConsole.info("点击获取√");
        toast("正在关闭定位");
        SystemUtil.gpsCheckAndDo(config.DING_TAILK_PAGE_NAME, false, 5);
    }

    if (config.form_diff.travelcard) {
        if(!uploadTheTravelCard()){
            toast("获取/上传行程卡失败")
            exit();
        }
    }

    //获取定位之后直接拉到最后提交{控件"提交"没在页面显示时也存在}
    //有时候不存在 原因不明
    while (!className("android.widget.Button").text("提交").exists()) {
        //滑到底部弃用 页面存在提交按钮 可直接click
        swipe(900, 1500, 900, 900, 1000)
        sleep(1000);
    }

    let SubmitResult = AutojsUtil.untilTask.do(() => {
            //查看你(提交/修改)的表单 文本存在
            return textContains("的表单").exists();
        }).ifnot(() => {
            toastLog("正在尝试点击提交按钮..")
            className("android.widget.Button").text("提交").findOne(2000).click();
        }, 5)
        .start();

    iConsole.info("你成功提交每日健康打卡");

    // textContains("的表单").waitFor();

    //iConsole.watermarkModule(true);
    SystemUtil.autoScreenshot(config.image_path, config.true_device_text.autoScreenshot);
    //iConsole.watermarkModule(false);
    iConsole.info("已完成自动截屏，正在发送至" + config.group_name);
    DingTalkUtil.shareImageToDingTallk(config.group_name, config.image_path);
    sleep(1000);
    iConsole.info("打卡截图已发送");
    //记录日志 发送通知
    writeLog(DateUtil.getFormatLogDate() + "已完成" + DateUtil.getFormatDate() + "打卡");

    let notifyTitle = "√已完成今日打卡";
    let notifyText = "已发送至打卡群 " + DateUtil.getFormatLogDate();
    NotifyUtil.sendNotify(0x7A7A6573, notifyTitle, notifyText);
    iConsole.info("正在等待上传完毕...");/* 应做一个判断而不是sleep*/
    iConsole.log("脚本将在5s后关闭");
    sleep(5000)
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

/* 点击表格定位*/
function clickGetAddress(limit) {
    let stopCount = 0;
    while (!text("刷新").exists() || !text("地点微调").exists()) {
        iConsole.log("点击获取.. (" + stopCount + "/" + limit + ")");
        if (text("获取").exists()) {
            text("获取")
                .findOne().clickCenter();
            sleep(1000);
        } else {
            iConsole.log("[获取]按钮已不存在");
        }
        stopCount++;
        if (stopCount >= limit) {
            break;
        }
    }

}

/* 点击表格上传行程卡*/
function uploadTheTravelCard() {
    //打开通信大数据行程卡
    if (launchPackage("com.caict.xingchengka")) {
        let travelcardResult = AutojsUtil.untilTask.do(() => {
                return AutojsUtil.waitForActivity("com.caict.xingchengka.activity.ResultActivity", 200, 3000);
            }).ifnot(() => {
                toastLog("重新尝试查询行程卡")
                back();
                sleep(800);
                launchPackage("com.caict.xingchengka");
            }, 10)
            .start();
        if (!travelcardResult) {
            toastLog("获取行程卡失败！");
            iConsole.error("travelcardResult -> ", travelcardResult);
            return false;
        }
        SystemUtil.autoScreenshot(config.img_path_travelcard, config.true_device_text.allow_screenshort);
        tempTransit(config.img_path_travelcard, "png");
        back();
        AutojsUtil.waitForActivity("com.alibaba.lightapp.runtime.activity.CommonWebViewActivity", 200, 5000);
        toastLog("等待表格加载完毕...");
        sleep(2000);
        let plus_img = className("android.widget.Image").text("plus").findOne(2000);
        if (plus_img != null) {
            plus_img.click();
        } else {
            toastLog("表格中找不到上传行程卡选项！");
            iConsole.error("plus_img -> ", plus_img);
            return false;
        }
        id("album_item_media_cbx_icon").findOne(2000).click();
        _img_target = $images.read("./images/correct_selection_tripcard_true.png");
        /*try {
            let pos = $images.findImage(captureScreen(), _img_target);
            if (pos) {
                id("btn_send").findOne(2000).clickCenter();
            } else {
                toastLog("选择的图片可能不是行程卡！取消上传");
                iConsole.error("findImage 匹配行程卡 -> false")
            }

        } catch (e) {
            iConsole.error("图片对比异常！:",e);
        }*/
        /*// 监听屏幕截图(异步 暂时不使用)
        $images.on("screen_capture", capture => {
            let pos = $images.findImage(capture, target);
        });*/
        /* 跳过前面的行程卡验证，有bug*/
        id("btn_send").findOne(2000).clickCenter();
        return true;
    } else {
        toast("请检查是否安装通信行程卡APP");
        iConsole.error("launchPackage(com.caict.xingchengka) = fasle", "请检查是否安装通信行程卡APP");
        return false;
    }
}

function tempTransit(origin_file, file_type) {
    let temp_path = "/sdcard/temp_transit_file_0x7a7a" + JavaUtil.load_Time() + "." + file_type;
    config.temp_img_path_list.push(temp_path);
    $files.copy(origin_file, temp_path);
    //通知相册，让钉钉选择图片时能获取到最新截图 
    media.scanFile(temp_path);
    return temp_path;
}

function removeTempImage(tamplist) {
    for (let i = 0; i < tamplist.length; i++) {
        $files.remove(tamplist[i]);
    }
    if (_img_target != null) {
        _img_target.recycle();
    }
}
setInterval(() => {}, 2000);