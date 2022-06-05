/*
 * @Author: zzerX
 * @Date:
 * @Last Modified by: zzerX
 * @Last Modified time:
 * @Description: 操作系统的工具类
 */
importClass(android.net.ConnectivityManager);
importClass(android.location.LocationManager);
importClass(android.content.Context);
SystemUtil = {
    XIAOMI: 0,
    HUAWEI: 1,
    OPPO: 2,
    VIVO: 3,
    Other: -1,

    getBrand: function() {
        let brands = ["xiaomi", "redmi", "huawei", "honor", "vivo", "oppo"];
        for (let i = 0; i < brands.length; i++) {
            if (device.brand.toLowerCase().match(brands[i]) != null) {
                if (i < 2) {
                    return this.XIAOMI;
                }
                if (i > 2 && i < 4) {
                    return this.HUAWEI;
                }
            }
        }
        return this.Other;
    },
    getGpsSwitchText: function() {
        let gps_switch_text = null;
        switch (this.getBrand()) {
            case this.XIAOMI:
                gps_switch_text = "开启位置服务";
                break;
            case this.HUAWEI:
                gps_switch_text = "访问我的位置信息";
                break;
            case this.OPPO:
                break;
            case this.VIVO:
                gps_switch_text = null;
                break;
            default:
                break;
        }
        return gps_switch_text;
    },
    /*
     * 解锁结果回调
     */
    unlockListen: function() {
        return {
            success: function() {},
            failed: function(log) {
                console.warn(log);
            }
        }
    },
    /*
     * 解锁(小米)
     */
    unlock: function(password, iunlockListen, true_dev_set) {
        
        let unlock_mode = 0; // 0 未锁屏, 1 数字解锁, 2 上滑解锁
        let HEIGHT = device.height == 0 ? 1080 : device.height; //锁屏时获取的可能是0 
        let true_dev_set,swap_path = handleDevSetdata(true_dev_set);
        console.verbose("handleDevSetdata result：true_dev_set,swap_pat =>" ,true_dev_set,swap_path);
        let errorMessage = function(msg) { 
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
            console.log("唤醒设备...");
        }

        if (max_try_times_wake_up < 0) {
            errorMessage("点亮屏幕失败");
        } //尝试次数max，显示失败文本
        let keyguard_manager = context.getSystemService(context.KEYGUARD_SERVICE);
        let isUnlocked = () => !keyguard_manager.isKeyguardLocked();
        let swipe_time = 0;
        let swipe_time_increment = 80;
        let max_try_times_swipe = 20; //初始化时间，递增时间，最大解锁时间
        while (!isUnlocked() && max_try_times_swipe--) {
            //锁屏待解锁界面底部会有<紧急呼叫>按钮

            if (text(true_dev_set.lock_call).exists()) {

                let [isExist, numberPosition] = findAllNumber();
                console.verbose("是数字解锁", isExist, numberPosition);
                //unlockNumberlock(password,numberPosition);
                //unlock_mode = 1;

                if (isExist) {
                    console.log("解锁界面为数字密码[", password, "]");
                    //unlockNumberlock(password, numberPosition);
                    for (let i = 0; i < password.length; i++) {
                        console.info("click数字", click(numberPosition[password[i]][0], numberPosition[password[i]][1]));
                    }
                    toastLog("解锁完成", isUnlocked());
                    unlock_mode = 1;
                    //break;
                } else {
                    iunlockListen.failed("找不到数字锁屏界面");
                }
                // break;
            }else if(max_try_times_swipe == 0){
                toastLog("找不到" + true_dev_set.lock_call + ",请检查配置");
                iunlockListen.failed("找不到" + true_dev_set.lock_call + ",请检查配置");
               // exit();
            }
            /*不存在[紧急呼叫]时滑动屏幕*/
            swipe_time += swipe_time_increment;

            gesture(swipe_time, [540, HEIGHT * split_swap.start], [540, HEIGHT * split_swap.end]); //模拟手势
            //launch("com.miui.home")//尝试用这个触发

            sleep(1200);

        } //循环函数

        /* if (max_try_times_swipe < 0) {
           // errorMessage("上滑屏幕失败");
            while (!device.isScreenOn()) {
                //等待解锁
                sleep(3000);
            }
          iunlockListen.failed("上滑屏幕失败");
        } //尝试失败，重新设置一下参数
*/
        //log("解锁成功");
        if (unlock_mode == 0) {
            console.log("未检测到锁屏");
            toastLog("将在将在5s后运行打卡，途中请勿操作，如需取消按[音量上]键");
            sleep(5000);
        } else {
            toastLog("正在运行打卡，途中请勿操作，如需退出按[音量上]键");
        }
        iunlockListen.success();

    },
    autoScreenshot: function(image_path,allow_screenshort_text) {
        image_path = image_path || context.getExternalCacheDir() + "/screenshot.png";
        console.warn("[autoScreenshot image_path:] -> " + image_path);
        let agree_thread = threads.start(function() {
            //  sleep(1000) //反悔时间
            var beginBtn;
            if (beginBtn = classNameContains("Button").textContains(allow_screenshort_text).findOne(2000)) {
                beginBtn.click();
            }
        });
        if (!requestScreenCapture()) {
            toast("请求截图失败");
            agree_thread = null;
            return null;
        }
        if (!classNameContains("Button").textContains(allow_screenshort_text).findOne(2000)) {
            let img = captureScreen();
            images.saveImage(img, image_path);
            agree_thread = null;
            //return img;
        } else {
            agree_thread = null;
            // return img;
        }
    },
    isHaveNet: function() {
        let cm = context.getSystemService(context.CONNECTIVITY_SERVICE);
        let net = cm.getActiveNetworkInfo();
        //log(net);
        if (net == null || !net.isAvailable()) {
            //toastLog("网络连接不可用!");
            return false;
        } else {
            return true;
            // toastLog("网络连接可用!");
        }
    },
    gpsCheckAndDo: function(returnPackageName, turnon, stopNumber) {
        stopNumber = stopNumber == null ? 1 : stopNumber;
        let stopCount = 0;
        var locationManager = context.getSystemService(Context.LOCATION_SERVICE);
        //console.log(turnon,locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER))
        if (turnon != locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            //sleep(1000)
            //toast("需要开启定位");
            intent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            console.verbose("跳转设置界面")
            //waitForActivity("com.android.settings.Settings$LocationSettingsActivity",2000);
            //click(955,508);
            //swipe(900,1900,500,900,500);
            while (this.gpsIsOpen() != turnon && stopCount < stopNumber) { /* autoX 偶然性的会跳转点击失败，故添加此循环 */
                //console.log(stopCount < stopNumber);
                if (this.getGpsSwitchText() != null) {
                    text(this.getGpsSwitchText())
                        .findOne().clickCenter();
                } else {
                    this._LimitSetGps();
                }
                stopCount++;
                sleep(1500) /* 重要* 点击按钮后系统打开定位，但是isProviderEnabled获取未及时更新 ，所以需要sleep做停顿*/
                console.verbose(">尝试点击开启位置服务 (" + stopCount + "/" + stopNumber + ")");
            }
            // console.warn("AutoJsUtil.clickCoordinate结束");
            //.parent().parent().click();
            //click(122, 174); //点击左上角返回(不精确，应跳转app)
            if (returnPackageName != null) {

                launch(returnPackageName);
                //toast(returnPackageName);
                //waitForActivity(returnActivity);
            }
        } else {
            //toast("GPS可用");
        }
        return true;
    },

    gpsIsOpen: function() {
        let locationManager = context.getSystemService(Context.LOCATION_SERVICE);
        console.log(" GPS当前状态!", locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER));
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    },
    /*
     * 当无法判断型号，不知道特征的情况下，定位界面一般只有一个checkbox,利用这点进行开启
     */
    _LimitSetGps: function() {
        let cb = className("android.widget.CheckBox").findOne(2000);
        if (cb) {
            cb.clickCenter();
        } else {
            let ca = checkable(true).findOne(2000);
            if (ca) {
                ca.clickCenter()
            }
        }
    }


}

/*
 * 解锁数字密码
 *  @pasw 密码数组
 *  @nposition
 */
function unlockNumberlock(pasw, nposition) {
    console.log(pasw, typeof pasw, nposition);
    for (let i = 0; i < pasw.length; i++) {
        //控件解锁
        // text(pasw[i]).click();
        //坐标解锁
        click(nposition[pasw[i]][0], nposition[pasw[i]][1])
        console.log(nposition[pasw[i]][0], nposition[pasw[i]][1]);
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
            // console.info(numbon)
            numberPosition[i] = [numbon.centerX(), numbon.centerY()];
            sum++;
        }
    }
    return (sum == 9) ? [false, null] : [true, numberPosition];
}

function handleDevSetdata(setdata){
    let swap_path = split_swap = {start:0.6, end:0.3};
    if(setdata != null && typeof setdata == "object") {
        if (setdata.lock_call == null || setdata.lock_call == "" || setdata.lock_call == undefined) {
                setdata.lock_call = "紧急呼叫";
            }
         if (setdata.swap_path != null && setdata.swap_path != "" && setdata.swap_path != undefined) {     
                try{
                   [split_swap.start,split_swap.end] = setdata.swap_path.split("~");
                   if(split_swap.length != 2 && isNaN(split_swap.start)){
                       throw new Error('滑动路径配置有误' + split_swap.length + " " + isNaN(split_swap.start))
                   }
                }catch(e){
                    split_swap_error = true;
                    toast("滑动路径配置有误");
                    console.error("滑动路径配置有误",setdata,split_swap," ->已还原配置");
                    split_swap = {start:0.6, end:0.3};
                }
            }else{
                split_swap = {start:0.6, end:0.3};
            }   
            return [setdata,split_swap];
    }else{
        console.warn("handleDevSetdata:setdata格式错误");
        setdata = {lock_call:"紧急呼叫", swap_path:"0.6~0.3"};
        split_swap = {start:0.6, end:0.3};
        return [setdata,split_swap]
    }
}

module.exports = SystemUtil;