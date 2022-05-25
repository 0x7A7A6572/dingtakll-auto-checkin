
config = require("../config.js")

let jsPath = "/sdcard/脚本/test.js";
// 添加一个每周日下午1点13分运行的定时任务，循环运行5次脚本，间隔5000毫秒
let task = $timers.addDailyTask({
    path: jsPath,
    time: 1624252440000,
    
});

console.info(task,config.timers_id);
config.init()
console.warn(task.id, config.timers_id);
// 按脚本路径查找定时任务
let tasks = $timers.queryTimedTasks({
    path: jsPath
});
// 删除查找到的所有定时任务
tasks.forEach(t => {
    console.log("删除: ", t);
    log($timers.removeTimedTask(t.id));
});

console.warn(storages.create("AutoHealthPunchInDataBase").put("timing_id",null));
console.warn(storages.create("AutoHealthPunchInDataBase").get("timing_id"), config.timers_id)
