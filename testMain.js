importClass(android.content.pm.PackageManager);
importClass(android.Manifest);
importClass(android.Manifest.permission);
//importClass(android.content.Context);
UnitsTest = require("./unit/UnitsTest.js");
let DingTalkUtil = require("./utils/DingTalkUtil.js");
let config = require("./config.js");
let AppUtil = require("./utils/AppUtil.js");
let SystemUtil = require("./utils/SystemUtil.js");
let AutojsUtil = require("./utils/AutojsUtil.js");
let DateUtil = require("./utils/DateUtil.js");
let NotifyUtil = require("./utils/NotifyUtil.js");

events.on("exit", function() {
    log("结束测试");
    /*先不删除  if ($files.exists(config.temp_img_path)) {
          $files.remove(config.temp_img_path);
      }*/
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
                    success: function() {
                        UnitsTest.setTestStatu(this.unitName, UnitsTest.SUCCESS);
                    },
                    failed: function(log) {
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
            clickGetAddress(5)
        }
    })
    .addUnitTest({
        unitName: "行程卡截图上传",
        unit: () => {
            DingTalkUtil.openTablePage("dingbbba5d77bd1bf41eacaaa37764f94726");
            waitForActivity(config.TABLE_PAGE_ACTIVITY, 5000);
            toastLog("启动钉钉智能填表页面");
            
            let array_find_step = "填写->全员健康每日打卡->今天".split("->");
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
            toastLog("进入健康打卡表");




            //打开通信大数据行程卡
            launchPackage("com.caict.xingchengka");

            AutojsUtil.untilTask.do(() => {
                    return AutojsUtil.waitForActivity("com.caict.xingchengka.activity.ResultActivity", 200, 3000);
                }).ifnot(() => {
                    toastLog("重新尝试")
                    back();
                    sleep(800);
                    launchPackage("com.caict.xingchengka");
                }, 5)
                .start();
            SystemUtil.autoScreenshot(config.image_path, config.true_device_text.allow_screenshort);
            let temp_path = tempTransit(config.image_path, "png")
            back();
            //app.startActivity("com.alibaba.lightapp.runtime.activity.CommonWebViewActivity");
            AutojsUtil.waitForActivity("com.alibaba.lightapp.runtime.activity.CommonWebViewActivity", 200,5000);
            toastLog("等待表格加载...")
            sleep(2000)
            className("android.widget.Image").text("plus").findOne(2000).click()
            id("album_item_media_cbx_icon").findOne(2000).click();
            

            
            
            let target = $images.read("./images/correct_selection_tripcard_true.png");
           // let capimg = $images.read("/sdcard/test.png");
            $events.on('exit', () => {target.recycle();});
            let pos = $images.findImage(captureScreen(), target);
            // 打印
            console.log("找到图片>",pos);
            /*// 监听屏幕截图
            $images.on("screen_capture", capture => {
                // 找图
                let pos = $images.findImage(capture, target);
                // 打印
                console.log(pos);
            });*/

            id("btn_send").findOne(2000).clickCenter()
        }
    }).addUnitTest({
        unitName: "其他",
        unit: () => {
            /*app.startActivity({
                action: "VIEW",
                //支付宝行程卡appid
                data: "alipays://platformapi/startapp?appId=2021002170600786"
            });*/
            //toastLog(iwaitForActivity("com.caict.xingchengka.activity.ResultActivity", 200, 5000));
            AutojsUtil.untilTask.do(() => {
                    return AutojsUtil.waitForActivity("com.caict.xingchengka.activity.ResultActivity", 200, 3000);
                }).ifnot(() => {
                    toastLog("重新尝试")
                    back();
                    sleep(800);
                    launchPackage("com.caict.xingchengka");
                }, 5)
                .start();
        }
    })
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
    let temp_path = "/sdcard/temp_transit_file_0x7a7a" + load_Time() + "." + file_type;
    /*await*/
    /*if($files.copy(origin_file, temp_path)){
        if(!$files.exists(temp_path)){
            sleep(500);
        }
    }else if(){
        this(origin_file,file_type);
    }*/
    $files.copy(origin_file, temp_path);
    //把图片加入相册 
    media.scanFile(temp_path);
    return temp_path;
}

function load_Time() {
    return new java.text.SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());
}