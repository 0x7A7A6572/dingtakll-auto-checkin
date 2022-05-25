//importClass(android.view.WindowManager);
DialogPlus = {
    customView: null,
    title: null,
    positive: "确定",
    negative: "取消",
    wrapInScrollView: false,
    autoDismiss: false,
    dialog: null,
    isEmptyMode:false,
    _onTrue: null,
    _onFalse: null,
    setView: function(v) {
        this.customView = v;
        //console.log(this)
        return this;
    },
    setTitle: function(t){
        this.title = t;
        return this;
    },
    onTrue: function(func) {
       this._onTrue = func;
        return this;
    },
    onFalse: function(func) {
       this._onFalse = func;
        return this;
    },
    setEmptyMode: function(b){
        this.isEmptyMode = b;
        return this;
    },
    build: function() {
        if (this.customView != null) {
          this.dialog = dialogs.build({
                    customView: this.customView,
                    title: this.isEmptyMode ? null : this.title,
                    positive: this.isEmptyMode ? null : this.positive,
                    negative: this.isEmptyMode ? null : this.negative,
                    wrapInScrollView: this.wrapInScrollView,
                    autoDismiss: this.autoDismiss,
                    cancelable : false
                }).on("positive", this._onTrue)
                .on("negative", this._onFalse)
           /*  this.dialog.getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
             let lp = this.dialog.getWindow().getAttributes();
             lp.width = WindowManager.LayoutParams.MATCH_PARENT;
            lp.height = WindowManager.LayoutParams.WRAP_CONTENT;
            this.dialog.getWindow().setAttributes(lp);
            this.dialog.setContentView(this.customView, lp);
         */
        }
        return this;
    },
    show: function() {
        if (this.dialog != null) {
            this.dialog.show();
        }
        return this;
    },
    dismiss: function(){
      if (this.dialog != null) {
            this.dialog.dismiss();
        }
        return this;
    },
    getDialog: function(){
        return this.dialog;
    }

}

module.exports = DialogPlus;
 /*let myDialog = DialogPlus.setView(ui.inflate("<text text='hhhhh'></text>"))
              .setTitle(null)
              //.onTrue(function(){toast("确定")})
              //.onFalse(function(){toast("取消")})
              .setEmptyMode(true)
              .build()
              .show();
   */
//view.password.setText("这是外部设置的数据")