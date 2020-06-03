// pages/managerHome/managerHome.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Adminstator: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        console.log(e)
        let name = e.id
        // 修改导航栏标题
        wx.setNavigationBarTitle({
            title: `欢迎，${name?name:''} 管理员`
        })
        this.IsAdminstator()
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
                } else {
                    // 提示权限不足，非管理员身份
                    wx.showToast({
                        title:'权限不足',
                        icon:'none',
                        mask:true
                    })
                    // 跳转回个人中心
                    wx.switchTab({
                      url: '../../pages/mypage/mypage',
                    })
                }
            },
            fail: err => {
                console.log('err', err)
            },
            complete: res => {
                console.log('complete', res)
            }
        })
    },

    // 跳转函数
    Navigate: function (e) {
        console.log(e)
        let url = e.currentTarget.dataset.url
        if (url == '../') {
            wx.showToast({
                title: '未开放',
                icon: 'none'
            })
            return
        } else {
            wx.navigateTo({
                url: `${url}`,
            })
        }
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