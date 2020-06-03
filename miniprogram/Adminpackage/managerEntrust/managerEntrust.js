// Adminpackage/managerEntrust/managerEntrust.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 待审核
        CheckingEntrustList: [],
        // 已发布
        publishedEntrustList: []
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
        let IsPublish = false
        this.MyEntrust(IsPublish)
    },

    // 切换
    ChangeTab(e) {
        console.log(e)
        let id = e.detail.index
        let IsPublish = false
        if (id == 0) {
            IsPublish = false
        }
        if (id == 1) {
            IsPublish = true
        }
        this.MyEntrust(IsPublish)
    },

    // 查看委托
    MyEntrust(IsPublish) {
        console.log(IsPublish)
        wx.showLoading({
            title: '查询中...',
            mask: true
        })
        let that = this
        wx.cloud.callFunction({
            name: 'Entrust',
            data: {
                type: 'AllEntrust',
                IsPublish: IsPublish
            },
            success: res => {
                wx.hideLoading()
                console.log('myentrust-res', res)
                if (res.errMsg == "cloud.callFunction:ok") {
                    let data = res.result.data
                    if (data.length > 0) {
                        if (IsPublish) {
                            that.setData({
                                publishedEntrustList: data
                            })
                        } else {
                            that.setData({
                                CheckingEntrustList: data
                            })
                        }
                    } else {
                        // 提示没有数据
                    }
                } else {
                    // 提示网络错误
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log('myentrust-err', err)
            }
        })
    },

    // 跳转函数
    Navigate: function (e) {
        console.log(e)
        let id = e.currentTarget.dataset.id
        let type = e.currentTarget.dataset.type

        if(type=='unpublished'){
            var url = '../EntrustDetail/EntrustDetail'
        }
        if(type=='published'){
            var url = '../PublishedDetail/PublishedDetail'
        }
        
        wx.navigateTo({
            url: `${url}?id=${id}`,
        })
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