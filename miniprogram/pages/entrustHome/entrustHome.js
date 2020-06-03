// pages/entrust/entrustHome.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.IsLogon()
        console.log(app.globalData)
        // 全局变量
        let globalData = app.globalData
        this.setData({
            UserLogin: globalData.UserLogin,
            userInfo: globalData.userInfo
        })
    },

    // 页面跳转
    NavigateToPages(e) {
        let url = e.currentTarget.dataset.url
        let id = e.currentTarget.dataset.id
        let title = e.currentTarget.dataset.title
        let backgroundcolor = e.currentTarget.dataset.backgroundcolor

        console.log(e, url, id, title)

        if (this.data.UserLogin) {
            wx.navigateTo({
                url: `${url}?id=${id}&title=${title}&backgroundcolor=${backgroundcolor}`,
                success: function (res) {
                    console.log('res', res)
                },
                fail: function (err) {
                    console.log('err', err)
                }
            })
        } else {
            // 提示登录
            wx.showToast({
                title: '你还未登录，请先到个人中心登录！',
                icon: 'none',
                duration: 2500,
                mask: true,
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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