var Util = require("../util.js");
var IMAGR_PATH = "/sdcard/健康打卡.png";
var IMAGR_PATH = "/";
Util.autoScreenshot(IMAGR_PATH);
Util.autoShare(GROUP_NAME, IMAGR_PATH);
