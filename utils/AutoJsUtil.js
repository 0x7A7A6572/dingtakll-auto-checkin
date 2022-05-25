var AutoJsUtil = {
    /*
     * 点击控件中心坐标
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

    quickTextFind: function(str, delay) {
        if (text(str).exists()) {
            return text(str).findOne(delay)
        } else if (desc(str).exists()) {
            return desc(str).findOne(delay)
        } else {
            return null;
        }
    }

};


module.exports = AutoJsUtil;