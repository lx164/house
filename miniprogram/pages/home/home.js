// pages/home/home.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerList: [
            {
                "id": "#",
                "icon": "../image/calculate-home.png",
                "text": "房贷计算",
                "url": "../../CalculatorPackage/calculator/calculator"
            },
            {
                "id": "#",
                "icon": "../image/qualifications.png",
                "text": "公司资质",
                "url": "../../Companypackage/qualification/qualification"
            },
            {
                "id": "#",
                "icon": "../image/relation.png",
                "text": "联系员工",
                "url": "../../Companypackage/Contact/Contact"
            }
        ],
        // 查询到的数据
        HouseList: [],
        // 默认数据总数
        total: 0,
        // 默认查询第一页
        page: 0,
        // 默认公告信息
        notice:'欢迎使用 邦房-团结南路店 这里有大量的好房源等您来挑选~ 同时也欢迎发布你的房源信息到这里来~'
    },

    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('onload')
        // 删除本地缓存
        wx.removeStorageSync('userInfo')
        // 获取个人信息，如果不存在，则跳转到认证页面
        this.IsAuthor()
        this.CompanyInfo()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // app.IsLogon()
        console.log(app.globalData)
        // 全局变量
        let globalData = app.globalData
        this.setData({
            total: 0,
            page: 0,
            HouseList: [],
            UserLogin: globalData.UserLogin,
            userInfo: globalData.userInfo
        })
        if (globalData.UserLogin) {
            // 获取推荐列表的数据
            this.DocCount()
        }
    },

    /**
    * 检查授权情况
    */
    IsAuthor: function () {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        var that = this
        wx.getSetting({
            success(res) {
                console.log(res)
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            // console.log(res)
                            var userInfo = res.userInfo
                            var nickName = userInfo.nickName
                            var avatarUrl = userInfo.avatarUrl
                            var gender = userInfo.gender //性别 0：未知、1：男、2：女
                            var province = userInfo.province
                            var city = userInfo.city
                            var country = userInfo.country
                            var userInfo = {
                                'nickName': nickName,
                                'avatarUrl': avatarUrl,
                                'gender': gender,
                                'province': province,
                                'city': city,
                                'country': country
                            }
                            // 获取数据库的用户信息
                            that.InitInfo(userInfo)
                        }
                    })
                } else {
                    // 未授权，跳转到授权页面
                    wx.redirectTo({
                        url: '../login/login?id=auth'
                    })
                }
            },
            fail: function (err) {
                wx.hideLoading()
            }
        })
    },

    // 获取个人信息
    InitInfo(userInfo) {
        wx.showLoading({
            title: '正在登录...',
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
                    // 修改库变量
                    app.globalData = {
                        userInfo: userInfo,
                        UserLogin: true
                    }
                    // 修改登录状态
                    that.setData({
                        userInfo: userInfo,
                        UserLogin: true
                    })
                    // 缓存到本地
                    wx.setStorageSync('userInfo', userInfo)
                    console.log('appdata', app.globalData)
                } else {
                    // 未注册，页面跳转到授权注册页面
                    wx.redirectTo({
                        url: '../login/login?id=register'
                    })
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log('err', err)
                wx.showToast({
                    title: '网络错误，登录失败...',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: res => {
                console.log('complete', res)
            }
        })
    },

    // 跳转函数
    Navigate: function (e) {
        console.log(e, e.currentTarget.dataset.id)
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
                title: '你还未登录，请先到个人中心登录！',
                icon: 'none',
                duration: 2500,
                mask: true,
            })
        }
    },

    // 跳到详情页函数
    NavigateToDetail: function (e) {
        console.log(e, e.currentTarget.dataset.id)
        let url = '../../Companypackage/houseDetail/houseDetail'
        let id = e.currentTarget.dataset.id
        let UserLogin = this.data.UserLogin
        if (UserLogin) {
            wx.navigateTo({
                url: `${url}?id=${id}`,
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

    // 获取公告数据
    CompanyInfo() {
        let that = this
        const db = wx.cloud.database()
        db.collection('CompanyInfo')
            .field({
                notice: true
            })
            .get({
                success(res) {
                    wx.hideLoading()
                    console.log('CompanyInfo-res', res,that.data.notice==res.data[0].notice)
                    if (res.errMsg == "collection.get:ok") {
                        if (res.data.length) {
                            if (that.data.notice != res.data[0].notice) {
                                that.setData({
                                    notice: res.data[0].notice
                                })
                            }
                        }
                    }
                },
                fail: err => {
                    wx.hideLoading()
                    console.log('Recommend-err', err)
                }
            })
    },

    // 查询数据总数
    DocCount() {
        let that = this
        const db = wx.cloud.database()
        db.collection('Entrust')
            .where({
                publish: true,
                'recommendData.Isrecommend': true
            })
            .count({
                success(res) {
                    console.log('count-res', res)
                    if (res.errMsg == "collection.count:ok") {
                        that.setData({
                            total: res.total
                        })
                        let page = that.data.page
                        that.QueryHose(page)
                    } else { }
                },
                fail(err) {
                    wx.hideLoading()
                    console.log('detail-err', err)
                }
            })
    },

    // 获取房源数据列表
    QueryHose(page) {
        // 如果没有设置推荐，则显示所有数据
        let Isrecommend = true
        if (this.data.total == 0) {
            Isrecommend = false
        }
        console.log(Isrecommend)

        wx.showLoading({
            title: '加载新的房源...',
            mask: true
        })
        let that = this
        let HouseList = this.data.HouseList

        const db = wx.cloud.database()
        db.collection('Entrust')
            .orderBy('recommendData.weight', 'desc')
            .where({
                publish: true,
                'recommendData.Isrecommend': Isrecommend
            })
            .skip(page)
            .limit(10)
            .field({
                _id: true,
                photoInfo: true,
                title: true,
                EntrustType: true,
                'FormData.area': true,
                'FormData.Tags': true,
                'FormData.roomStyle': true,
                'FormData.location': true,
                'FormData.totalPrice': true,
                'FormData.averagePrice': true
            })
            .get({
                success(res) {
                    wx.hideLoading()
                    console.log('Recommend-res', res)
                    if (res.errMsg == "collection.get:ok") {
                        let data = res.data
                        if (data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                HouseList.push(data[i])
                            }
                            that.setData({
                                page: page,
                                HouseList: HouseList
                            })
                        }
                    }
                },
                fail: err => {
                    wx.hideLoading()
                    console.log('Recommend-err', err)
                }
            })


        // wx.cloud.callFunction({
        //     name: 'HouseInfo',
        //     data: {
        //         type: 'query',
        //         key: 'Recommend',
        //         page: page
        //     },
        //     success: res => {
        //         wx.hideLoading()
        //         console.log('Recommend-res', res)
        //         if (res.errMsg == "cloud.callFunction:ok") {
        //             let data = res.result.list
        //             if (data.length > 0) {
        //                 for (let i = 0; i < data.length; i++) {
        //                     HouseList.push(data[i])
        //                 }
        //                 that.setData({
        //                     page: page,
        //                     HouseList: HouseList
        //                 })
        //             } else {
        //                 // 提示没有数据
        //                 // wx.showToast({
        //                 //     title: '已经显示所有数据了哦！',
        //                 //     icon: 'none',
        //                 //     mask: true
        //                 // })
        //             }
        //         } else {
        //             // 提示网络错误
        //             // wx.showToast({
        //             //     title: '查询失败,请返回重新打开',
        //             //     icon: 'none',
        //             //     mask: true
        //             // })
        //         }
        //     },
        //     fail: err => {
        //         wx.hideLoading()
        //         console.log('myentrust-err', err)
        //         // wx.showToast({
        //         //     title: '网络错误,查询失败,请返回重新打开',
        //         //     icon: 'none',
        //         //     mask: true
        //         // })
        //     }
        // })
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
    onReachBottom: function (e) {
        let total = this.data.total
        let page = this.data.page
        let HouseList = this.data.HouseList

        if (HouseList.length < total) {
            page = page + 10
            this.QueryHose(page)
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