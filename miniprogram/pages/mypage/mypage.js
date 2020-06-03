// pages/mypage/mypage.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        UserLogin: false,
        userInfo: null,
        Adminstator: false,
        // 点击次数记录
        TapAccount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.IsLogon()
        console.log(app.globalData)
        // 全局变量
        let globalData = app.globalData
        let userInfo = globalData.userInfo
        userInfo['phone'] = userInfo['phone'].replace(userInfo['phone'].substring(3, 7), "****")
        this.setData({
            UserLogin: globalData.UserLogin,
            userInfo: userInfo
        })
    },

    // 检查是否为管理员
    IsAdminstator() {
        wx.showLoading({
            title: '正在检验...',
            mask: true
        })
        let that = this
        wx.cloud.callFunction({
            name: 'InitInfo',
            data: {
                type: 'ADMIN'
            },
            success: res => {
                wx.hideLoading()
                console.log('adminres', res)
                if (res.result.total > 0) {
                    that.setData({
                        Adminstator: true
                    })
                    // 管理员跳转到管理员页面
                    var url = '../../Adminpackage/managerHome/managerHome'
                    var title = '进入管理员页面'
                    var id = that.data.userInfo.name
                } else {
                    // 不是管理员，跳转到扫码页面
                    var url = '../../Adminpackage/scanPage/scanPage'
                    var title = '扫码'
                    var id = 'mypage'
                }

                wx.showToast({
                    title: title,
                    icon: 'none'
                })
                that.setData({
                    TapAccount: 0
                })
                wx.navigateTo({
                    url: `${url}?id=${id}`,
                })
            },
            fail: err => {
                wx.hideLoading()
                console.log('err', err)
            }
        })
    },

    // 秘密入口
    ScanPage() {
        let TapAccount = this.data.TapAccount
        TapAccount = TapAccount + 1
        console.log(TapAccount)
        if (TapAccount < 5) {
            this.setData({
                TapAccount: TapAccount
            })
        } else {
            // 检查管理员身份
            this.IsAdminstator()
        }
    },

    // 跳转函数
    Navigate: function (e) {
        console.log(e, e.currentTarget.dataset.url)
        let url = e.currentTarget.dataset.url
        let id = e.currentTarget.dataset.id
        let UserLogin = this.data.UserLogin
        if (UserLogin) {
            wx.navigateTo({
                url: `${url}?id=${id}`,
            })
        } else {
            // 提示登录
            wx.showToast({
                title: '你还未登录，请先登录！',
                icon: 'none',
                duration: 2500,
                mask: true,
            })
        }
    },

    // 跳转到登录页
    NavigateToLogin: function (e) {
        wx.navigateTo({
            url: '../login/login'
        })
    },

    // 清除数据
    CleanInfo() {
        wx.showLoading({
            title: '正在清除...',
            mask: true
        })
        let that = this
        setTimeout(
            function () {
                wx.hideLoading()
                wx.showToast({
                    title: '清除成功',
                    mask: true
                })
                that.setData({
                    UserLogin: false,
                    Adminstator: false
                })
                wx.removeStorageSync('userInfo')
            }, 2000
        )
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})