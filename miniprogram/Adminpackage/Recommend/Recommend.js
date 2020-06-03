// Adminpackage/Recommend/Recommend.js
const { formatTime } = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 查询到的数据
        HouseList: [],
        // 默认数据总数
        total: 0,
        // 默认查询第一页
        page: 0,
        // 显示列表
        showlist: false,
        // 推荐指数，默认为0
        weight: 0,
        // 显示模态窗
        showModal: false,
        // 默认表单数据
        formdata: {
            'ID': '',
            'Isrecommend': false,
            'updateTime': '',
            'weight': '',
            'recommender': ''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(formatTime(new Date()))
    },

    // 查询数据总数
    DocCount() {
        let that = this
        const db = wx.cloud.database()
        db.collection('Entrust')
            .where({
                publish: true
            })
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
    RcommendList(page) {
        wx.showLoading({
            title: '加载推荐房源...',
            mask: true
        })
        let that = this
        let HouseList = this.data.HouseList
        const db = wx.cloud.database()
        db.collection('Entrust')
            .orderBy('recommendData.weight', 'desc')
            .where({
                publish: true
            })
            .skip(page)
            .limit(10)
            .field({
                _id: true,
                photoInfo: true,
                title: true,
                recommendData: true,
                'FormData.area': true,
                'FormData.roomStyle': true,
                'FormData.houseStyle': true,
                'FormData.location': true
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
    },

    // 显示、关闭权重输入框
    CloseInputBox(e) {
        this.setData({
            showModal: false
        })
    },

    // 修改推荐状态
    DoRecommend(e) {
        let index = e.currentTarget.dataset.index
        let ID = e.currentTarget.dataset.id
        let Isrecommend = e.currentTarget.dataset.isrecommend

        let updateTime = `${Isrecommend ? '' : formatTime(new Date())}`
        let weight = `${Isrecommend ? 0 : this.data.weight}`

        let userInfo = wx.getStorageSync('userInfo')
        let recommender = `${Isrecommend ? '' : userInfo.name}`
        let that = this

        console.log(index, ID, Isrecommend, updateTime, weight, recommender)

        let title = `${Isrecommend ? '撤销推荐提示' : '设置推荐提示'}`
        let content = `${Isrecommend ? '确定撤销该房源的首页推荐吗?' : '确定设置该房源为首页推荐吗?'}`

        let formdata = {
            'ID': ID,
            'Isrecommend': !Isrecommend,
            'updateTime': updateTime,
            'weight': weight,
            'recommender': recommender
        }

        wx.showModal({
            title: title,
            content: content,
            confirmText: '确定',
            confirmColor: '#FA805C',
            cancelText: '取消',
            cancelColor: '#7CCD7D',
            mask: true,
            success(res) {
                console.log(res)

                // 撤销推荐
                if (res.confirm && Isrecommend) {
                    // 恢复初始值
                    let formdata = {
                        'ID': ID,
                        'Isrecommend': false,
                        'updateTime': '',
                        'weight': 0,
                        'recommender': ''
                    }
                    // 显示输入弹窗
                    that.setData({
                        formdata: formdata
                    })
                    // 修改状态
                    that.ChangeRecommend()
                }

                // 添加推荐
                if (res.confirm && !Isrecommend) {
                    // 显示输入弹窗
                    that.setData({
                        formdata: formdata,
                        showModal: true
                    })
                }
                if (res.cancel) {
                    // 关闭输入弹窗
                    that.setData({
                        showModal: false
                    })
                }
            }
        })
    },

    // 输入框
    InputData(e) {
        console.log(e.detail.value)
        let formdata = this.data.formdata
        formdata['weight'] = e.detail.value
        this.setData({
            formdata: formdata
        })
    },

    // 提交
    ConfirmBtn(e) {
        // 检查权重值是否符合要求
        let formdata = this.data.formdata
        if (formdata.weight > 0 && formdata.weight <= 10) {
            // 符合条件，开始推荐
            this.ChangeRecommend()
        } else {
            // 提示不符合
            wx.showToast({
                title: '推荐值错误,推荐指数范围应为:1~10',
                mask: true,
                icon: 'none'
            })
            // 把推荐值回复初始值
            formdata['weight'] = 0
            this.setData({
                formdata: formdata
            })
        }
    },

    // 调用云函数修改状态
    ChangeRecommend() {
        let data = this.data.formdata
        let that = this
        wx.showLoading({
            title: `${data.Isrecommend ? '正在推荐...' : '正在撤销推荐...'}`,
            mask: true
        })
        wx.cloud.callFunction({
            name: 'PublishEntrust',
            data: {
                type: 'recommend',
                ID: data.ID,
                updateTime: data.updateTime,
                weight: data.weight,
                recommender: data.recommender,
                Isrecommend: data.Isrecommend
            },
            success(res) {
                wx.hideLoading()
                console.log(res)
                if (res.errMsg == 'cloud.callFunction:ok') {
                    if (res.result.errMsg == "document.update:ok") {
                        // 提示更新成功
                        wx.showToast({
                            title: `${data.Isrecommend ? '设置首页推荐,成功！' : '设置成功'}`,
                            icon: 'none',
                            mask: true
                        })
                        that.setData({
                            page: 0,
                            HouseList: [],
                            showModal: false
                        })
                        let page = 0
                        that.RcommendList(page)
                    }
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log(err)
                wx.showToast({
                    title: `设置失败`,
                    icon: 'none',
                    mask: true
                })
                that.setData({
                    showModal: false
                })
            }
        })
    },

    // 显示列表
    showList() {
        let page = this.data.page
        this.DocCount()
        this.RcommendList(page)
        this.setData({
            showlist: true
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
        let total = this.data.total
        let page = this.data.page
        let HouseList = this.data.HouseList

        if (HouseList.length < total) {
            page = page + 10
            this.RcommendList(page)
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