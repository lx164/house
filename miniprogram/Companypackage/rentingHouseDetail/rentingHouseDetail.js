// pages/houseDetail/houseDetail.js
const {
    formatTime
} = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        houseImages: ['http://img.faakee.com/uploadfiles/image/201806/1529288205.jpg', 'http://img.faakee.com/uploadfiles/image/201806/1529541945.gif', 'http://img.faakee.com/uploadfiles/image/201806/1529485506.gif', 'http://img.faakee.com/uploadfiles/image/201806/1529388295.jpg'],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        circular: true,
        interval: 1500,
        duration: 500,
        // 房子信息
        // 渲染详细列表
        DetialList: [
            {
                'id': 'area',
                'title': '房子面积(单位:㎡)',
                'value': ''
            },
            {
                'id': 'totalPrice',
                'title': '房租价格(单位:元/月)',
                'value': ''
            },
            {
                'id': 'location',
                'title': '所属小区',
                'value': ''
            },
            {
                'id': 'detailLocation',
                'title': '房源地址',
                'value': ''
            },
            {
                'id': 'HouseType',
                'title': '房子状况',
                'value': ''
            },
            {
                'id': 'houseStyle',
                'title': '房子类型',
                'value': ''
            },
            {
                'id': 'furniture',
                'title': '装修配置',
                'value': ''
            },
            {
                'id': 'Tags',
                'title': '房子优势',
                'value': ''
            },
            {
                'id': 'LookUpStyle',
                'title': '看房方式',
                'value': ''
            },
            {
                'id': 'Invoice',
                'title': '契税发票时间是否满两年',
                'value': ''
            },
            {
                'id': 'Signing',
                'title': '网签是否满三年',
                'value': ''
            },
            {
                'id': 'updateTime',
                'title': '最近发布',
                'value': ''
            }
        ],
        // 是否已收藏，默认为否
        HasCollection: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        console.log(e, formatTime(new Date()))
        let id = e.id
        // id = '01ace4015dfb28cc04d2e10f25885167'
        // 查询房子详细信息
        this.HoseDettail(id)
        this.setData({
            ID: id
        })
        let userInfo = wx.getStorageSync('userInfo')
        let openid = userInfo.openid
        // 检查是否已经收藏
        this.HasCollection(openid, id)
    },

    // 查询详情
    HoseDettail(id) {
        wx.showLoading({
            title: '加载中...'
        })
        let that = this
        const db = wx.cloud.database()
        db.collection('Entrust').where({
            _id: id
        }).field({
            _openid: false,
            EntrustType: false,
            checkedBy: false,
            checkedTime: false,
            publish: false,
            publishTime: false,
            'FormData.name': false,
            'FormData.phonenumber': false
        })
            .get({
                success(res) {
                    console.log('detail-res', res)
                    if (res.errMsg == "collection.get:ok") {
                        if (res.data.length > 0) {
                            let data = res.data[0]
                            that.SetLisDdata(data)
                        } else {
                            wx.showToast({
                                title: '网络错误,请返回重新打开',
                                mask: true,
                                icon: 'none'
                            })
                            wx.navigateBack({
                                delta: -1
                            })
                        }
                    } else {
                        wx.showToast({
                            title: '网络错误,请返回重新打开',
                            mask: true,
                            icon: 'none'
                        })
                        wx.navigateBack({
                            delta: -1
                        })
                    }
                },
                fail(err) {
                    wx.hideLoading()
                    console.log('detail-err', err)
                    wx.showToast({
                        title: '网络错误,请返回重新打开',
                        mask: true,
                        icon: 'none'
                    })
                    wx.navigateBack({
                        delta: -1
                    })
                }
            })
    },

    // 赋值
    SetLisDdata(data) {
        let title = data.title
        let houseImages = data.photoInfo
        let charge = data.charge
        let FormData = data.FormData

        let totalPrice = FormData.totalPrice
        let averagePrice = FormData.averagePrice
        let houseStyle = FormData.houseStyle
        let location = FormData.location
        let Tags = FormData.Tags
        let phone = charge.phone

        let DetialList = this.data.DetialList
        for (let key in FormData) {
            for (let i = 0; i < DetialList.length; i++) {
                if (DetialList[i].id == key) {
                    DetialList[i].value = FormData[key]
                }
                if (DetialList[DetialList.length - 1].id == 'updateTime') {
                    DetialList[DetialList.length - 1].value = data.updateTime
                }
            }
        }
        let displayPhone = phone.replace(phone.substring(3, 7), "****")
        this.setData({
            title: title,
            houseImages: houseImages,
            charge: charge,
            totalPrice: totalPrice,
            averagePrice: averagePrice,
            houseStyle: houseStyle,
            location: location,
            Tags: Tags,
            displayPhone: displayPhone,
            DetialList: DetialList,
        })
        wx.hideLoading()
    },

    // 跳转函数
    NavigateToCalculator: function (e) {
        console.log(e)
        wx.navigateTo({
            url: '../../CalculatorPackage/calculator/calculator',
        })
    },

    // 打电话
    CallPhone(e) {
        console.log(e, e.currentTarget.dataset.phone)
        let phoneNumber = e.currentTarget.dataset.phone
        let displayPhone = this.data.displayPhone
        wx.showModal({
            title: '温馨提示',
            content: `是否拨打${displayPhone}号码？`,
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

    // 检查是否已经收藏
    HasCollection(openid, ID) {
        let that = this
        const db = wx.cloud.database()
        db.collection('Collections')
            .where({
                _openid: openid,
                ID: ID
            })
            .count({
                success(res) {
                    console.log(res)
                    if (res.errMsg == "collection.count:ok") {
                        if (res.total > 0) {
                            // 已收藏
                            that.setData({
                                HasCollection: true
                            })
                        }
                    }
                },
                fail(err) {
                    console.log(err)
                }
            })
    },

    // 收藏信息
    Docollection() {
        let that = this
        // 如果已收藏，终止，防止重复收藏
        if (this.data.HasCollection) {
            wx.showToast({
                title: '已收藏',
                icon: 'none'
            })
            return
        }
        wx.showLoading({
            title:'正在收藏...',
            mask:true
        })
        // 未收藏，开始收藏
        const db = wx.cloud.database()
        db.collection('Collections')
            .add({
                data: {
                    ID: that.data.ID,
                    title: that.data.title,
                    houseStyle: that.data.houseStyle,
                    location: that.data.location,
                    houseImages:that.data.houseImages,
                    type:'rentout',
                    updateTime: formatTime(new Date())
                },
                success(res) {
                    wx.hideLoading()
                    console.log('collection-res', res)
                    if (res.errMsg == "collection.add:ok") {
                        that.setData({
                            HasCollection: true
                        })
                        wx.showToast({
                            title: '收藏成功',
                            icon: 'none'
                        })
                    } else {
                        wx.showToast({
                            title: '收藏失败',
                            icon: 'none'
                        })
                    }
                },
                fail(err) {
                    wx.hideLoading()
                    console.log('collection', err)
                    wx.showToast({
                        title: '收藏失败',
                        icon: 'none'
                    })
                }
            })
    },

    // 预约看房
    Appointment(e) {
        let that = this
        wx.showActionSheet({
            itemList: ['联系经纪人', '联系在线客服'],
            success(res) {
                console.log(res.tapIndex)
                if (res.tapIndex == 0) {
                    // 打电话
                    that.CallPhone(e)
                }
                if (res.tapIndex == 1) {
                    wx.showToast({
                      title: '提示:请直接点击 “个人中心” 页面的客服按钮,即可连通在线客服。',
                      icon:'none',
                      mask:true,
                      duration:2000
                    })
                }
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function (e) {

    },

    // 

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})