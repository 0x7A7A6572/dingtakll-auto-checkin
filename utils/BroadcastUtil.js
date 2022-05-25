
importClass(android.content.IntentFilter);
importClass(android.content.ContextWrapper);
let BroadcastUtil = {
    register: function(onReceiveFunc) {
        let _mBroadcastReceiver;
        let filter = new IntentFilter();
        filter.addAction("BroadcastReceiver");
        new ContextWrapper(context).registerReceiver(_mBroadcastReceiver = new BroadcastReceiver({
            onReceive: onReceiveFunc
            /*function(context, intent) {
                       test = intent.getStringExtra("information");
                   }*/
        }), filter);
        return _mBroadcastReceiver;
    },
    send: function(extraKey, extraValue) {
            var intent = new Intent();
            intent.setAction("BroadcastReceiver")
            intent.putExtra(extraKey, extraValue + "");
            context.sendBroadcast(intent);

    },
    destroy:function(mb){
        new ContextWrapper(context).unregisterReceiver(mb);
}
}

module.exports = BroadcastUtil;