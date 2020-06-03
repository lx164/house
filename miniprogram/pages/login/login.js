// pages/login/login.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showAuth: true,
        showform: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        console.log(e)
        let id = e.id
    },

    // 授权获取用户信息
    onGotUserInfo: function (e) {
        console.log(e)
        console.log(e.detail.errMsg)
        console.log(e.detail.userInfo)
        console.log(e.detail.rawData)
        let that = this
        if (e.detail.errMsg == "getUserInfo:ok") {
            let userInfo = e.detail.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            var userData = {
                'userInfo': userInfo,
                'nickName': nickName,
                'avatarUrl': avatarUrl,
                'gender': gender,
                'province': province,
                'city': city,
                'country': country
            }
            that.setData({
                userInfo: userData
            })
            // 获取数据库的用户信息
            that.InitInfo(userData)
        } else {
            // 提示需要授权
            wx.showToast({
                title: '使用前请先授权登录',
                icon: 'none',
                duration: 1000,
                mask: true,
            })
        }
    },

    // 获取个人信息
    InitInfo(userInfo) {
        wx.showLoading({
            title: '正在加载...',
            mask: true
        })
        let that = this
        wx.cloud.callFunction({
            name: 'InitInfo',
            data: {
                type: 'INIT'
            },
            success: res => {
                wx.hideLoading()
                console.log('res', res)
                let result = res.result.data
                // 判断是否已经注册
                if (result.length) {
                    // 已注册，拉取公告、推荐列表
                    userInfo['openid'] = result[0]._openid
                    userInfo['name'] = result[0].name
                    userInfo['phone'] = result[0].phone
                    userInfo['address'] = result[0].address
                    // 缓存到本地
                    wx.setStorageSync('userInfo', userInfo)
                    // 修改全局变量为已登录
                    app.IsLogon()
                    // 跳转到home
                    wx.switchTab({
                        url: '../home/home'
                    })
                } else {
                    // 显示注册页面，并提示注册
                    that.setData({
                        showAuth: false,
                        showform: true
                    })
                    wx.showToast({
                        title: '你还未注册，请填写注册信息！',
                        icon: 'none',
                        duration: 2500,
                        mask: true,
                    })
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log('err', err)
                wx.showToast({
                    title: '网络错误，信息获取失败...',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: res => {
                console.log('complete', res)
            }
        })
    },

    // 获取输入框数据
    InputData: function (e) {
        console.log(e, e.currentTarget.id, e.detail.value)
        let userInfo = this.data.userInfo
        let id = e.currentTarget.id
        let value = e.detail.value
        userInfo[id] = value
        this.setData({
            userInfo
        })
    },

    // 提交注册信息
    SubmitRegister(e) {
        // 保存
        wx.showLoading({
            mask: true,
            title: '正在保存...',
        })
        let userInfo = this.data.userInfo
        let name = userInfo['name']
        let phone = userInfo['phone']
        let avatarUrl = userInfo['avatarUrl']
        let nickName = userInfo['nickName']
        // 保存到数据库
        const dbname = "UserList"
        let db = wx.cloud.database()
        db.collection(dbname)
            .add({
                data: {
                    name: name,
                    phone: phone,
                    address: '',
                    avatarUrl: avatarUrl,
                    nickName: nickName,
                    mamager: false
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.errMsg == "collection.add:ok") {
                        wx.showToast({
                            title: '恭喜,注册成功！',
                            icon: 'none',
                            duration: 1000
                        })
                        // 保存成功，更新本地缓存
                        wx.setStorageSync('userInfo', userInfo)
                        // 页面跳转
                        // 跳转到home
                        wx.switchTab({
                            url: '../home/home'
                        })
                    } else {
                        // 提示网络错误
                        wx.showToast({
                            title: '网络错误，注册失败，请检查网络后重试！',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                },
                fail: function (err) {
                    wx.hideLoading()
                }
            })
    },

    // 返回首页
    onClickLeft() {
        wx.switchTab({
            url: '../home/home',
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