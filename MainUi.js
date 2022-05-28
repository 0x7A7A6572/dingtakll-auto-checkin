"ui";
importClass(android.widget.LinearLayout);
importClass(android.widget.LinearLayout.LayoutParams);
importClass(android.widget.TimePicker.OnTimeChangedListener);
importClass("android.view.Gravity");
let DialogPlus = require("components/DialogPlus.js");
require('components/tuiWidgetDebug.js');
let config = require("config.js");
config.init();


ui.layout(
    <frame>
        <vertical>
            <linear bg="#ffffff" padding="0" h="40" w="*">
                <tui-text  id="title_set" text="▍钉钉自动健康打卡" textSize="12sp" textStyle="bold" padding="5"  layout_weight="1"/>
                <!--tui-button id="vip" text="[VIP]" textSize="16sp" gravity="right" color="#FFAA00" margin="0" textStyle="bold" background="?selectableItemBackgroundBorderless" /--> 
                <tui-button id="run_script" text="[>>>]" textSize="16sp" gravity="center" color="#00dd00" margin="0" textStyle="bold" background="?selectableItemBackgroundBorderless" /> <!--tui-button id="stop_script" text="[停止]" textSize="18sp" color="#99cf00" margin="0" textStyle="bold" background="?selectableItemBackgroundBorderless" /-->
                    <tui-button id="exit_script" text="[X]" textSize="18sp" color="#ff2f00" margin="0" textStyle="bold" background="?selectableItemBackgroundBorderless" /> <!--tui-button id="unit_test" text=">单元测试" textSize="12sp" layout_weight="1" color="#4ff2f6" margin="0" textStyle="bold" background="?selectableItemBackgroundBorderless" /-->
                </linear> <!--tui-text text="──── version 1.2.0 ───          ──── @zzerX ────" textSize="8sp" / -->
                <ScrollView layout_gravity="center">
                    <vertical w="*"> 
                        <vertical w="*" margin="0 20 0 0">
                            <linear w="*" gravity="center">
                                <tui-text id="title_treaty" text=" 使用条约" textSize="16sp" padding="8" textStyle="bold" color="#2b2b2b" />
                                <tui-text id="title_explain" text="->条件说明" textSize="16sp" padding="8" layout_gravity="center" textStyle="bold" color="#33CC66" />
                                    <tui-text id="title_device_info" text=" 当前环境" textSize="16sp" padding="8" layout_gravity="center" textStyle="bold" color="#2b2b2b" />
                                </linear>
                                <vertical margin="10 0 10 10">
                                    <tui-text id="explain" margin="8" textSize="12sp" padding="8" color="#33CC66" bg="#3333CC66" textStyle="bold" />
                                    <linear id="permission_status" w="*" margin="8 0 8 0" padding="12" bg="#FFF9C4">
                                        <tui-text id="ps_accessibility" layout_weight="1" text="x 无障碍" textSize="12sp" color="red" textStyle="bold" padding="5" />
                                        <tui-text id="ps_floatwindow" layout_weight="1" text="x 悬浮窗" textSize="12sp" color="red" textStyle="bold" padding="5" />
                                        <tui-text id="ps_startauto" layout_weight="1" text="? 开机自启" textSize="12sp" color="red" textStyle="bold" padding="5" />
                                        <tui-text id="ps_battery_opt" layout_weight="1" text="x 电池优化" textSize="12sp" color="red" textStyle="bold" padding="5" />
                                    </linear>
                                     <linear id="permission_status" w="*" margin="8 0 8 0" padding="10 0 10 12" bg="#FFF9C4">
                                        <tui-text id="ps_bgpop" text="? 后台弹出" textSize="12sp" color="red" textStyle="bold" padding="5" />
                                        <tui-text id="ps_rw_storage"  text="x 读写存储" textSize="12sp" color="red" textStyle="bold" padding="5" />
                                        <tui-text id="explain_ps" text="[?]" color="red" textSize="15sp" layout_weight="1" textStyle="bold" gravity="right"/>
                                    </linear>
                                </vertical>
                            </vertical> <!-- box3-->
                            <vertical>
                                <linear gravity="center">
                                    <tui-text id="title_share" text="打卡设置-PunchInSet" textSize="16sp" padding="8" textStyle="bold" /> <!--tui-text id="title_log_control" text="reset" textColor="#55ccff" textSize="12sp" textStyle="normal"  layout_gravity="bottom" marginLeft="0"/-->
                                </linear>
                                <vertical margin="10" padding="10" bg="#2233CC66">
                                    <vertical layout_weight="1" bg="#3333CC66" padding="5" layout_gravity="center" gravity="center">
                                        <tui-checkBox id="auto_run_ontiming" text="定时打卡" prefKey="auto_run_on_timing"  textStyle="bold" padding="5" color="#33CC66" statusStyle="[开启]|[关闭]|[禁用]" statuColor="#FF6666" />
                                        <tui-button id="buttonToSetTiming" text="设定时间: AM 00:00 " color="#33CC66" margin="0" textStyle="bold" background="#ffffffff" />
                                        <linear marginTop="5">
                                            <tui-text text="锁屏数字密码:" color="#33CC66" padding="5" gravity="center" h="*" />
                                            <tui-editText id="lock_num" text="24568" inputType="textPassword" textSize="14sp" hint="当定时触发手机是锁屏时需要" prefKey="lock_num" singleline="true" marginLeft="14" color="#FFFFFF" bg="#3300dd00" textStyle="bold" padding="5" password="true" />
                                        </linear>
                                    <!--frame>
                                        <vertical id="vip_func" w="*" margin="0 8 0 8" padding="12" bg="#BBFFF9C4">

                                        <tui-text _weight="1" text="排班设置" textSize="12sp" color="#33CC66" textStyle="bold" padding="5" />
                                      <HorizontalScrollView >
                                            <linear bg="#3333CC66" >
                                        <tui-text   text="23" bg="#99FFFFFF" color="#33CC66" textSize="12sp"  textStyle="bold" padding="15" margin="5" />
                                        <tui-text  text="24" textSize="12sp" color="#33CC66" textStyle="bold" padding="5" padding="15" margin="5"/>
                                        <tui-text   text="25" textSize="12sp" color="#33CC66" textStyle="bold" padding="5" padding="15" margin="5"/>
                                       <tui-text   text="26" bg="#99FFFFFF" color="#33CC66" textSize="12sp"  textStyle="bold" padding="15" margin="5" />
                                        <tui-text  text="27" textSize="12sp" color="#33CC66" textStyle="bold" padding="5" padding="15" margin="5"/>
                                        <tui-text  text="28" textSize="12sp" color="#33CC66" textStyle="bold" padding="5" padding="15" margin="5"/>
                                          </linear>
                                        </HorizontalScrollView>
                                    </vertical>
                                    <vertical gravity="center" bg="#A8FFFFFF" margin="0 8 0 8" >
                                    <tui-text text=" - 仅限VIP用户  -"  w="*" h="*" color="#FFBB00" textSize="16sp" textStyle="bold"  gravity="center" layout_gravity="center"/>
                                    </vertical>
                                    </frame-->
                                    </vertical>
                                    <!--tui-checkBox id="logcat_float_window" text="打卡时显示实时日志悬浮窗" prefKey="logcat_float_window" bg="#2233CC66" textStyle="bold" padding="10" color="#33CC66" statusStyle="[开启]|[关闭]|[禁用]" statuColor="#FF6666" margin="0 10 0 0"/-->
                                    <vertical layout_weight="1">
                                        <linear marginTop="5" gravity="center">
                                            <tui-text text="corpId:" color="#33CC66" textStyle="bold" padding="5" />
                                            <tui-editText id="corp_id" textSize="14sp" hint="公司的cropid(通过抓包获取)" prefKey="corp_id" singleline="true" marginLeft="14" color="#FFFFFF" bg="#3300dd00" textStyle="bold" padding="5" />
                                        </linear>
                                        <linear marginTop="5" gravity="center">
                                            <tui-text text="打卡群名称:" color="#33CC66" textStyle="bold" padding="5" />
                                            <tui-editText id="group_name"  textSize="14sp" hint="打卡截图之后需要发送的群聊名称" prefKey="group_name" singleline="true" marginLeft="14" color="#FFFFFF" bg="#3300dd00" textStyle="bold" padding="5" />
                                        </linear>
                                        <linear marginTop="5" gravity="center">
                                            <tui-text text="查找步骤:" color="#33CC66" textStyle="bold" padding="5" />
                                            <tui-editText id="find_step" textSize="14sp" hint="查找表格步骤" prefKey="find_step" singleline="true" marginLeft="14" color="#FFFFFF" bg="#3300dd00" textStyle="bold" padding="5" />
                                        </linear>
                                    </vertical> <!--/linear-->
                                </vertical>
                            </vertical> <!-- box4-->
                            <vertical gravity="center" marginTop="10">
                                <linear gravity="center">
                                    <tui-text id="title_log" text="日志记录-Logcat" textSize="16sp" padding="8" textStyle="bold" /> <!--tui-text id="title_log_detail" text="detail" textColor="#66ff66" textSize="15sp" padding="8" textStyle="normal"   layout_gravity="bottom" marginLeft="0"/-->
                                    <tui-text id="title_log_clear" text="[清除]" textColor="#ff6666" textSize="13sp" padding="8" textStyle="bold" layout_gravity="bottom" marginLeft="0" />
                                </linear>
                                <vertical>
                                    <vertical background="#3333CC66" margin="18 0 18 20">
                                        <ScrollView minHeight="200">
                                            <tui-text id="logText" height="300" textSize="13sp" padding="8" color="#00B800" />
                                        </ScrollView>
                                    </vertical>
                                </vertical>
                            </vertical>
                                <tui-text id="other_setting" text="其他-Other" textSize="16sp" padding="8" textStyle="bold" gravity="center" /> 
                                <vertical background="#3333CC66" margin="18 0 18 20">
                                        <tui-text id="unit_test" text="[功能测试]" textColor="#ff6666" textSize="13sp" padding="8" textStyle="bold" gravity="left" />
                                    </vertical>
                        </vertical>
                    </ScrollView>
                </vertical> <tui-text text="──── v1.2.0 @zzerX ───" textSize="11sp" />
            </frame>);


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
let itimepicker = ui.inflate('<timepicker id="spinner" timePickerMode="spinner"/ > ');
let myDialog = DialogPlus.setView(itimepicker)
    .setTitle(null)
    .onTrue(function() {
        config.timing = _tmp_timing;
        ui.buttonToSetTiming.setText("定时打卡: " + config.timing);
        addTimerIfNotExists(config.script_path);
        config.updateAll();
        myDialog.dismiss()
    })
    .onFalse(function() {
        toast("取消")
        myDialog.dismiss()
    })
    .build()

itimepicker.spinner.setOnTimeChangedListener(new android.widget.TimePicker.OnTimeChangedListener({
    onTimeChanged: function(view, hour, minute) {
        _tmp_timing = numTimeToTiming(hour, minute);
    }
}));


ui.buttonToSetTiming.on("click", function() {
    myDialog.show();
});


ui.auto_run_ontiming.addOnCheckListen(function(checked) {
    config.auto_run_on_timing = checked;
    addTimerIfNotExists(config.script_path);
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
});


ui.title_log_clear.on("click", function() {
    ui.logText.setText("无日志");
    config.storage.remove("log");
    toastLog("清理日志完成!");
});

ui.title_device_info.on("click", (view) => {
    tabButtonAction(explain_views, 2);
    ui.explain.setText(getDeviceInfo());

});


ui.title_treaty.on("click", (view) => {
    tabButtonAction(explain_views, 0);
    ui.explain.setText(getAgreement());
});

ui.unit_test.on("click", ()=>{
  engines.execScriptFile("./testMain.js");
});


//权限按钮

ui.ps_accessibility.on("click", function() {
if(auto.service == null){
    toast("在「已下载应用」中找到「钉钉自动健康打卡」并授权");
  }else{
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
        exit();
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

ui.explain_ps.on("click",()=>{
    toast(`
点击权限进入授权界面手动授权:
________________
1.无障碍权限[核心权限]
2.悬浮窗权限[显示悬浮日志提示]
3.后台弹出[打开钉钉]
4.自启动和电池优化[定时打卡]
5.读写存储［发送截图］
__________________
√ ->已授权 
x ->未授权
? ->无法判断
    `,8000);
    
});



initlze();


function initlze() {
   // console.warn(config.timers_id,$timers.getTimedTask(config.timers_id),$timers.queryTimedTasks({ path: $files.cwd() + "/mainService.js"}));
    ui.logText.setText(config.storage.get("log") || "无日志");
    ui.explain.setText(getExplain());
    ui.find_step.addTuiTextChangedListener(new TextWatcher() {
        //@Override
        afterTextChanged: function(s) {
            config.find_form_step_is_from_text = s;
        }
    })
    //更新定时器状态 
    ui.buttonToSetTiming.setText("定时打卡: " + config.timing);
    ui.auto_run_ontiming.setChecked(config.auto_run_on_timing);
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

function getExplain() {
    let str = `使用自动打卡目前需要满足以下条件:
   1.打卡通过[智能填表]进入
   2.软件开启无障碍权限丶自启权限(定时任务需要)丶电池优化白名单(后台存活，确保定时服务能正常运行)丶后台弹出权限(自动打开钉钉及定位需要)
   3.必须之前有提交过数据,暂时只帮点定位;
   4.定时任务需要锁屏密码且是数字密码(暂不支持手势密码);
   
已测试环境(钉钉6.5.10.11 MIUI12.5)`
    return str;
}

function getAgreement() {
    let str = `
   一丶本软件只适用于代替正常情况下的手动打卡，不涉及「虚拟定位」等有虚拟数据填入表格内容的功能，使用本软件前确保表格内容无需改动，且提交内容符合自身情况，遵守防疫规定，如有不同，请停止使用并手动修改填报真实情况进行提交！
   二丶使用者必须在遵守防疫规定下使用
   三丶本软件不收集任何用户资料丶行为丶特征等
   四丶使用即同意以上协议.`
    return str;
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
            tabs[i].setTextColor(-13382554);
        } else {
            let l = tabs[i].getText();
            tabs[i].setText(l.replace(headText, " "))
            //tabs[i].setTextSize(15)
            //tabs[i].setLayoutParams(no_action_params);
            tabs[i].setTextColor(-13948117);
            //-13,948,117 = 0xff2b2b2b (int 超过最大)
        }
    }
}

function numTimeToTiming(hours, minute) {
    hours = hours < 10 ? "0" + hours : hours;
    minute = minute < 10 ? "0" + minute : minute;
    return hours + ":" + minute;
}

function timingFormat(timing) {
    let timef = timing.split(":");
    toastLog(timef);
    return [Number(timef[0]), Number(timef[1])];
}

function checkTimedTaskChange(task_milis) {
    console.warn("checkTimedTaskChange:",task_milis, new Date(task_milis));
}

// function addTimerIfNotExists(script_path) {
//     if (config.timers_id != null) {
//         let task = $timers.getTimedTask(config.timers_id);
//         console.warn(config.timers_id, task)
//         checkTimedTaskChange(task.millis);
//         if (task != null && !config.auto_run_on_timing) {

//             $timers.removeTimedTask(config.timers_id);
//             config.timers_id = null;
//             config.updateAll();
//             console.info("addTimerIfNotExists:", config.timers_id, task, config.auto_run_on_timing);

//         }
//         /*else if(task != null && config.auto_run_on_timing && task.milis != new Date(0,0,0,)){ //时间不等
               
//              }*/
//         else {
//             config.timers_id = null;
//             config.updateAll();
//             console.info("if[true] -> if[false]:", config.timers_id, task, config.auto_run_on_timing);
//         }
//     } else if (config.timers_id == null && config.auto_run_on_timing) {
//         let [hours, minute] = timingFormat(config.timing);
//         //toastLog(hours + ": " +minute + new Date(0, 0, 0, hours, minute, 0));
//         let task = $timers.addDailyTask({
//             path: script_path,
//             time: new Date(0, 0, 0, hours, minute - 5, 0) //minute - 5 设定的时间总会晚5分钟
//         });
//         config.timers_id = task.id;
//         config.updateAll();
//         console.info("config.timers_id == null added");
//     } else {
//         console.info("addTimerIfNotExists:", config.timers_id, config.auto_run_on_timing);
//     }

// }

function addTimerIfNotExists(script_path) {
    if (config.timers_id != null) {
        let task = $timers.getTimedTask(config.timers_id);
        // let all_tasks =  $timers.queryTimedTasks({ path: config.timer_path});
        // console.info(config.timers_id, task);
        //checkTimedTaskChange(task.millis);
        if (task != null && !config.auto_run_on_timing) {

            $timers.removeTimedTask(config.timers_id);
            config.timers_id = null;
            config.updateAll();
            console.info("addTimerIfNotExists:", config.timers_id, task, config.auto_run_on_timing);
        }else if(task != null && config.auto_run_on_timing && config.timing != _tmp_timing){ //在ui界面定时开启开启状态下修改定时
            let [_hours, _minute] = timingFormat(_tmp_timing);
           // let new_time = new Date(0, 0, 0, _hours, _minute, 0).getTime();
            //task.millis = new_time - new Date(0, 0, 0, 0, 0, 0).getTime();
            console.warn("删除定时任务[",config.timers_id,"]",$timers.removeTimedTask(config.timers_id));
            let new_task =$timers.addDailyTask({
                path: script_path,
                time: new Date(0, 0, 0, _hours, _minute - 5, 0) //minute - 5 设定的时间总会晚5分钟
            });
            console.info("_tmp_timing 改变且开启定时状态",_hours, _minute,);
            config.timers_id = new_task.id;
            config.timing = _tmp_timing;
            config.updateAll();
       }else {
            config.timers_id = null;
            config.updateAll();
            console.info("if[true] -> if[false]:", config.timers_id, task, config.auto_run_on_timing);
        }
    } else if (config.timers_id == null && config.auto_run_on_timing) {
        let [hours, minute] = timingFormat(config.timing);
        //toastLog(hours + ": " +minute + new Date(0, 0, 0, hours, minute, 0));
        let task = $timers.addDailyTask({
            path: script_path,
            time: new Date(0, 0, 0, hours, minute - 5, 0) //minute - 5 设定的时间总会晚5分钟
        });
        config.timers_id = task.id;
        config.updateAll();
        console.info("config.timers_id == null added");
    } else {
        console.info("addTimerIfNotExists:", config.timers_id, config.auto_run_on_timing);
    }

}

function updatePermissionStatusView(view, statu){
 let ownColor = colors.parseColor("#33CC66");
 let notOwned = colors.parseColor("red");
 let ownText = "√ ";
 let notOwnedText = "x ";
 // view.setTextColor(statu ? ownColor : notOwned);
  view.textColor = statu ? ownColor : notOwned;
  view.setText(view.getText().replace(/. /g,statu ? ownText : notOwnedText))
}

 //保活&动态更新一些东西
    setInterval(function() {
      
        //检查权限状态并更新ui
     
      updatePermissionStatusView(ui.ps_floatwindow, $floaty.checkPermission());
      updatePermissionStatusView(ui.ps_battery_opt, $power_manager.isIgnoringBatteryOptimizations() );
     
     if(auto.service == null){
       updatePermissionStatusView(ui.ps_accessibility, false);
     }else{
       updatePermissionStatusView(ui.ps_accessibility, true);
     }
      

    }, 2000);
