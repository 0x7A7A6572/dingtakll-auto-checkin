  importClass(android.location.LocationManager);
    importClass(android.content.Context);
var AutoJsUtil = require("./AutoJsUtil.js")
var AppUtil = {};
AppUtil.stopApp = function(appName) {
    var pageName = getPackageName(appName);
  openAppSetting(pageName);
    sleep(1000)
    if (text("强制停止").exists()) {
        AutoJsUtil.clickCoordinate(text("强制停止").findOne(2000));
    } else if (text("关闭应用").exists()) {
        AutoJsUtil.clickCoordinate(text("关闭应用").findOne(2000));
    } else if (text("结束运行").exists()) {
        AutoJsUtil.clickCoordinate(text("结束运行").findOne(2000));      
    } else {
        var isnofind = ",未找到应用'" + appName +"'";
        toastLog("关闭应用失败" + (pageName==null?isnofind:""));
    }
 //点击确定关闭/停止应用   按钮
if(text("确定").exists()){
         text("确定").findOne(1000).click();     
       }else{ }
}
/*
 * 检查gps是否开启并自动开启,开启完毕返回应用
 * //只适配了miui
 */
AppUtil.gpsCheck = function(returnPackageName, turnon, stopNumber) {

    importClass(android.location.LocationManager);
    importClass(android.content.Context);
    
    stopNumber = stopNumber==null ? 1:stopNumber;
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
        while(AppUtil.gpsIsOpen() != turnon && stopCount < stopNumber)
        {/* autoX 偶然性的会跳转点击失败，故添加此循环 */
        //console.log(stopCount < stopNumber);
        text("开启位置服务")
            .findOne().clickCenter();
            stopCount++;
            sleep(1500)/* 重要* 点击按钮后系统打开定位，但是isProviderEnabled获取未及时更新 ，所以需要sleep做停顿*/
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
}
AppUtil.gpsIsOpen = function(){
  
    var locationManager = context.getSystemService(Context.LOCATION_SERVICE);
    console.log(" GPS当前状态!", locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER));
   return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }
module.exports = AppUtil;