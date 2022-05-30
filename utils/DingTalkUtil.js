/*
 * @Author: zzerX
 * @Date:
 * @Last Modified by: zzerX
 * @Last Modified time:
 * @Description: 钉钉工具类
 */
importClass(android.net.Uri);

var DingTalkUtil = {
    listenUpdateDialogThread: null,
    urlOpen: "dingtalk://qr.dingtalk.com/page/link?url=",
    urlMicApp: "dingtalk://dingtalkclient/action/open_micro_app?",
    tablePageUrl: "https://swform.dingtalk.com/index.htm?corpId=${?}#/index/${?}",
    clockInUrl: "https://attend.dingtalk.com/attend/index.html?corpId=${?}",
    yunClassroom: "appId=5488&corpId=${?}",
    yunClassroomUrl: "https://saas.daxue.dingtalk.com/dingtalk/pc/detail.jhtml?appId=5488&corpId=${?}",
    openUrl: function(url) {
        var aq = this.urlOpen + escape(url);
        app.startActivity({
            action: "android.intent.action.VIEW",
            data: aq
        });
    },
    openMicApp: function(postData) {
        var aq = this.urlMicApp + postData;
        app.startActivity({
            action: "android.intent.action.VIEW",
            data: aq
        });
    },
    openClockInPage: function(corpId) {
        this.openUrl(templateString(this.tablePageUrl, [corpId]));
    },
    openTablePage: function(corpId) {
        this.openUrl(templateString(this.tablePageUrl, [corpId, corpId]));
    },
    openYunClassroom: function(corpId) {
        this.openMicApp(templateString(this.yunClassroom, [corpId]));
    },
    openYunClassroomWebPage: function(corpId) {
        this.openUrl(templateString(this.yunClassroomUrl, [corpId]));
    },
    shareImageToDingTallk: function(groupName, imagePath) {
        imagePath = imagePath || context.getExternalCacheDir() + "/screenshot.png";
        imagePath = tempTransit(imagePath, "png");
        console.warn("[shareImageToDingTallk image_path:] -> " + imagePath)
        let findtext_dingtalk_sendwho = "钉钉好友";
        let findtext_dingtalk_sendgrup = groupName;
        let findtext_dindtalk_sendbutton = "发送";
        intent = new Intent(Intent.ACTION_SEND);
        intent.setType("image/png");
        intent.putExtra(Intent.EXTRA_STREAM, Uri.parse(imagePath));
        intent.setClassName("com.alibaba.android.rimet", "com.alibaba.android.rimet.biz.BokuiActivity");
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
        sleep(500)
        text(findtext_dingtalk_sendwho).findOne(500).click();
        sleep(500)
        let button_group_name = text(findtext_dingtalk_sendgrup).findOne(2000)
        if (button_group_name != null) {
            button_group_name.clickCenter();
        } else {
            //否则提示没有找到
            toastLog("没有找到会话" + groupName);
        }
        /*try{
    text(findtext_dingtalk_sendgrup).findOne(500).parent().parent().parent().parent().click();
    }catch(err){
	   console.error(err)
     }*/
        sleep(500);
        try {
            text(findtext_dindtalk_sendbutton).findOne(500).click();
        } catch (err) {
            console.error("查找点击[发送]按钮出现意外错误", err)
            // this.clickCoordinate();
        } finally {
            //删除临时文件- 5s是否充足？
            setTimeout(() => {
                console.verbose("删除临时文件->", $files.remove(imagePath), ":", imagePath);
            }, 5000);

        }

    },
    /**
     * 启动线程点击忽略更新 (*在脚本结束时需要调用stopIgnoreUpdateThread结束线程)
     */
    startIgnoreUpdateThread: function() {
        var that = this;
        this.listenUpdateDialogThread = threads.start(function() {
            //  toast("start...");
            text("暂不更新")
                .waitFor();
            // toastLog("wait ok...");
            if (text("暂不更新")
                .findOne() && text("更新")
                .findOne()) {
                //  toastLog("find one...");
                text("暂不更新")
                    .findOne()
                    .click();
                //再次启动线程
                that.ignoreUpdateThread();
            }
        });
    },
    stopIgnoreUpdateThread: function() {
        //停止线程执行
        this.listenUpdateDialogThread.interrupt();
    }


};

/*
 * 模板字符串
 * ${?} => 仿java式的模板字符串
 */
function templateString(template, strArray) {
    var substr = "\$\{\?\}";
    for (let i = 0; i < strArray.length; i++) {
        template = template.replace(substr, strArray[i]);
    }
    return template;
}

/*async*/
function tempTransit(origin_file, file_type) {
    let temp_path = "/sdcard/temp_transit_file_0x7a7a." + file_type;
    /*await*/
    /*if($files.copy(origin_file, temp_path)){
        if(!$files.exists(temp_path)){
            sleep(500);
        }
    }else if(){
        this(origin_file,file_type);
    }*/
    $files.copy(origin_file, temp_path);
    return temp_path;
}

module.exports = DingTalkUtil;