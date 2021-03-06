/* 默认配置 及配置初始化 */
importClass(android.content.pm.PackageManager)
let config = {
    version: getPackageName(),
   // last_release_time: "Wed Jun 01 2022 13:32:46",
    //_last_update: new Date(),
    auto_screenshot: true,
    auto_share_after_screenshot: true,
    auto_run_when_opened: false,
    auto_delete_image: false,
    auto_run_on_timing: false, //是否开启定时任务
    show_logcat_flotwindow: true, //是否开启日志悬浮窗
    find_form_step_is_from_text: "填写>立即填写>员工每日健康打卡>今天", //查找步骤文本，{立即填写}换成指定表格名
    true_device_text: {
        lock_call: null,
        //  swap_path:"0.6~0.3",
        swap_path_start: 0.6,
        swap_path_end: 0.3,
        allow_screenshort: "立即开始"
        //  location:null //不需要
    },
    form_diff: {
        location: false,
        travelcard: false,
    },
    // form_title: "",
    group_name: null,
    lock_password: "",
    temp_img_path: "/sdcard/temp_transit_file_0x7a7a.png", //(? dingtalkutil -> mod(x))
    img_path_travelcard: context.getExternalCacheDir() + "/travelcard.png",
    image_path: context.getExternalCacheDir() + "/screenshot.png",
    log_path: context.getExternalCacheDir() + "/log.txt",
    script_path: $files.cwd() + "/mainService.js",
    timing: "00:00",
    timers_id: null,
    // timer_path: $files.cwd() + '/mainService.js', /* mainService mainUI config 都在同级目录所以这里直接用$files.cwd() */
    CORP_ID: "", //ding00853d06912ba8d3bc961a6cb783455b test CORP_ID 需要加入测试组织
    TABLE_PAGE_ACTIVITY: "com.alibaba.lightapp.runtime.activity.CommonWebViewActivitySwipe",
    DING_TAILK_PAGE_NAME: "com.alibaba.android.rimet",
    log: "",
    temp_img_path_list: [], /* 临时图片路径 不在脚本间共享 */
    storage: storages.create("AutoHealthPunchInDataBase"), //tui自带的配置保存
    tui_storage_edittext: storages.create("tuiWidgetDateBase:tuiEditText"),
    tui_storage_checkbox: storages.create("tuiWidgetDateBase:tuiCheckBox"),
    init: function () {
        console.setGlobalLogConfig({
            "file": this.log_path
        });
        this.CORP_ID = this.tui_storage_edittext.get("corp_id");
        this.group_name = this.tui_storage_edittext.get("group_name","软件测试(DEBUG)"); /* 软件测试(DEBUG) 为测试群 */
        this.lock_password = this.tui_storage_edittext.get("lock_num");
        this.find_form_step_is_from_text = this.tui_storage_edittext.get("find_step");
        this.auto_run_on_timing = this.tui_storage_checkbox.get("auto_run_on_timing",false);
        this.show_logcat_flotwindow = this.tui_storage_checkbox.get("show_logcat_flotwindow",false); 
        this.true_device_text.lock_call = this.tui_storage_edittext.get("true_lock_call_text");

        this.true_device_text.swap_path_start = this.tui_storage_edittext.get("true_swap_path:start", 0.6);
        this.true_device_text.swap_path_end = this.tui_storage_edittext.get("true_swap_path:end", 0.3);
        this.true_device_text.allow_screenshort = this.tui_storage_edittext.get("true_allow_screenshort_text", "立即开始");

        this.form_diff.location = this.tui_storage_checkbox.get("form_diff_location",false);
        this.form_diff.travelcard = this.tui_storage_checkbox.get("form_diff_travelcard",false);

        this.timers_id = this.storage.get("timing_id");
        // console.info("checkTimedTaskExists:", this.checkTimedTaskExists(), this.timers_id);
        if (!this.checkTimedTaskExists()) {
            this.auto_run_on_timing = false;
            this.timers_id = null;
        } // 如果timedTask.id == null ,则设置this.auto_run_on_timing = false;
        this.timing = this.storage.get("timing") || "00:00";
        this.log = this.storage.get("log") || "";
        //初始化定时任务
        this.addTimerIfNotExists(this.script_path);
        console.info("配置初始化完毕!");
        console.verbose(JSON.stringify(this, null, 1));
    },
    updateAll: function () {
        //处理除了tui_storage_ 控件自动存储以外的config
        this.storage.put("timing", this.timing);
        this.storage.put("timing_id", this.timers_id);
        this._last_update = new Date();
        //再更新控件没有更新到config的配置
        // this.init();
    },
    addTimerIfNotExists: function (script_path) {
        if (this.timers_id != null) {
            let task = $timers.getTimedTask(this.timers_id);
            // let all_tasks =  $timers.queryTimedTasks({ path: config.timer_path});
            // console.info(config.timers_id, task);
            //checkTimedTaskChange(task.millis);
            if (task != null && !this.auto_run_on_timing) {

                $timers.removeTimedTask(this.timers_id);
                this.timers_id = null;
                this.updateAll();
                console.info("autoRun(false) -> delTimer");
            } else {
                config.timers_id = task.id;
                config.updateAll();
                console.warn("no catch -> updateTimerid",
                    "timers_id:", this.timers_id,
                    "task:", task,
                    "auto_run_on_timing:", this.auto_run_on_timing);
            }
        } else if (this.timers_id == null && this.auto_run_on_timing) {
            let [hours, minute] = timingFormat(this.timing);
            //toastLog(hours + ": " +minute + new Date(0, 0, 0, hours, minute, 0));
            let task = $timers.addDailyTask({
                path: script_path,
                time: new Date(0, 0, 0, hours, minute - 5, 0) //minute - 5 设定的时间总会晚5分钟
            });
            this.timers_id = task.id;
            this.updateAll();
            console.info("[timers_id == null] -> added");
        } else {
            console.warn("no catch -> do noting",
                "timers_id:", this.timers_id,
                "task: null?",
                "auto_run_on_timing:", this.auto_run_on_timing);;
        }
    },
    tingChangedUpdateTask: function (_tmp_timing) {
        if (this.auto_run_on_timing) {
            let [_hours, _minute] = timingFormat(_tmp_timing);
            // let new_time = new Date(0, 0, 0, _hours, _minute, 0).getTime();
            //task.millis = new_time - new Date(0, 0, 0, 0, 0, 0).getTime();
            console.info("删除定时任务[", this.timers_id, "]->", $timers.removeTimedTask(this.timers_id));
            let new_task = $timers.addDailyTask({
                path: this.script_path,
                time: new Date(0, 0, 0, _hours, _minute - 5, 0) //minute - 5 设定的时间总会晚5分钟
            });
            console.verbose("[_tmp_timing(change) && auto_run_on_timing = true] -> add timer:", _hours, ":", _minute);
            this.timers_id = new_task.id;
            this.timing = _tmp_timing;
            this.updateAll();
        }
    },
    checkTimedTaskExists: function () {
        let isExists = false;
        if (this.timers_id != null) {
            let task = $timers.getTimedTask(this.timers_id);
            isExists = (task == null) ? false : true;
        } else {
            isExists = false;
        }
        return isExists;
    },
    /* @Discard*/
    clearTimedTasks: function (timeid) {
        if (timeid != null) {
            $timers.removeTimedTask(timeid);
        } else {
            console.warn("removeTimeTask failed:", timeid)
        }
    }
}
/** JSON.stringify() 更优秀
function formatObj(obj, str) {
    let _str;
    if (str == null) {
        _str = "{\n"
    } else {
        _str += "{\n"
    }
    Object.keys(obj)
        .forEach((k) => {
            if (typeof obj[k]  == "object") {
                // console.warn( obj[k])
                // if(obj[k] != com.stardust.autojs.core.storage.LocalStorage){
                //    formatObj(obj[k], _str);

                // }else{
                //     _str += k + ": [Object LocalStorage],\n";
                // }
                _str += obj[k].toString() + ",\n";
            } else {
                if (typeof(obj[k]) == "string") {
                    _str += k + ": \"" + obj[k] + "\",\n";
                } else if (typeof(obj[k]) == "function") {
                    _str += k + ": [Function],\n";
                } else {
                    _str += k + ": " + obj[k] + ",\n";
                }
            }
        });
    _str += "\n},\n";
    return _str;
}
*/
function timingFormat(timing) {
    let timef = timing.split(":");
    return [Number(timef[0]), Number(timef[1])];
}

function getPackageCode() {
    let manager = context.getPackageManager();
    let code = 0;
    try {
        let info = manager.getPackageInfo(context.getPackageName(), 0);
        code = info.versionCode;
    } catch (e) {
        e.printStackTrace();
    }
    return code;
}
function getPackageName() {
    let manager = context.getPackageManager();
    let name = null;
    try {
        let info = manager.getPackageInfo(context.getPackageName(), 0);
        name = info.versionName;
    } catch (e) {
        e.printStackTrace();
    }
    return name;
}


module.exports = config;
//config.init();