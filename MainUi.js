"ui";
importClass(android.view.WindowManager);
importClass(android.text.method.ScrollingMovementMethod);
importClass(android.widget.LinearLayout);
importClass(android.widget.LinearLayout.LayoutParams);
importClass(android.widget.TimePicker.OnTimeChangedListener);
importClass("android.view.Gravity");
importClass("android.view.View");
let DialogPlus = require("components/DialogPlus.js");
let JavaUtil = require("utils/JavaUtil.js");
require('components/tuiWidgetDebug.js');
let config = require("config.js");
let detail_is_show = false;
config.init();

//脚本退出监听
events.on("exit", function() {
   /* 先不删除
   if ($files.exists(config.temp_img_path)) {
        $files.remove(config.temp_img_path);
    }
    */
});

ui.layoutFile("./main.xml");

activity.getWindow().setStatusBarColor(Color.WHITE);

var explain_views = [ui.title_treaty, ui.title_explain, ui.title_device_info];

/* ui.explain_box_control.on("click", (view) => {
    boxShowStateBind(view);
}); */

ui.run_script.on("click", () => {
    runService();
});
/* ui.run_script_alert.on("click", () => {
    runService();
}); */
ui.exit_script.on("click", () => {
    toast("已为您退出脚本");
    ui.finish();
    exit();
});

let _tmp_timing = "00:00";
let itimepicker = ui.inflate('<timepicker id="spinner" timePickerMode="spinner" /> '); //timePickerMode="spinner"

itimepicker.spinner.setOnTimeChangedListener(new android.widget.TimePicker.OnTimeChangedListener({
    onTimeChanged: function(view, hour, minute) {
        _tmp_timing = numTimeToTiming(hour, minute);
    }
}));


ui.buttonToSetTiming.on("click", function() {
    let timepickDialog = DialogPlus.setView(itimepicker)
        .setTitle(null)
        .onTrue(function() {
            config.timing = _tmp_timing;
            ui.buttonToSetTiming.setText("定时打卡: " + config.timing);
            config.tingChangedUpdateTask(_tmp_timing);
            timepickDialog.dismiss()
        })
        .onFalse(function() {
            toast("取消")
            timepickDialog.dismiss()
        })
        .build()
    timepickDialog.show();
});


ui.auto_run_ontiming.addOnCheckListen(function(checked) {
    config.auto_run_on_timing = checked;
    config.addTimerIfNotExists(config.script_path);
    toast((checked ? "开启" : "关闭") + "定时任务");
      /* @Discard  addTimerIfNotExists已修复可以判断是否删除 */
    if(!checked){
        config.clearTimedTasks(config.timers_id);
    }
    //config.tingChangedUpdateTask(config.timing);
});

ui.show_logcat_flotwindow.addOnCheckListen(function(checked) {
    config.show_logcat_flotwindow = checked;
    toast((checked ? "开启" : "关闭") + "悬浮窗日志");
});
/*ui.stop_script.on("click", () => {
    toast("已为您停止启动脚本");
    SCRIPT_RUN_AUO = false; 
   // clearInterval(change_text);
     *      ui.run(function(){
             ui.stop_script.setText(ftext);
             ftimes++;
            })    *
});*/

//初始化Box展开收缩
ui.title_explain.on("click", (view) => {
    tabButtonAction(explain_views, 1);
    ui.explain.setText(getExplain());
    ui.explain.setColourfulText(getExplainColorfuls());
});


ui.title_log_clear.on("click", function() {
    ui.logText.setText("无日志");
    config.storage.remove("log");
    toastLog("清理日志完成!");
});

ui.title_log_detail.on("click", function() {
    if (!detail_is_show) {
        //ui.logText.setText($files.read("./log/log.txt"));
        ui.logText.setVisibility(View.GONE);
        ui.console.setVisibility(View.VISIBLE);
        detail_is_show = true;
    } else {
        //ui.logText.setText(config.log);
        ui.logText.setVisibility(View.VISIBLE);
        ui.console.setVisibility(View.GONE);
        detail_is_show = false;
    }
});

ui.title_device_info.on("click", (view) => {
    tabButtonAction(explain_views, 2);
    ui.explain.setText(getDeviceInfo());

});


ui.title_treaty.on("click", (view) => {
    tabButtonAction(explain_views, 0);
    ui.explain.setText(getAgreement());
    ui.explain.setColourfulText(getAgreementColorfuls());
});

ui.unit_test.on("click", () => {
    engines.execScriptFile("./testMain.js");
});


//权限按钮

ui.ps_accessibility.on("click", function() {
    if (auto.service == null) {
        toast("在「已下载应用」中找到「钉钉自动健康打卡」并授权");
    } else {
        toast("已授权无障碍权限");
    }
    //不管有没有都跳转
    app.startActivity({
        action: "android.settings.ACCESSIBILITY_SETTINGS"
    });
})

ui.ps_floatwindow.on("click", function() {
    if (!$floaty.checkPermission()) {
        // 没有悬浮窗权限，提示用户并跳转请求
        // toast("本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
        $floaty.requestPermission();
        //exit();
    } else {
        toast('已有悬浮窗权限');
    }
    //app.openAppSetting("")
    /*app.startActivity({action: "android.settings.action.MANAGE_OVERLAY_PERMISSION"});*/
    //toast("在「权限管理」中找到「显示悬浮窗」并授权");
})

ui.ps_startauto.on("click", function() {
    app.openAppSetting("auto.dingtalk.checkin");
    toast("在「自启动」中授权");
})

ui.ps_battery_opt.on("click", function() {

    if (!$power_manager.isIgnoringBatteryOptimizations()) {
        toast("未开启忽略电池优化");
        $power_manager.requestIgnoreBatteryOptimizations();
        /*app.startActivity({action: "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS"});*/
        //app.openAppSetting("");
        //toast("在「省电策略」中授权「无限制」");
    } else {
        toast("已开启忽略电池优化");
    }
})

ui.explain_ps.on("click", (v) => {
    ui.permission_explain.visibility = ui.permission_explain.visibility == View.GONE ? View.VISIBLE : View.GONE;
});



initlze();


function initlze() {

    // ---修改状态栏字体和背景颜色 
    ui.statusBarColor("#FFFFFF");
    let syswindow = activity.getWindow();
    syswindow.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
    syswindow.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    syswindow.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);

    // console.warn(config.timers_id,$timers.getTimedTask(config.timers_id),$timers.queryTimedTasks({ path: $files.cwd() + "/mainService.js"}));
    ui.logText.setText(config.storage.get("log") || "无日志");
    ui.logText.movementMethod = ScrollingMovementMethod.getInstance()
    // ui.logText.setMovementMethod(ScrollingMovementMethod.getInstance());

    ui.explain.setText(getExplain());
    ui.explain.setColourfulText(getExplainColorfuls());
    ui.find_step.addTuiTextChangedListener(new TextWatcher({
        //@Override
        afterTextChanged: function(s) {
            config.find_form_step_is_from_text = s;
            console.verbose("find_step change ->",config.find_form_step_is_from_text);
        }
    }));
    ui.permission_explain.setText(`
点击权限进入授权界面手动授权:
________________
1.无障碍权限[核心权限]
2.悬浮窗权限[显示悬浮日志提示，功能测试等对话框界面]
3.后台弹出[打开钉钉，定位界面等]
4.自启动和电池优化[定时打卡，手机重启后激活任务]
5.读写存储［截图保存并发送截图］
__________________
√ ->已授权 
x ->未授权
? ->无法判断 （实际开启即可）
    `);
    //更新定时器状态 
    ui.buttonToSetTiming.setText("定时打卡: " + config.timing);
    ui.auto_run_ontiming.setChecked(config.auto_run_on_timing);

    ui.expand_dev_diff.setExpandEnable(false);
}

function runService() {
    engines.execScriptFile("./mainService.js");
}


function getDeviceInfo() {
    let str = "";
    str += "屏幕宽高:" + device.width + "x" + device.height;
    str += "\n制造商:" + device.brand;
    str += "\nAndroidId: " + device.getAndroidId();
    str += "(" + device.sdkInt + ")";
    str += "\n电量: " + device.getBattery();
    return str;
}

function getExplainColorfuls() {
    let colorfuls = [{
            start: 27,
            end: 33,
            background: 0xFFFFF9C4
        },
        {
            start: 45,
            end: 50,
            color: 0xffff0000
        },
        {
            start: 51,
            end: 55,
            color: 0xffff0000
        },
        {
            start: 64,
            end: 68,
            color: 0xffff0000
        },
        {
            start: 90,
            end: 96,
            color: 0xffff0000
        },
        {
            start: 115,
            end: 126,
            background: 0xFFFFF9C4
        },
        {
            start: 152,
            end: 156,
            background: 0xFFFFF9C4
        }
    ];
    return colorfuls;
}

function getExplain() {
    let str = `使用自动打卡目前需要满足以下条件:
   1.打卡通过[智能填表]进入
   2.软件开启无障碍权限丶自启权限(定时任务需要)丶电池优化白名单(后台存活，确保定时服务能正常运行)丶后台弹出权限(自动打开钉钉及定位需要)
   3.必须之前有提交过数据,暂时只帮点定位;
   4.定时任务需要锁屏密码且是数字密码或无密码(暂不支持手势密码);
   5.使用前先运行 其他->功能可用性测试 并逐项测试，可减少失败概率
   6.公司的cropid可通过点击钉钉 企业主页->查看更多->分享到短信 链接提取出ding~%的部分,不含%.`
    return str;
}

function getAgreementColorfuls() {
    let colorfuls = [{
        start: 87,
        end: 149,
        color: 0xffff6666
    }];
    return colorfuls;
}

function getAgreement() {
    let str = config.last_release_time + `
   一丶本软件只适用于代替正常情况下的手动打卡，不涉及「虚拟定位」等有虚拟数据填入表格内容的功能，使用本软件前确保表格内容无需改动，且提交内容符合自身情况，遵守防疫规定，如有不同，请停止使用并手动修改填报真实情况进行提交！
   二丶使用者必须在遵守防疫规定下使用
   三丶本软件不收集任何用户资料丶行为丶特征等
   四丶使用即同意以上协议.`
    return str;
}

ui.github.on("click", () => {
    showGithub();
});

function showGithub() {
    let github_layout = ui.inflate(
        <vertical padding="20">
            <tui-text  text="👾dingtakll-auto-checkin" textStyle="bold" textSize="18sp" color="black"/>
            <tui-text  text="开源地址：https://github.com/0x7A7A6572/dingtakll-auto-checkin" textStyle="italic" autoLink="web" bg="#cbcbcb" padding="10"/>
            <tui-text  text="开源协议: MIT license" textStyle="bold"  bg="#cbcbcb" padding="10"/>
            <tui-text  text="🧀autojs-tui-weight" textStyle="bold" textSize="18sp" color="black" marginTop="10"/>
            <tui-text  text="内部包含" textStyle="italic" autoLink="web" bg="#cbcbcb" padding="10"/>
            <tui-text  text=" zzerx@qq.com" textStyle="bold"/>
        </vertical>
    );

    let github_dialog = DialogPlus.setView(github_layout)
        .setTitle(null)
        .onTrue(function() {
            github_dialog.dismiss();
        })
        .onFalse(function() {
            github_dialog.dismiss();
        })
        .build().show();
}

ui.beg_thankyou.on("click", () => {
    showBag();
});

function showBag() {
    let beg_layout = ui.inflate(
        <HorizontalScrollView >
            <linear >
                <img src="file://./beg_wx.png" w="300"/>
                <tui-text text="〉〉" textSize="20sp" layout_gravity="center" textStyle="bold" color="#88AACC"/>
                <img src="file://./beg_zfb.png"  w="300"/>
            </linear>
        </HorizontalScrollView>
    );
    let beg_dialog = DialogPlus.setView(beg_layout)
        .setTitle(null)
        .onTrue(function() {
            beg_dialog.dismiss();
            toast("感谢支持！");
        })
        .onFalse(function() {
            beg_dialog.dismiss();
            toast("感谢支持！");
        })
        .build().show();
}

// function boxShowStateBind(view) {
//     let pview = view.getParent()
//         .getParent()
//         .getParent()
//         .getChildAt(1);
//     //获取控件的布局参数，设置控件的宽高
//     params = pview.getLayoutParams();
//     params.height = params.height > 0 ? -1 : 200;
//     pview.setLayoutParams(params);
//     // view.setRotation(params.height > 0 ? 90 : 0)
// }

function tabButtonAction(tabs, index) {
    var headText = "->"
    var action_params = new LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
    action_params.gravity = Gravity.CENTER;
    var no_action_params = new LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
    no_action_params.gravity = Gravity.BOTTOM;
    //toast(tabs)
    for (let i = 0; i < tabs.length; i++) {
        if (i == index) {
            //tabs[i].setText(">" + tabs[i].getText());
            let l = tabs[i].getText();
            tabs[i].setText(l.replace(" ", headText))
            //tabs[i].setTextSize(18);
            // tabs[i].setLayoutParams(action_params);
            tabs[i].setTextColor(JavaUtil.toJavaInt(0xFF33CC66));
        } else {
            let l = tabs[i].getText();
            tabs[i].setText(l.replace(headText, " "))
            //tabs[i].setTextSize(15)
            //tabs[i].setLayoutParams(no_action_params);
            tabs[i].setTextColor(JavaUtil.toJavaInt(0xFF2B2B2B));
            //-13,948,117 = 0xff2b2b2b (int 超过最大)
        }
    }
}

function numTimeToTiming(hours, minute) {
    hours = hours < 10 ? "0" + hours : hours;
    minute = minute < 10 ? "0" + minute : minute;
    return hours + ":" + minute;
}

function updatePermissionStatusView(view, statu) {
    let ownColor = colors.parseColor("#33CC66");
    let notOwned = colors.parseColor("red");
    let ownText = "√ ";
    let notOwnedText = "x ";
    // view.setTextColor(statu ? ownColor : notOwned);
    view.textColor = statu ? ownColor : notOwned;
    view.setText(view.getText().replace(/. /g, statu ? ownText : notOwnedText))
}

//保活&动态更新一些东西
setInterval(function() {

    //检查权限状态并更新ui

    updatePermissionStatusView(ui.ps_floatwindow, $floaty.checkPermission());
    updatePermissionStatusView(ui.ps_battery_opt, $power_manager.isIgnoringBatteryOptimizations());

    if (auto.service == null) {
        updatePermissionStatusView(ui.ps_accessibility, false);
    } else {
        updatePermissionStatusView(ui.ps_accessibility, true);
    }


}, 2000);