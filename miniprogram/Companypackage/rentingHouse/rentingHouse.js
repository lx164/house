// Companypackage/rentingHouse/rentingHouse.js
// pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchkey: '',
        HouseStyleList: [{
            text: '所有户型',
            value: '0'
        }, {
            text: '一居室',
            value: '一居室'
        },
        {
            text: '两居室',
            value: '二居室'
        },
        {
            text: '三居室',
            value: '三居室'
        },
        {
            text: '四居室',
            value: '四居室'
        },
        {
            text: '五居室',
            value: '五居室'
        }
        ],
        HousingPriceList: [{
            text: '所有价格',
            value: { 'min': 0, 'max': 0, 'HousePrice': '所有价格' }
        }, {
            text: '0-1000',
            value: { 'min': 0, 'max': 1000}
        },
        {
            text: '1000-2000',
            value: { 'min': 1000, 'max': 2000 }
        },
        {
            text: '2000-3000',
            value: { 'min': 2000, 'max':3000}
        },
        {
            text: '3000以上',
            value: { 'min': 3000, 'max': 100000}
        }
        ],
        // 户型
        RoomStyle: '0',
        // 价格区间
        RoomPrice: { 'min': 0, 'max': 0 },
        HousePrice: '',
        // 查询到的数据
        HouseList: [],
        // 默认数据总数
        total: 0,
        // 默认查询第一页
        page: 0,
        // 显示数据加载结束
        showEnd: false,
        // 搜索类型,默认为query，即搜索全部
        type: 'query'
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onLoad: function () {
        let page = this.data.page
        let type = this.data.type
        this.DocCount()
        this.QueryHose(page, type)
    },

    // 查询数据总数
    DocCount() {
        let that = this
        const db = wx.cloud.database()
        db.collection('RentingHouse').count({
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

    // 获取房源数据列表
    QueryHose(page, type) {
        wx.showLoading({
            title: '正在加载...',
            mask: true
        })
        let that = this
        let HouseList = this.data.HouseList
        let min = this.data.RoomPrice['min']
        let max = this.data.RoomPrice['max']
        let RoomStyle = this.data.RoomStyle

        console.log('RoomPrice', this.data.RoomPrice['min'],this.data.RoomPrice['max'])

        wx.cloud.callFunction({
            name: 'HouseInfo',
            data: {
                type: type,
                key: 'RentingHouse',
                page: page,
                min: min,
                max: max,
                RoomStyle: RoomStyle
            },
            success: res => {
                wx.hideLoading()
                console.log('myentrust-res', res)
                if (res.errMsg == "cloud.callFunction:ok") {
                    // 显示数据
                    let data = res.result
                    if (data) { data = data.list } else { return }
                    if (data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            HouseList.push(data[i])
                        }
                        that.setData({
                            type: type,
                            page: page,
                            HouseList: HouseList
                        })

                    } else {
                        // 提示没有数据
                        wx.showToast({
                            title: '已经显示所有数据了哦！',
                            icon: 'none',
                            mask: true
                        })
                    }
                } else {
                    // 提示网络错误
                    wx.showToast({
                        title: '查询失败,请返回重新打开',
                        icon: 'none',
                        mask: true
                    })
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log('myentrust-err', err)
                wx.showToast({
                    title: '网络错误,查询失败,请返回重新打开',
                    icon: 'none',
                    mask: true
                })
            }
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function (e) {
        console.log(e, '666')
        wx.showNavigationBarLoading()
        // 初始化数据
        this.setData({
            total: 0,
            page: 0,
            HouseList: []
        })
        // 重新获取数据
        let page = 0
        this.DocCount()
        let type = this.data.type
        this.QueryHose(page, type)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let total = this.data.total
        let page = this.data.page
        let HouseList = this.data.HouseList
        let type = this.data.type
        if (HouseList.length < total) {
            page = page + 10
            this.QueryHose(page, type)
        } else {
            this.setData({
                showEnd: true
            })
        }
    },

    // 跳转函数
    Navigate: function (e) {
        console.log(e, e.currentTarget.dataset.url)
        let url = '../rentingHouseDetail/rentingHouseDetail'
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `${url}?id=${id}`,
        })
    },

    // 户型改变
    ChangeHouseStyle(e) {
        console.log(e, e.detail)
        let key = e.detail
        let page = 0
        if (key == '0') {
            var type = 'query'
        } else {
            var type = 'housetype'
        }
        this.setData({
            RoomStyle: key,
            HouseList: []
        })
        this.QueryHose(page, type)
    },

    // 价格改变
    ChangeHousingPrice(e) {
        console.log(e, e.detail, typeof (e.detail))
        let key = e.detail
        let page = 0
        if (key['min'] == 0 && key['max'] == 0) {
            var type = 'query'
        } else {
            var type = 'houseprice'
        }
        this.setData({
            RoomPrice: key,
            HouseList: []
        })
        this.QueryHose(page, type)
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})