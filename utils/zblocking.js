/*
 *  防止脚本阻塞
 * 用于主线程while witeFor 的阻塞检测
 * 注册线程监听方法 > 到时间自动[结束脚本]
 */
/*
   tasks :{"task_key":{
            thread: null,
            limitTime: 5000,
            registerTime: 0,
            feedbackTime: 0,
            state:true
        },
        {},
        ,...
*/
var AntiBlocking = {
    tasks: {}
};

AntiBlocking.register = function(func, task_key, limittime) {
    //let task = {};
    AntiBlocking.tasks[task_key] = {};
    //限制时间默认5000ms
    AntiBlocking.tasks[task_key].limitTime = limittime != null ? limittime : 5000;
    //---
    //if(AntiBlocking.tasks[task_key] === null){
    //开启线程
    console.log("AntiBlocking线程[" + task_key + "]已启动>>>")
    AntiBlocking.tasks[task_key].thread = threads.start(function() {
        AntiBlocking.tasks[task_key].registerTime = new Date().getTime();
        AntiBlocking.tasks[task_key].state = true;
        while (true) {
            AntiBlocking.tasks[task_key].feedbackTime = new Date().getTime();
            if (AntiBlocking.tasks[task_key].feedbackTime -
                AntiBlocking.tasks[task_key].registerTime >
                AntiBlocking.tasks[task_key].limitTime) {
                AntiBlocking.stop(task_key, func);
                return false;
            }
            sleep(1000);
        }

    });
    //运行需要监听的方法
    return func();
}
AntiBlocking.stop = function(task_key) {
    AntiBlocking.tasks[task_key].state = false;
    AntiBlocking.tasks[task_key].thread.interrupt();
    console.log("AntiBlocking线程[" + task_key + "]已停止<<<")
    //结束关闭所有线程和当前脚本
    if (AntiBlocking.tasks[task_key].isEndAll) {
        exit();
    }
    // 
}
AntiBlocking.getState = function(task_key) {
    return AntiBlocking.tasks[task_key].state;
}
module.exports = AntiBlocking;

/* example:
AntiBlocking.register(function(){
    let i = 0;
    console.log(":::" ,AntiBlocking.getState("test"));
    while(AntiBlocking.getState("test")){;
        toast(i);
        i++;
       // 如果不设置isEndAll参数，使用.state自行判断只能使用===false而不能用!
      //  if(AntiBlocking.getState("test") === false){
      //    return;
      //    }
          sleep(2000)
        }
    
    },"test", 5000, false);
    
    
    },"test", 5000, false);
    
    */