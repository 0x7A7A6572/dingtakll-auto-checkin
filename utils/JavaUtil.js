JavaUtil = {
    toJavaInt: function(jsnum) {
        var JAVA_MAX_VALUE = 0X7FFFFFFF;
        if (jsnum > JAVA_MAX_VALUE) {
            jsnum = -(~jsnum + 1);
        }
        return jsnum;
    }
}

module.exports = JavaUtil;