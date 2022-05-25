var DipUtil = {};
/*dp(dip): device independent pixels(设备独立像素). 不同设备有不同的显示效果,这个和设备硬件有关，一般我们为了支持WVGA、HVGA和QVGA 推荐使用这个，不依赖像素。
dp也就是dip，这个和sp基本类似。如果设置表示长度、高度等属性时可以使用dp 或sp。但如果设置字体，需要使用sp。dp是与密度无关，sp除了与密度无关外，还与scale无关。如果屏幕密度为160，这时dp和sp和px是一 样的。1dp=1sp=1px，但如果使用px作单位，如果屏幕大小不变（假设还是3.2寸），而屏幕密度变成了320。那么原来TextView的宽度 设成160px，在密度为320的3.2寸屏幕里看要比在密度为160的3.2寸屏幕上看短了一半。但如果设置成160dp或160sp的话。系统会自动 将width属性值设置成320px的。也就是160 * 320 / 160。其中320 / 160可称为密度比例因子。也就是说，如果使用dp和sp，系统会根据屏幕密度的变化自动进行转换。
px: pixels(像素). 不同设备显示效果相同，一般我们HVGA代表320x480像素，这个用的比较多。
pt: point，是一个标准的长度单位，1pt＝1/72英寸，用于印刷业，非常简单易用；
sp: scaled pixels(放大像素). 主要用于字体显示best for textsize。*/

/** 
 * 将px值转换为dip或dp值，保证尺寸大小不变 
 *  
 * @param pxValue 
 * @param scale 
 *            （DisplayMetrics类中属性density） 
 * @return 
 */
DipUtil.px2dip = function(pxValue) {
    var scale = context.getResources().getDisplayMetrics().density;
    return pxValue / scale + 0.5;
}

/** 
 * 将dip或dp值转换为px值，保证尺寸大小不变 
 *  
 * @param dipValue 
 * @param scale 
 *            （DisplayMetrics类中属性density） 
 * @return 
 */
DipUtil.dip2px = function(dipValue) {
    var scale = context.getResources().getDisplayMetrics().density;
    return dipValue * scale + 0.5;
}

/** 
 * 将px值转换为sp值，保证文字大小不变 
 *  
 * @param pxValue 
 * @param fontScale 
 *            （DisplayMetrics类中属性scaledDensity） 
 * @return 
 */
DipUtil.px2sp = function(pxValue) {
    var fontScale = context.getResources().getDisplayMetrics().scaledDensity;
    return pxValue / fontScale + 0.5;
}

/** 
 * 将sp值转换为px值，保证文字大小不变 
 *  
 * @param spValue 
 * @param fontScale 
 *            （DisplayMetrics类中属性scaledDensity） 
 * @return 
 */
DipUtil.sp2px = function(spValue) {
    var fontScale = context.getResources().getDisplayMetrics().scaledDensity;
    return spValue * fontScale + 0.5;
}

/*s类中属性scaledDensity） 
         * @return 
         */  
DipUtil.sp2px=function(  spValue) {  
            var fontScale = context.getResources().getDisplayMetrics().scaledDensity;  
            return spValue * fontScale + 0.5;  
        }
    