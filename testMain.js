importClass(android.content.pm.PackageManager);
importClass(android.Manifest);
importClass(android.Manifest.permission);
//importClass(android.content.Context);
UnitsTest = require("./unit/UnitsTest.js");
let DingTalkUtil = require("./utils/DingTalkUtil.js");
let config = require("./config.js");
let SystemUtil = require("./utils/SystemUtil.js");
let AutojsUtil = require("./utils/AutojsUtil.js");
let DateUtil = require("./utils/DateUtil.js");
let NotifyUtil = require("./utils/NotifyUtil.js");
let JavaUtil = require("utils/JavaUtil.js");
let _img_target = null;

let test_cropid = "dingbbba5d77bd1bf41eacaaa37764f94726";
let test_group_name = "软件测试(DEBUG)";
let test_step = "填写->全员健康每日打卡->今天";


events.on("exit", function () {
    log("结束测试");
    removeTempImage(config.temp_img_path_list);
});

config.init();
let ctx = context;
UnitsTest.setTitle("单元测试")
    .addUnitTest({
        unitName: "打开/关闭定位",
        //unitScript:"./testUtil.js",
        unit: () => {
            //UnitsTest.setTestStatu(this.unitName, UnitsTest.TESTING);
            //console.info("开始测试")
            //console.warn(SystemUtil.gpsIsOpen());
            let needto = SystemUtil.gpsIsOpen() ? "关闭" : "打开";
            toastLog("正在测试" + needto + "定位,型号:" + SystemUtil.getBrand() + SystemUtil.getGpsSwitchText());
            SystemUtil.gpsCheckAndDo(null, !SystemUtil.gpsIsOpen());
            let success = confirm("定位开关是否按照预期开启或关闭？");
            if (success) {
                UnitsTest.setTestStatu(this.unitName, UnitsTest.SUCCESS);
            } else {
                UnitsTest.setTestStatu(this.unitName, UnitsTest.FAILED);
            }

            //
        }
    })
    .addUnitTest({
        unitName: "自动解锁",
        unit: () => {
            let password = dialogs.input("请输入你的锁屏数字密码进行测试,点击确认之后手动锁屏等待5s ～ 8s \n(如果开启了面部识别，请遮挡或斜视)", null);
            if (password != null) {
                toast("现在请锁屏等待触发")
                sleep(6000);
                SystemUtil.unlock(password.toString(), {
                    success: function () {
                        UnitsTest.setTestStatu(this.unitName, UnitsTest.SUCCESS);
                    },
                    failed: function (log) {
                        UnitsTest.setTestStatu(this.unitName, UnitsTest.FAILED);
                    }
                }, config.true_device_text);
            } else {
                toast("取消")
            }

        }
    })
    .addUnitTest({
        unitName: "截图分享测试",
        unit: () => {
            let group = dialogs.rawInput("请输入需要分享的群聊名，发给自己就输入\n我（姓名）\n括号为中文符", "");
            if (group != null && group != "") {
                SystemUtil.autoScreenshot(config.image_path, config.true_device_text.allow_screenshort);
                //UnitsTest.dismiss();
                DingTalkUtil.shareImageToDingTallk(group, config.image_path);
                sleep(2000)
            } else {
                toast("取消");
            }
        }
    }).addUnitTest({
        unitName: "存储文件路径查看",
        unit: () => {
            alert("保存路径",
                "日志:" + context.getExternalCacheDir() + "/log.txt" +
                "\n\n截图:" + config.image_path);
        }
    }).addUnitTest({
        unitName: "点击获取定位(表格界面)",
        unit: () => {
            toFormPage();
            clickGetAddress(5)
        }
    })
    .addUnitTest({
        unitName: "行程卡截图上传",
        unit: () => {
            toFormPage();
            uploadTheTravelCard();
        }
    })
    // .addUnitTest({
    //     unitName: "其他",
    //     unit: () => {
    //         /*app.startActivity({
    //             action: "VIEW",
    //             //支付宝行程卡appid
    //             data: "alipays://platformapi/startapp?appId=2021002170600786"
    //         });*/
    //         //toastLog(iwaitForActivity("com.caict.xingchengka.activity.ResultActivity", 200, 5000));
    //         AutojsUtil.untilTask.do(() => {
    //             return AutojsUtil.waitForActivity("com.caict.xingchengka.activity.ResultActivity", 200, 3000);
    //         }).ifnot(() => {
    //             toastLog("重新尝试")
    //             back();
    //             sleep(800);
    //             launchPackage("com.caict.xingchengka");
    //         }, 5)
    //             .start();
    //     }
    // })
    .show()
sleep(3000);




function lacksPermission() {
    return context.checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_DENIED;
}

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

function tempTransit(origin_file, file_type) {
    let temp_path = "/sdcard/temp_transit_file_0x7a7a" + JavaUtil.load_Time() + "." + file_type;
    config.temp_img_path_list.push(temp_path);
    $files.copy(origin_file, temp_path);
    //通知相册，让钉钉选择图片时能获取到最新截图 
    media.scanFile(temp_path);
    return temp_path;
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
        }, 5)
            .start();
        if (!travelcardResult) {
            toastLog("获取行程卡失败！");
            console.error("travelcardResult -> ",travelcardResult);
            return false;
        }
        SystemUtil.autoScreenshot(config.img_path_travelcard, config.true_device_text.allow_screenshort);
        tempTransit(config.img_path_travelcard, "png");
        back();
        AutojsUtil.waitForActivity("com.alibaba.lightapp.runtime.activity.CommonWebViewActivity", 200, 5000);
        toastLog("等待表格加载完毕...");
        sleep(2000);
        let plus_img = className("android.widget.Image").text("plus").findOne(2000);
        if(plus_img != null){
            plus_img.click();
        }else{
            toastLog("表格中找不到上传行程卡选项！");
            console.error("plus_img -> ",plus_img);
            return false;
        }
        id("album_item_media_cbx_icon").findOne(2000).click();
        _img_target = $images.read("./images/correct_selection_tripcard_true.png");
        let pos = $images.findImage(captureScreen(), _img_target);
        if (pos) {
            id("btn_send").findOne(2000).clickCenter();
        } else {
            toastLog("选择的图片可能不是行程卡！取消上传");
            console.error("findImage 匹配行程卡 -> false")
        }
        /*// 监听屏幕截图(异步 暂时不使用)
        $images.on("screen_capture", capture => {
            let pos = $images.findImage(capture, target);
        });*/
        return true;
    } else {
        toast("请检查是否安装通信行程卡APP");
        console.error("launchPackage(com.caict.xingchengka) = fasle", "请检查是否安装通信行程卡APP");
        return false;
    }
}

function toFormPage(){
    DingTalkUtil.openTablePage(test_cropid);
    waitForActivity(config.TABLE_PAGE_ACTIVITY, 5000);
    toastLog("启动钉钉智能填表页面");
    let array_find_step = test_step.split("->");
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
    toastLog("进入健康打卡表");
}

function removeTempImage(tamplist){
    for(let i = 0;i < tamplist.length; i++){
        $files.remove(tamplist[i]);
    }
    if(_img_target != null){
        _img_target.recycle();
    }
}