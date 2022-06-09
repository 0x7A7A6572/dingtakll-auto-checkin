/*
 * @Author: zzerX
 * @Date:
 * @Last Modified by: zzerX
 * @Last Modified time:
 * @Description: autojs 辅助工具类
 */
var AutojsUtil = {
    /*
     * 点击控件中心坐标(autojs pro 中已自带点击中心方法，故这个暂时弃用)
     */
    clickCoordinate: function(uiselected, delay) {
        if (uiselected == null) {
            return false;
        }
        sleep(delay == null ? 0 : delay);
        var thisBounds = uiselected.bounds();
        click(thisBounds.centerX(), thisBounds.centerY());
        console.log(" click it")
        return true;
    },
/*快速查找
*/
    quickTextFind: function(str, delay) {
        if (text(str).exists()) {
            return text(str).findOne(delay)
        } else if (desc(str).exists()) {
            return desc(str).findOne(delay)
        } else {
            return null;
        }
    },
/*加了限制时间版本的waitForActivity
*/
    waitForActivity: function(activityName, period, limitTime) {
        let currentTime = new Date();
        while (activityName != currentActivity()) {
            // console.log(new Date() - currentTime)
            if (new Date() - currentTime >= limitTime) {
                return false;
            }
            sleep(period);
        }
        return true;
    },
    waitForPackage: function(packageName, period, limitTime) {
        let currentTime = new Date();
        while (packageName != currentPackage()) {
            if (new Date() - currentTime >= limitTime) {
                return false;
            }
            sleep(period);
        }
        return true;
    },
/*
*  当dofunc()不满足时，执行ifNot  n次
    dofunc必须有返回值 true/false
*/
    untilTask: {
        dofunc: null,
        doLimitTime: 10000,
        //orfunc: ()=>{return false;},
        ifnotfunc: null,
        ifnotCount: 5,
        currentCount: 0,
        do: function(dofunc, limitTime) {
            this.dofunc = dofunc;
            this.limitTime = limitTime;
            return this;
        },
        /*or: function(orfunc){
            this.orfunc = orfunc;
            return this;
        },*/
        ifnot: function(ifnotfunc, ifnotCount) {
            this.ifnotfunc = ifnotfunc;
            this.ifnotCount = ifnotCount;
            return this;
        },
        start: function() {
            let currentTime = new Date();
            while (!this.dofunc()) {
                this.ifnotfunc();
                this.currentCount++;
                if (this.currentCount >= this.ifnotCount) {
                    return false;
                }
                if (new Date() - currentTime >= this.doLimitTime) {
                    return false;
                }
            }
            return true;
        }
    }

};


module.exports = AutojsUtil;