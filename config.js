/* 默认配置 及配置初始化 */
let config = {
    version: "v2.0.2",
    last_release_time: "Sun May 29 2022 GMT+0800 (GMT+08:00)",
    _last_update: new Date(),
    auto_screenshot: true,
    auto_share_after_screenshot: true,
    auto_run_when_opened: false,
    auto_delete_image: false,
    auto_run_on_timing: false, //是否开启定时任务
    show_logcat_flotwindow: true, //是否开启日志悬浮窗
    find_form_step_is_from_text: "填写->运营分公司员工每日健康打卡->今天", //查找步骤文本
    // form_title: "",
    group_name: null,
    lock_password: "",
    image_path: "/sdcard/screenshot.png",
    script_path: "./mainService.js",
    timing: "00:00",
    timers_id: null,
    // timer_path: $files.cwd() + '/mainService.js', /* mainService mainUI config 都在同级目录所以这里直接用$files.cwd() */
    CORP_ID: "", //ding00853d06912ba8d3bc961a6cb783455b
    TABLE_PAGE_ACTIVITY: "com.alibaba.lightapp.runtime.activity.CommonWebViewActivity",
    DING_TAILK_PAGE_NAME: "com.alibaba.android.rimet",
    log: "",
    storage: storages.create("AutoHealthPunchInDataBase"), //tui自带的配置保存
    tui_storage_edittext: storages.create("tuiWidgetDateBase:tuiEditText"),
    tui_storage_checkbox: storages.create("tuiWidgetDateBase:tuiCheckBox"),
    init: function() {
        console.setGlobalLogConfig({
            "file": "./log/log.txt"
        });
        this.CORP_ID = this.tui_storage_edittext.get("corp_id");
        this.group_name = this.tui_storage_edittext.get("group_name") || "每日健康打卡群";
        this.lock_password = this.tui_storage_edittext.get("lock_num");
        this.find_form_step_is_from_text = this.tui_storage_edittext.get("find_step");
        this.auto_run_on_timing = this.tui_storage_checkbox.get("auto_run_on_timing") || false;
        this.show_logcat_flotwindow = this.tui_storage_checkbox.get("show_logcat_flotwindow"); // 这里不应该使用 || true -> false || true 导致永为真
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
        console.verbose(formatObj(this));
    },
    updateAll: function() {
        //处理除了tui_storage_ 控件自动存储以外的config
        this.storage.put("timing", this.timing);
        this.storage.put("timing_id", this.timers_id);
        this._last_update = new Date();
        //再更新控件没有更新到config的配置
        // this.init();
    },
    addTimerIfNotExists: function(script_path) {
        if (this.timers_id != null) {
            let task = $timers.getTimedTask(this.timers_id);
            if (task != null && !this.auto_run_on_timing) {
                $timers.removeTimedTask(this.timers_id.scheduledTaskId);
                this.timers_id = null;
                this.updateAll();
            }
        } else if (this.timers_id == null && this.auto_run_on_timing) {
            let [hours, minute] = timingFormat(this.timing);
            let task = $timers.addDailyTask({
                path: script_path,
                time: new Date(0, 0, 0, hours, minute, 0)
            });
            this.timers_id = task.id;
            this.updateAll();
            console.info("config.timers_id == null  added");
        }
    },
    checkTimedTaskExists: function() {
        let isExists = false;
        if (this.timers_id != null) {
            let task = $timers.getTimedTask(this.timers_id);
            isExists = (task == null) ? false : true;
        } else {
            isExists = false;
        }
        return isExists;
    }

}

function formatObj(obj, str) {
    let _str;
    if (str == null) {
        _str = "{\n"
    } else {
        _str += "{\n"
    }
    Object.keys(obj)
        .forEach(function(k) {
            if (typeof(v) == "object") {
                this(obj[k], _str);
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

function timingFormat(timing) {
    let timef = timing.split(":");
    return [Number(timef[0]), Number(timef[1])];
}



module.exports = config;
//config.init();