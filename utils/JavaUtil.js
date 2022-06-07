/*
 * @Author: zzerX
 * @Date:
 * @Last Modified by: zzerX
 * @Last Modified time:
 * @Description: Java转换工具类
 */
JavaUtil = {
    toJavaInt: function(jsnum) {
        var JAVA_MAX_VALUE = 0X7FFFFFFF;
        if (jsnum > JAVA_MAX_VALUE) {
            jsnum = -(~jsnum + 1);
        }
        return jsnum;
    },
    load_Time: function () {
        return new java.text.SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());
    }
}

module.exports = JavaUtil;