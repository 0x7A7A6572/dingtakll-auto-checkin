importClass(android.content.pm.PackageManager);
importClass(android.Manifest);
importClass(android.Manifest.permission);
//importClass(android.content.Context);
UnitsTest = require("./unit/UnitsTest.js");
let DingTalkUtil = require("./utils/DingTalkUtil.js");
let config = require("./config.js");
let AppUtil = require("./utils/AppUtil.js");
let SystemUtil = require("./utils/SystemUtil.js");
let AutoJsUtil = require("./utils/AutoJsUtil.js");
let DateUtil = require("./utils/DateUtil.js");
let NotifyUtil = require("./utils/NotifyUtil.js");
let iConsole = require("./components/iConsole.js");


events.on("exit", function() {
    log("结束测试");
});

//config.init();
let ctx = context;
UnitsTest.setTitle("单元测试")
    .addUnitTest({
        unitName: "打开/关闭定位",
        //unitScript:"./testUtil.js",
        unit: () => {
            //UnitsTest.setTestStatu(this.unitName, UnitsTest.TESTING);
            //console.info("开始测试")
            //console.warn(AppUtil.gpsIsOpen());
            let needto = AppUtil.gpsIsOpen() ? "关闭" : "打开";
            toast("正在测试" + needto + "定位");
            AppUtil.gpsCheck(null, !AppUtil.gpsIsOpen());
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
            let password = dialogs.input("请输入你的锁屏密码进行测试,点击确认之后手动锁屏等待5s ～ 8s", null);
            toast("现在请锁屏等待，如果开启了面部识别，请遮挡过斜视")
            sleep(5000);
            SystemUtil.unlock(password, {
                success: function() {
                    UnitsTest.setTestStatu(this.unitName, UnitsTest.SUCCESS);
                },
                failed: function(log) {
                    UnitsTest.setTestStatu(this.unitName, UnitsTest.FAILED);
                }
            });


        }
    })
    .addUnitTest({
        unitName: "截图分享测试",
        unit: () => {
            let group = dialogs.rawInput("请输入需要分享的群聊名，发给自己就输入\n我（姓名）\n括号为中文符", "");
            SystemUtil.autoScreenshot(config.image_path);
            DingTalkUtil.shareImageToDingTallk(group, config.image_path);
        }
    }).addUnitTest({
        unitName: "截图路径查看",
        unit: () => {
            alert("截图保存路径",
                "截图1:" + files.cwd() + "/screenshot.png" +
                "\n\n截图2:" + config.image_path);


        }
    })
    .show()
sleep(3000);




function lacksPermission() {

    return context.checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_DENIED;

}

