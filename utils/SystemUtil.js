SystemUtil = {
    XIAOMI: 0,
    HUAWEI: 1,
    OPPO: 2,
    VIVO: 3,
    getGpsSwitchText: function(firm){
        let gps_switch_text = "定位服务"
        switch(firm){
            case this.XIAOMI:
              gps_switch_text = "开启位置服务";
            break;
            case this.HUAWEI:
            
            break;
            case this.OPPO:
            break;
            case this.VIVO:
                gps_switch_text = "";
            break;
            default:
            break;
        }
        return GPS_SWITCH_TEXT;
    },
    /*
    * 解锁结果回调
    */
    unlockListen: function(){
    return{
      success: function(){},
      failed: function(log){console.warn(log);}
      }
    },
    /*
    * 解锁(小米)
    */
    unlock: function(password, iunlockListen) {
        let unlock_mode = 0; // 0 未锁屏, 1 数字解锁, 2 上滑解锁
        let HEIGHT = device.height == 0 ? 1080 : device.height; //锁屏时获取的可能是0 
        let errorMessage = (msg) => {
            console.error(msg);
            device.isScreenOn() && KeyCode(26); //判断是否锁屏
            //exit();
            iunlockListen.failed(msg);
        }
        let max_try_times_wake_up = 10; //尝试解锁10次
        /* 唤醒设备 */
        while (!device.isScreenOn() && max_try_times_wake_up--) {
            device.wakeUp();
            sleep(500);
        }

        if (max_try_times_wake_up < 0) errorMessage("点亮屏幕失败"); //尝试次数max，显示失败文本
        let keyguard_manager = context.getSystemService(context.KEYGUARD_SERVICE);
        let isUnlocked = () => !keyguard_manager.isKeyguardLocked();
        let swipe_time = 0;
        let swipe_time_increment = 80;
        let max_try_times_swipe = 20; //初始化时间，递增时间，最大解锁时间
        while (!isUnlocked() && max_try_times_swipe--) {
            //miui 锁屏待解锁界面底部会有<紧急呼叫>按钮

           //if (text("紧急呼叫").exists()) {
                // let isExist;
                // let numberPosition;
                unlockNumberlock(password);
                /*

                let[isExist, numberPosition] = findAllNumber();
                console.verbose("是数字解锁", isExist, numberPosition);
                
                if (isExist) {
                    console.log("解锁界面为数字密码");
                    // unlockNumberlock(password, numberPosition);
                    for (let i = 0; i < password.length; i++) {
                      click(numberPosition[password[i]][0], numberPosition[password[i]][1]);
                    }
                    toastLog("解锁完成");
                    unlock_mode = 1;
                    break;
                }else{
                    iunlockListen.failed("找不到数字锁屏界面");
                }*/
                //break;
            //}
            swipe_time += swipe_time_increment;

            gesture(swipe_time, [540, HEIGHT * 0.5], [540, HEIGHT * 0.1]); //模拟手势
            //launch("com.miui.home")//尝试用这个触发

            sleep(1200);

        } //循环函数

        if (max_try_times_swipe < 0) {
           // errorMessage("上滑屏幕失败");
            while (!device.isScreenOn()) {
                //等待解锁
                sleep(3000);
            }
          iunlockListen.failed("上滑屏幕失败");
        } //尝试失败，重新设置一下参数

        log("解锁成功");
       if( unlock_mode == 0){
           console.log("未检测到锁屏");
            toastLog("将在将在10s后运行打卡，途中请勿操作，如需取消按[音量上]键");
            sleep(10000);
       }
        iunlockListen.success();
        

    },
  autoScreenshot: function(image_path) {
    image_path = image_path || files.cwd() + "/screenshot.png";
    let agree_thread = threads.start(function() {
        //  sleep(1000) //反悔时间
        var beginBtn;
        if (beginBtn = classNameContains("Button").textContains("立即开始").findOne(2000)) {
            beginBtn.click();
        }
    });
    if (!requestScreenCapture()) {
        toast("请求截图失败");
        agree_thread = null;
        return null;
    }
    if (!classNameContains("Button").textContains("立即开始").findOne(2000)) {
        let img = captureScreen();
        images.saveImage(img, image_path);
        agree_thread = null;
        //return img;
    }else{
        agree_thread = null;
       // return img;
    }
}


}

/*
 * 解锁数字密码
 *  @pasw 密码数组
 *  @nposition
 */
function unlockNumberlock(pasw, nposition) {
    console.log(pasw , typeof pasw);
    for (let i = 0; i < pasw.length; i++) {
    //控件解锁
        text(pasw[i]).click();
     //坐标解锁
        //click(nposition[pasw[i]][0], nposition[pasw[i]][1])
        //console.log(nposition[pasw[i]][0], nposition[pasw[i]][1]);
    }
    //toastLog("解锁完成");
    //console.log(pasw)
}

/*
 *  判断是数字密码
 * 查找屏幕上是否显示0～9数字并保存每个数字的XY坐标,如果全满足则返回true和数组
 */
function findAllNumber() {
    let numberPosition = {}
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        if (text(i)
            .exists()) {
            let numbon = text(i)
                .findOne()
                .bounds();
            numberPosition[i] = [numbon.centerX(), numbon.centerY()];
            sum++;
        }
    }
    return (sum === 9) ? [false, null] : [true, numberPosition];
}


module.exports = SystemUtil;