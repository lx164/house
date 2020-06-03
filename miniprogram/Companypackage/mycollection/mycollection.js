// pages/mycollection/mycollection.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        List: [],
        openid: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo')
        let openid = userInfo.openid
        this.setData({
            openid: openid
        })
        this.GetMyClloctions(openid)
    },

    // 获取自己的收藏
    GetMyClloctions(openid) {
        wx.showLoading({
            title: '加载中...'
        })
        let that = this
        const db = wx.cloud.database()
        db.collection('Collections')
            .where({
                _openid: openid,
            })
            .orderBy('updateTime', 'desc')
            .get({
                success(res) {
                    wx.hideLoading()
                    console.log('collection-res', res)
                    if (res.errMsg == "collection.get:ok") {
                        that.setData({
                            List: res.data
                        })
                    } else { }
                },
                fail(err) {
                    wx.hideLoading()
                    console.log('collection', err)
                }
            })
    },

    // 选择
    Edit(e) {
        console.log('Edit-e',e)
        let that = this
        wx.showActionSheet({
            itemList: ['查看详情', '删除该收藏'],
            success(res) {
                console.log('tapIndex',e,res.tapIndex)
                if (res.tapIndex == 0) {
                    that.Navigate(e)
                }
                if (res.tapIndex == 1) {
                    that.DeleteCollection(e)
                }
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })

    },

    // 跳转函数
    Navigate: function (e) {
        console.log('Navigate',e, e.currentTarget.dataset.type,e.currentTarget.dataset.id)
        let type = e.currentTarget.dataset.type
        let id = e.currentTarget.dataset.id
        wx.showLoading({
            title: '加载中...'
        })
        // 检查该收藏是否有效
        const db = wx.cloud.database()
        db.collection('Entrust').where({
            _id: id 
        }).count({
            success(res) {
                wx.hideLoading()
                console.log('exi',res)
                if (res.errMsg == 'collection.count:ok') {
                    if (res.total > 0) {
                        if (type == 'sale') {
                            var url = '../houseDetail/houseDetail'
                        }
                        if (type == 'rentout') {
                            var url = '../rentingHouseDetail/rentingHouseDetail'
                        }
                        wx.navigateTo({
                            url: `${url}?id=${id}`,
                        })
                    } else {
                        wx.showToast({
                            title: '该收藏的链接已失效,可能相关内容已经被管理员删除!请自己删除本条收藏',
                            mask: true,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                } else {
                    wx.showToast({
                        title: '网络错误,请返回重新打开',
                        mask: true,
                        icon: 'none'
                    })
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log(err)
                wx.showToast({
                    title: '网络错误,请返回重新打开',
                    mask: true,
                    icon: 'none'
                })
            }
        })
    },

    // 删除该收藏
    DeleteCollection(e) {
        wx.showLoading({
            title: '正在删除...'
        })
        let that = this
        let doc = e.currentTarget.dataset.doc
        const db = wx.cloud.database()
        db.collection('Collections').where({
            _id: doc
        }).remove({
            success(res) {
                wx.hideLoading()
                console.log(res)
                if (res.errMsg == 'collection.remove:ok') {
                    if (res.stats.removed > 0) {
                        // 刷新列表
                        let openid = that.data.openid
                        that.GetMyClloctions(openid)
                    } else {
                        wx.showToast({
                            title: '抱歉,删除失败!',
                            mask: true,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                } else {
                    wx.showToast({
                        title: '网络错误,请返回重新打开',
                        mask: true,
                        icon: 'none'
                    })
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log(err)
                wx.showToast({
                    title: '网络错误,请返回重新打开',
                    mask: true,
                    icon: 'none'
                })
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