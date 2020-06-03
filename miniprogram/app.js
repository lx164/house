//app.js
App({
    onLaunch: function () {
        // 初始化云开发环境
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'dev-house-0tiax',
                traceUser: true,
            })
        }
        this.IsLogon()
    },

    //检测是否登录函数
    // 为登录则提示登录
    IsLogon() {
        // 获取缓存的登录信息
        var userInfo = wx.getStorageSync('userInfo')
        console.log('app.js',userInfo)
        if (userInfo.name && userInfo.phone) {
            this.globalData.UserLogin = true
            this.globalData.userInfo = userInfo
        }else{
            this.globalData.UserLogin = false
        }
    },

    globalData: {
        userInfo: null,
        UserLogin:false
    }
})