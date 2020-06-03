// pages/Contact/Contact.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 用户列表
        UserList: [],
        // 默认数据总数
        total: 0,
        // 默认查询第一页
        page: 0
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
        let page = this.data.page
        this.DocCount()
        this.StaffList(page)
    },

    // 查询数据总数
    DocCount() {
        let that = this
        const db = wx.cloud.database()
        db.collection('ContactList')
            .count({
                success(res) {
                    console.log('count-res', res)
                    if (res.errMsg == "collection.count:ok") {
                        that.setData({
                            total: res.total
                        })
                    } else { }
                },
                fail(err) {
                    wx.hideLoading()
                    console.log('detail-err', err)
                }
            })
    },

    // 查询推荐列表
    StaffList(page) {
        wx.showLoading({
            title: '加载员工信息...',
            mask: true
        })
        let that = this
        let UserList = this.data.UserList
        const db = wx.cloud.database()
        db.collection('ContactList')
            .orderBy('updatetime', 'desc')
            .skip(page)
            .limit(10)
            .get({
                success(res) {
                    wx.hideLoading()
                    console.log('Recommend-res', res)
                    if (res.errMsg == "collection.get:ok") {
                        let data = res.data
                        if (data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                let showname = (data[i].name).replace(data[i].name.substring(1,2),'*')
                                let showphone = (data[i].phone).replace(data[i].phone.substring(3, 7), "****")

                                console.log(showname,showname.length,showname.replace(showname.substring(1,2),'*'))

                                // if (showname.length == 2) {
                                //     showname = showname.replace(showname.substring(1,2),'*')
                                // }else{
                                //     showname = showname.replace(showname.substring(1,showname.length),'*')
                                // }

                                let info = {
                                    '_id': data[i]._id,
                                    'name': data[i].name,
                                    'phone': data[i].phone,
                                    'updatetime': data[i].updatetime,
                                    'showname': showname,
                                    'showphone': showphone
                                }
                                UserList.push(info)
                            }
                            that.setData({
                                page: page,
                                UserList: UserList
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

     // 打电话
     CallPhone(e) {
        console.log(e, e.currentTarget.dataset.phone)
        let phoneNumber = e.currentTarget.dataset.phone
        let showphone = e.currentTarget.dataset.showphone
        wx.showModal({
            title: '温馨提示',
            content: `是否拨打${showphone}号码？`,
            confirmText: '确定拨打',
            confirmColor: '#0081ff',
            cancelText: '取消',
            cancelColor: '#acb5bd',
            success: res => {
                console.log(res)
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: phoneNumber,
                        success: res => {
                            console.log(res)
                        },
                        fail: err => {
                            console.log(err)
                        }
                    })
                }
            },
            fail: err => {
                console.log(err)
            }
        })

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
        let total = this.data.total
        let page = this.data.page
        let UserList = this.data.UserList

        if (UserList.length < total) {
            page = page + 10
            this.StaffList(page)
        } else {
            this.setData({
                showEnd: true
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})