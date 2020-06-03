// pages/qualification/qualification.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 文案更新时间
        updatetime: '',
        // 默认介绍
        introduce: '邦房团结南路店成立于2017年3月份，至今已运营两年，获得无数业主及客户的认可，我们公司的核心价值观：诚信，利他，高效，专业，励志成为您身边的房产专家。'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.CompanyInfo()
    },

    // 获取数据
    CompanyInfo() {
        // wx.showLoading({
        //     title: '获取数据...',
        //     mask: true
        // })
        let that = this
        const db = wx.cloud.database()
        db.collection('CompanyInfo')
            .field({
                introduce: true,
                updatetime: true
            })
            .get({
                success(res) {
                    wx.hideLoading()
                    console.log('CompanyInfo-res', res, res.data[0].updatetime)
                    if (res.errMsg == "collection.get:ok") {
                        if (res.data.length > 0) {
                            that.setData({
                                introduce: res.data[0].introduce,
                                updatetime: res.data[0].updatetime
                            })
                        }
                    }
                },
                fail: err => {
                    wx.hideLoading()
                    console.log('Recommend-err', err)
                }
            })
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