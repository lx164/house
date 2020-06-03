// Adminpackage/EntrustDetail/EntrustDetail.js
const {
    formatTime
} = require("../../utils/util.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 渲染详细列表
        DetialList: [{
            'id': 'name',
            'title': '委托人',
            'value': ''
        },
        {
            'id': 'phonenumber',
            'title': '委托人联系电话',
            'value': ''
        },
        {
            'id': 'area',
            'title': '产权面积(单位:㎡)',
            'value': ''
        },
        {
            'id': 'totalPrice',
            'title': '外标价位',
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
        }
        ],

        // 状态
        StatusList: {
            'EntrustType': '',
            'updateTime': '',
            'checkedBy': '',
            'checkedTime': '',
            'publish': '',
            'publishTime': ''
        },
        showButton: false,
        preview: false,
        photoInfo: [],
        // 步骤
        step: 1,
        // 搜索标题
        title: '',
        // 负责人
        charge: {
            'name': '',
            'phone': ''
        },
        itemList: ['新房', '二手房', '租房'],
        // 发布的板块
        publishPlateList: ['NewHouse', 'SecondHouse', 'RentingHouse'],
        publishPlate: '',
        plate: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        console.log(e, formatTime(new Date()))
        let id = e.id
        // id = 'b040a67a5dfb2a4304d36b315da2038a'
        this.EntrustDetail(id)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (e) {
    },

    // 查询详细信息
    EntrustDetail(id) {
        console.log(id)
        wx.showLoading({
            title: '查询中...',
            mask: true
        })
        let that = this
        wx.cloud.callFunction({
            name: 'Entrust',
            data: {
                type: 'EntrustDetail',
                id: id
            },
            success: res => {
                console.log('myentrust-res', res)
                if (res.errMsg == "cloud.callFunction:ok") {
                    let data = res.result.data
                    if (data.length > 0) {
                        that.SetLisDdata(data[0])
                    } else {
                        // 提示没有数据
                        wx.hideLoading()
                        wx.showToast({
                            title: '查询失败,请返回重新打开',
                            icon: 'none',
                            mask: true
                        })
                    }
                } else {
                    // 提示网络错误
                    wx.hideLoading()
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

    // 赋值
    SetLisDdata(data) {
        console.log(data)
        let FormData = data.FormData
        let DetialList = this.data.DetialList
        let StatusList = this.data.StatusList
        for (let key in FormData) {
            for (let i = 0; i < DetialList.length; i++) {
                if (DetialList[i].id == key) {
                    // 如果是标价，则根据市买房还是出租显示不同的单位
                    if (key == 'totalPrice') {
                        let title = data.EntrustType == 'sale' ? '外标价位(单位：万元)' : '外标价位(单位：元/月)'
                        DetialList[i].title = title
                    }
                    DetialList[i].value = FormData[key]
                }
            }
        }
        StatusList['EntrustType'] = data.EntrustType
        StatusList['updateTime'] = data.updateTime
        StatusList['checkedBy'] = data.checkedBy
        StatusList['checkedTime'] = data.checkedTime
        StatusList['publish'] = data.publish
        StatusList['publishTime'] = data.publishTime

        var name = data.charge['name']
        var phone = data.charge['phone']
        var displayPhone = phone.replace(phone.substring(3, 7), "****")

        if (name == '' && phone == '') {
            var userInfo = wx.getStorageSync('userInfo')
            name = userInfo.name
            phone = userInfo.phone
            displayPhone = phone.replace(phone.substring(3, 7), "****")
        }

        var charge = this.data.charge
        charge['name'] = name
        charge['phone'] = phone

        this.setData({
            _id: data._id,
            DetialList: DetialList,
            StatusList: StatusList,
            photoInfo: data.photoInfo,
            FormData: FormData,
            showButton: true,
            title: data.title,
            charge: charge,
            displayPhone: displayPhone
        })
        wx.hideLoading()
    },

    // 下一步
    nextStep() {
        this.setData({
            step: this.data.step + 1
        })
    },

    // 预览
    Preview() {
        this.setData({
            preview: !this.data.preview
        })
    },

    // 获取输入框数据
    InputData: function (e) {
        // console.log(e, e.currentTarget.id, e.detail.value)
        let id = e.currentTarget.id
        let value = e.detail.value
        if (id == 'title') {
            this.setData({
                title: value
            })
        }
        if (id == 'name') {
            let charge = this.data.charge
            charge['name'] = value
            this.setData({
                charge: charge
            })
        }
        if (id == 'phone') {
            let charge = this.data.charge
            charge['phone'] = value
            let displayPhone = ''
            if (value.length == 11) {
                displayPhone = value.replace(value.substring(3, 7), "****")
            }
            this.setData({
                charge: charge,
                displayPhone: displayPhone
            })
        }

    },

    // 板块选择
    SelectPlate() {
        let that = this
        // 选择发布到哪个模块
        wx.showActionSheet({
            itemList: that.data.itemList,
            mask: true,
            success(res) {
                console.log(res.tapIndex)
                // 发布模块
                that.setData({
                    plate: that.data.itemList[res.tapIndex],
                    publishPlate: that.data.publishPlateList[res.tapIndex]
                })
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },

    // 发布按钮
    DoPublishing() {
        let that = this
        wx.showModal({
            title: '发布确认提示',
            content: `确定将该房源信息发布到${that.data.plate}板块吗?`,
            success(res) {
                if (res.confirm) {
                    // 发布
                    that.SubmitData()
                }
            }
        })
    },

    // 添加数据
    SubmitData() {
        wx.showLoading({
            title: '正在发布...',
            mask: true
        })
        let that = this
        let userInfo = wx.getStorageSync('userInfo')
        let checkedBy = userInfo.name
        let title = this.data.title
        let ID = this.data._id
        let publishPlate = this.data.publishPlate
        let plate = this.data.plate
        let charge = this.data.charge

        console.log(checkedBy)

        wx.cloud.callFunction({
            name: 'PublishEntrust',
            data: {
                type: 'add',
                plate: plate,
                publishPlate: publishPlate,
                checkedBy: checkedBy,
                title: title,
                ID: ID,
                charge: charge,
                checkedTime: formatTime(new Date()),
                publishTime: formatTime(new Date()),
                updateTime: formatTime(new Date())
            },
            success: res => {
                wx.hideLoading()
                console.log(res)
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 2000
                })
                // 页面跳转到成功页面
                wx.redirectTo({
                    url: '../managerEntrust/managerEntrust'
                })
            },
            fail: err => {
                wx.hideLoading()
                console.log(err)
                wx.showToast({
                    title: '发布失败',
                    icon: 'success',
                    duration: 2000
                })
            },
            complete: res => {
                console.log(res)
            }
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