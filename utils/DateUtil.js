/*
 * @Author: zzerX
 * @Date:
 * @Last Modified by: zzerX
 * @Last Modified time:
 * @Description: 时间工具类
 */
DateUtil = {
    getFormatDate: function() {
        let date = new Date();
        let month = date.getMonth() + 1; //月份0-11
        let day = date.getDate();
        let today = (month < 10 ? "0" + month : month) + "月" +
            (day < 10 ? "0" + day : day) + "日";
        return today;
    },

    getFormatLogDate: function() {
        Date.prototype.Format = function(fmt) { // author: meizz
            var o = {
                "M+": this.getMonth() + 1, // 月份
                "d+": this.getDate(), // 日
                "h+": this.getHours(), // 小时
                "m+": this.getMinutes(), // 分
                "s+": this.getSeconds(), // 秒
                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                "S": this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        return (new Date()).Format("[MM-dd hh:mm:ss]:");

    }

}
module.exports = DateUtil;