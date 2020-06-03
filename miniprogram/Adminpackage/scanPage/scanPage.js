// Adminpackage/scanPage/scanPage.js
const { formatTime } = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scanCount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo')
        let name = userInfo.name
        if (name) {
            // 修改导航栏标题
            wx.setNavigationBarTitle({
                title: `欢迎，${name} --请扫码`
            })
        }
    },

    // 扫码
    ScanQrCode(e) {
        console.log(e)
        var that = this
        // 允许从相机和相册扫码
        wx.scanCode({
            // 扫码类型
            scanType: ['qrCode'],
            success(res) {
                console.log('scan-res', res)
                if (res.errMsg == 'scanCode:ok') {
                    let content = res.result
                    that.CheckQrCode(content)
                }
            },
            fail(err) {
                wx.showToast({
                    title: '扫描失败',
                    image: '../images/fail.png',
                    duration: 2000,
                    mask: true
                })
            }
        })
    },

    // 查询二维码的正确性
    CheckQrCode(data) {
        wx.showLoading({
            title: '正在验证...',
            mask: true
        })
        console.log('data', data)
        let that = this
        // 查询后修改扫描次数，超过五次则提示并退出页面
        var data = JSON.parse(data)
        console.log(data, typeof (data))
        // 验证该二维码的有效性
        const db = wx.cloud.database()
        db.collection('TempCllection').where({
            _id: data.id,
            stats: data.stats,
            code: data.code,
            updatetime: data.updatetime
        }).count({
            success(res) {
                wx.hideLoading()
                console.log('count-res', res)
                if (res.errMsg == "collection.count:ok") {
                    if (res.total > 0) {
                        // 调用函数，修改该纪录
                        that.AdminAdd(data)
                    } else {
                        that.ShowTips("该二维码已经失效")
                    }
                } else {
                    that.ShowTips("网络错误,无法验证该二维码")
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log('detail-err', err)
                that.ShowTips("网络错误,无法验证该二维码")
            }
        })
    },

    // 调用云函数，添加管理员
    AdminAdd(data) {
        wx.showLoading({
            title: '正在设置...',
            mask: true
        })
        let that = this
        let userInfo = wx.getStorageSync('userInfo')
        let name = userInfo.name
        let phone = userInfo.phone
        let avatarUrl = userInfo.avatarUrl
        wx.cloud.callFunction({
            name: 'AdminManage',
            data: {
                'data': data,
                'name': name,
                'phone': phone,
                'avatarUrl': avatarUrl,
                'updatetime': formatTime(new Date()),
                'type': 'add-admin'
            },
            success(res) {
                wx.hideLoading()
                console.log('count-res', res, res.result.code, res.result.code == 200, res.result.errMsg, res.result.errMsg == 'ok')
                if (res.errMsg == "cloud.callFunction:ok") {
                    if (res.result.code == 200 && res.result.errMsg == 'ok') {
                        // 提示管理员设置成功
                        wx.showModal({
                            title: '成功提示',
                            content: '管理员设置成功,请返回个人中心,连续点击5次头像即可使用管理员身份进行管理。',
                            mask: true,
                            confirmText: '好的',
                            showCancel: false,
                            complete(res) {
                                // 返回到个人中心页
                                wx.switchTab({
                                    url: '../../pages/mypage/mypage',
                                })
                            }
                        })
                    } else {
                        that.ShowTips('网络错误,管理员设置失败')
                    }
                } else {
                    that.ShowTips('网络错误,管理员设置失败')
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log('detail-err', err)
                that.ShowTips("网络错误,无法验证该二维码")
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