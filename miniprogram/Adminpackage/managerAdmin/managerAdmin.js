// Adminpackage/managerAdmin/managerAdmin.js
const {
    MD5
} = require("./MD5.js")

const {
    formatTime
} = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showlist: true,
        showCode: false,
        //权限是否够
        IsAuthor: false,
        // 管理员列表
        UserList: [],
        // 二维码内容
        QRcodeData: "",
        // 显示失效
        QrcodeStats:false
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 管理员权限检查
        this.AdminInfo()
        // this.Test()
    },

    // 测试函数
    Test() {
        wx.cloud.callFunction({
            name: 'AdminManage',
            data: {
                type: 'qrcode'
            },
            success(res) {
                wx.hideLoading()
                console.log('res', res)
            },
            fail(err) {
                wx.hideLoading()
                console.log('err', err)
            }
        })
    },

    // 管理员权限检查
    AdminInfo() {
        let that = this
        let userInfo = wx.getStorageSync('userInfo')
        let name = userInfo.name
        wx.showLoading({
            title: '正在验证...',
            mask: true
        })
        wx.cloud.callFunction({
            name: 'AdminManage',
            data: {
                type: 'adminInfo'
            },
            success(res) {
                wx.hideLoading()
                console.log('admininfo-res', res, res.result.data[0])
                if (res.errMsg == 'cloud.callFunction:ok') {
                    if (res.result.data.length > 0) {
                        if (res.result.data[0].level === 0 && res.result.data[0].name === name) {
                            that.setData({
                                IsAuthor: true
                            })
                            // 获取管理员列表
                            that.AdminList()
                        }
                    }
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log('admininfo-err', err)
            }
        })
    },

    // 管理员列表
    AdminList() {
        let that = this
        wx.showLoading({
            title: '刷新列表...',
            mask: true
        })
        wx.cloud.callFunction({
            name: 'AdminManage',
            data: {
                type: 'AdminList'
            },
            success(res) {
                wx.hideLoading()
                console.log('adminlist-res', res)
                if (res.errMsg == 'cloud.callFunction:ok') {
                    if (res.result.data.length) {
                        console.log(res.result.data)
                        that.setData({
                            UserList: res.result.data
                        })
                    }
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log('adminlist-err', err)
            }
        })
    },

    // 长按
    EditInfo(e) {
        console.log(e)
        let that = this
        let id = e.currentTarget.dataset.id
        let openid = e.currentTarget.dataset.openid
        let name = e.currentTarget.dataset.name
        let phone = e.currentTarget.dataset.phone
        wx.showToast({
            title: '编辑模式',
            icon: 'none'
        })
        wx.showActionSheet({
            itemList: ['删除该管理员'],
            success(res) {
                console.log(res.tapIndex)
                if (res.tapIndex === 0) {
                    //   显示删除弹窗 
                    that.DeleteStaff(id, openid, name, phone)
                }
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },

    // 删除管理员
    DeleteStaff(id, openid, name, phone) {
        wx.showLoading({
            title: '正在删除...',
            mask: true
        })
        let that = this
        console.log(id, name, phone)
        wx.cloud.callFunction({
            name: 'AdminManage',
            data: {
                type: 'delete-admin',
                ID: id,
                openid: openid,
                name: name,
                phone: phone
            },
            success(res) {
                wx.hideLoading()
                console.log('res', res)
                if (res.errMsg == "cloud.callFunction:ok") {
                    if (res.result.errMsg == 'collection.remove:ok') {
                        if (res.result.stats === -999) {
                            // 不能删除自己
                            that.ShowTips('不能删除自己')
                        }

                        if (res.result.stats === -100) {
                            // 权限不足
                            that.ShowTips('权限不足')
                        }

                        if (res.result.stats > 0) {
                            // 删除成功
                            that.ShowTips('删除成功')
                            // 初始化列表
                            that.setData({
                                AdminList: []
                            })
                            // 刷新列表
                            that.AdminList()
                        }

                    } else {
                        // 删除失败
                        that.ShowTips('删除失败')
                    }
                } else {
                    // 删除失败
                    that.ShowTips('删除失败')
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log('err', err)
                wx.hideLoading()
                console.log('DeleteStaff-err', err)
                // 删除失败
                that.ShowTips('删除失败')
            }
        })
    },

    // 获取二维码
    ShowQRCode(e) {
        console.log('ShowQRCode')
        wx.showLoading({
            title: '获取二维码...',
            mask: true
        })
        let that = this
        wx.cloud.callFunction({
            name: 'AdminManage',
            data: {
                type: 'qrcode',
                updatetime: formatTime(new Date())
            },
            success(res) {
                wx.hideLoading()
                console.log('res', res)
                if (res.errMsg == "cloud.callFunction:ok") {
                    let data = res.result.data
                    if (data.id && !data.stats && data.code) {
                        // 设置二维码的值并显示
                        that.setData({
                            QRcodeData: JSON.stringify(data),
                            QrcodeStats: true,
                            showCode: true
                        })
                        // 开始监听二维码状态
                        that.QrcodeStats(data.id)
                    } else {
                        that.ShowTips('网络错误,获取失败')
                    }
                } else {
                    that.ShowTips('网络错误,获取失败')
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log(err)
                that.ShowTips('网络错误,获取失败')
            }
        })
    },

    // 监听二维码状态
    QrcodeStats(id) {
        let that = this
        const db = wx.cloud.database()
        var watcher = db.collection('TempCllection').where({
            _id: id
        }).watch({
            onChange: function (snapshot) {
                console.log('snapshot', snapshot)
                console.log('docChanges', snapshot.docChanges)
                console.log('docs', snapshot.docs[0])
                console.log("***************************")
                if (snapshot.docs[0].stats) {
                    // 提示二维码失效
                    that.setData({
                        QrcodeStats: false
                    })
                    // 关闭监听
                    watcher.close()
                }
            },
            onError: function (err) {
                 // 关闭监听
                 watcher.close()
                console.error('the watch closed because of error', err)
            }
        })
    },

    // 提示
    ShowTips(tips) {
        wx.showToast({
            title: tips,
            mask: true,
            icon: 'none'
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