NotifyUtil = {
    id:null,
    sendNotify: function(id, notifyTitle, notifyText) {
    let notifyTicker = "";
    let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
    let notification;
    this.id = id;
    if (device.sdkInt >= 26) {
        var channel = new android.app.NotificationChannel(this.id, "钉钉自动健康打卡通知", android.app.NotificationManager.IMPORTANCE_DEFAULT);
        channel.enableLights(true);
        channel.setLightColor(0xff0000);
        channel.setShowBadge(false);
        manager.createNotificationChannel(channel);
        notification = new android.app.Notification.Builder(context, this.id)
            .setContentTitle(notifyTitle)
            .setContentText(notifyText)
            .setWhen(new Date().getTime())
            .setSmallIcon(-1)
            .setTicker(notifyTicker)
            .build();
    } else {
        notification = new android.app.Notification.Builder(context)
            .setContentTitle(notifyTitle)
            .setContentText(notifyText)
            .setWhen(new Date().getTime())
            .setSmallIcon(-1)
            .setTicker(notifyTicker)
            .build();
    }
    manager.notify(this.id, notification);
},
removeNotify: function() {
    let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
    //应该选择自己的通知进行remove
    //manager.cancelAll();
     manager.cancel(this.id);
}
}
module.exports = NotifyUtil;