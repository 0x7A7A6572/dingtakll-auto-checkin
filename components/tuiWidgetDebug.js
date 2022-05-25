importClass(android.graphics.Color);
importClass(android.text.style.BackgroundColorSpan);
importClass(android.text.Spanned);
importClass(android.text.SpannableString);
importClass(android.text.style.ForegroundColorSpan);
importClass(android.view.View.OnClickListener);
importClass(android.graphics.Typeface);
importClass(android.text.TextWatcher);

Util = require("../util.js");
var tf = Typeface.createFromFile(java.io.File(files.path("./res/linux.ttf")));

/* _____________
 *  tuiText
 */
var tuiText = (function() {
    //继承至ui.Widget
    util.extend(tuiText, ui.Widget);

    function tuiText() {
        //调用父类构造函数
        ui.Widget.call(this);

    }
    tuiText.prototype.render = function() {
        return (
            <text/>);
    }

    tuiText.prototype.onViewCreated = function(view) {
        //设置字体
        view.setTypeface(tf);
        //添加点击事件
        /*
         * colorfuls= [{start:0,end:6,color:"#ff0000",background:0xffff0000}
                       {...}, 可设置多个
                       ...]
         
         */
        view.setColourfulText = function(colorfuls) {
            if (colorfuls instanceof Array) {
                for (let i = 0; i < colorfuls.length; i++) {
                    spannableString = new SpannableString(view.getText().toString());
                    if (colorfuls[i].color) {
                        spannableString.setSpan(new ForegroundColorSpan(Util.toJavaInt(colorfuls[i].color)), colorfuls[i].start, colorfuls[i].end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                    }
                    if (colorfuls[i].background) {
                        spannableString.setSpan(new BackgroundColorSpan(Util.toJavaInt(colorfuls[i].background)), colorfuls[i].start, colorfuls[i].end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                    }
                    view.setText(spannableString)
                }
            } else {
                throw Error("The type must be an object and contain text and color");
            }
        }

    }
    ui.registerWidget("tui-text", tuiText);
    return tuiText;
})();

/* _____________
 *  tuiButton
 */

var tuiButton = (function() {


    util.extend(tuiButton, ui.Widget);
    //继承ui.Widget
    function tuiButton() {
        var default_text;
        var on_load_text;


        //调用父类构造函数
        ui.Widget.call(this);
      this.render = function() {
            return (
                <button/>);
        };
        this.onFinishInflation = function(view) {
                view.setTypeface(tf);
            },
            
        this.onViewCreated = function(view) {
            view.setTypeface(tf);
            view.setProgress = function(progre) {
                Pro = java.lang.Float.parseFloat(progre);
                progress = (java.lang.Math.round(Pro * 100)) / 100;

                this.invalidate();
            },
            view.setStatus = function(text) {
                statusText = text
                this.invalidate();
            }
        }

    }


    ui.registerWidget("tui-button", tuiButton);
    return tuiButton;
})();
/* _____________
 *  tuiEditText
 */
var tuiEditText = (function() {

    util.extend(tuiEditText, ui.Widget);
    //继承ui.Widget
    function tuiEditText() {
        var pref_key;
        var textStyle;
        //调用父类构造函数
        ui.Widget.call(this);
        this.defineAttr("prefKey", (view, attr, value, defineSetter) => {
            // if(tuiInput.isAutoStorage() && null!=value && "" != value){
            if (null != value && "" != value) {
                pref_key = value;
            }
            //print("tuiInput._prefkey:", tuiInput._prefkey)
        });
        this.defineAttr("textStyle", (view, attr, value, defineSetter) => {
            // if(tuiInput.isAutoStorage() && null!=value && "" != value){
            if (null != value && "" != value) {
                textStyle = value;
            }
            //print("tuiInput._prefkey:", tuiInput._prefkey)
        });
        //控件方法
        this.render = function() {
            return (
                <input tetextStyle="{{this.textStyle}}" bg="#ff0000"/>);

        };
        this.onViewCreated = function(view) {
            view.addTuiTextChangedListener = function(textWatcher) {
                var that = this;
                that.addTextChangedListener(new TextWatcher({
                    //@Override
                    afterTextChanged: function(s) {
                        tuiEditText.updatePref(that);
                        textWatcher.afterTextChanged(s);
                    },
                    beforeTextChanged: function(s, start, count, after) {
                        textWatcher.beforeTextChanged(s, start, count, after);
                    },
                    onTextChanged: function(s, start, before, count) {
                        textWatcher.onTextChanged(s, start, before, count);
                    }

                }));
            }
            view.getPrefKey = function() {
               // print("我被调用", pref_key)
                return pref_key;
            }
        }
        this.onFinishInflation = function(view) {
            //设置字体
            view.setTypeface(tf);
            if (null != view.getPrefKey()) {
                let pref_text = tuiEditText.getPref().get(view.getPrefKey());
                pref_text = pref_text == null ? "" : pref_text;
                view.setText(pref_text);
            }
            view.addTextChangedListener(new TextWatcher({
                //@Override
                afterTextChanged: function(s) {
                    tuiEditText.updatePref(view);
                }

            }));

        };

    }
    //tuiEditText方法
    tuiEditText.setPref = function(pref) {
        tuiEditText._pref = pref;
    };
    tuiEditText.getPref = function() {
        if (!tuiEditText._pref) {
            tuiEditText._pref = storages.create("tuiWidgetDateBase:tuiEditText");
        }
        return tuiEditText._pref;
    };
    /*
     *用来更新本地数据
     */
    tuiEditText.updatePref = function(view) {
        tuiEditText.getPref().put(view.getPrefKey(), view.getText().toString());
    };

    ui.registerWidget("tui-editText", tuiEditText);
    return tuiEditText;
})();

/* _____________
 *  tuiCheckBox
 */
var tuiCheckBox = (function() {
    
    util.extend(tuiCheckBox, ui.Widget);

    function tuiCheckBox() {
        var pref_key;
        var checked = false;
        var isForbid = true;
        var onCheck = function(checked){};
        ui.Widget.call(this);
        this.defineAttr("prefKey", (view, attr, value, defineSetter) => {
            if (null != value && "" != value) {
                this.pref_key = value;
            }
        });
        this.defineAttr("text", (view, attr, value, defineSetter) => {
            if (null != value) {
                view.getChildAt(1).setText(value);
            }
        });
        this.defineAttr("textSize", (view, attr, value, defineSetter) => {
            if (null != value) {
                // print(Util.sp2px(value))
                view.getChildAt(0).setTextSize(value);
                view.getChildAt(1).setTextSize(value);
            }
        });
        this.defineAttr("color", (view, attr, value, defineSetter) => {
            if (null != value) {
              //  view.getChildAt(0).setTextColor(Color.parseColor(value));
                view.getChildAt(1).setTextColor(Color.parseColor(value));
            }
        });
        this.defineAttr("statuColor", (view, attr, value, defineSetter) => {
            if (null != value) {
               view.getChildAt(0).setTextColor(Color.parseColor(value));
                //view.getChildAt(1).setTextColor(Color.parseColor(value));
            }
        });
        this.defineAttr("forbid", (view, attr, value, defineSetter) => {
            if (null != value) {
                this.isForbid = false;
                view.getChildAt(0).setText(this.status_style[2]);
                view.getChildAt(0).setTextColor(Color.parseColor("grey"));
                view.getChildAt(1).setTextColor(Color.parseColor("grey"));
            }
        });
        this.defineAttr("statusStyle", (view, attr, value, defineSetter) => {
            if (null != value && "" != value) {
                this.status_style = value.toString().split("|");
                if (this.status_style.length != 3) {
                    throw new Error("It must contain three forms, for example: checked | unchecked | disabled");
                }
            } else {
                throw new Error("The property value must be a non empty string and contain three forms separated by '|'")
            }
        });

    }

    tuiCheckBox.prototype.isForbid = true;
    tuiCheckBox.prototype.status_style = ["■", "□", "▧"];
    
    tuiCheckBox.prototype.onFinishInflation = function(view) {
        var that = this;
        //print("onFinishInflation;", this.isForbid)
        if (null != this.getKey()) {
            that.setChecked(tuiCheckBox.getPref().get(that.getKey(), false));
        }
        
        view.addOnCheckListen = function(listenCheck){
           that.onCheck = listenCheck;
          }
          
        view.setChecked = function(statu){
            that.setChecked(statu);
        }
        
        if (this.isForbid) {
            view.setOnClickListener(new android.view.View.OnClickListener({
                onClick: function(v) {
                    that.setChecked(!that.checked);
                    tuiCheckBox.getPref().put(that.getKey(), that.checked);
                    if(that.onCheck != null){
                    that.onCheck(that.checked);
                    }
                }
            }));
        }
        
        
        view.isChecked = function() {
           // toastLog("that.isChecked:"+that.checked)
            return that.checked;
        }
        view.getIsForbid = function() {
            if (!that.isForbid) {
                that.isForbid = true;
            } else {
                return that.isForbid;
            }
        }
    }

    tuiCheckBox.setPref = function(pref) {
        tuiCheckBox._pref = pref;
    }
    tuiCheckBox.getPref = function() {
        if (!tuiCheckBox._pref) {
            tuiCheckBox._pref = storages.create("tuiWidgetDateBase:tuiCheckBox");
        }
        return tuiCheckBox._pref;
    }
    tuiCheckBox.prototype.getKey = function() {
        if (this.pref_key) {
            return this.pref_key;
        }
        /* let id = this.view.attr("id");
         if(!id){
             throw new Error("should set a id or prefKey to the checkbox");
         }
         pref_key = id.replace("@+id/", "");*/
        return this.pref_key;
    }
    /*
     *实现继承checkbox方法
     */
    tuiCheckBox.prototype.setChecked = function(s) {
        this.checked = s;
        this.view.getChildAt(0).setText(s ? this.status_style[0] : this.status_style[1]);
    }
    /* tuiCheckBox.prototype.isChecked = function(){
        return this.checked;
     }*/
    tuiCheckBox.prototype.render = function() {
        return (
            <linear clickable="true" >
                            <tui-text text="□" checkable="false" layout_gravity="center" color="black"/>
                            <tui-text text="" checkable="false" color="black"/>
            </linear>);
    }

    ui.registerWidget("tui-checkBox", tuiCheckBox);
    return tuiCheckBox;
})();

