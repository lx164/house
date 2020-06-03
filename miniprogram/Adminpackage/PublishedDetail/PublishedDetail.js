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
        name: '',
        phone: '',
        itemList: ['新房', '二手房', '租房'],
        // 发布的板块
        publishPlateList: ['NewHouse', 'SecondHouse', 'RentingHouse'],
        publishPlate: ''
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

        let name = data.charge['name']
        let phone = data.charge['phone']
        let displayPhone = phone.replace(phone.substring(3, 7), "****")

        if (name == '' && phone == '') {
            let userInfo = wx.getStorageSync('userInfo')
            name = userInfo.name
            phone = userInfo.phone
            displayPhone = phone.replace(phone.substring(3, 7), "****")
        }
        this.setData({
            _id: data._id,
            DetialList: DetialList,
            StatusList: StatusList,
            photoInfo: data.photoInfo,
            FormData: FormData,
            showButton: true,
            title: data.title,
            name: name,
            phone: phone,
            charge: data.charge,
            publishPlate: data.publishPlate,
            plate: data.plate,
            recommendData: data.recommendData,
            displayPhone: displayPhone
        })
        wx.hideLoading()
    },

    // 修改已经审核发布的
    ChangePublish(e) {
        console.log(e)
        let that = this
        // 进行确认提示
        wx.showModal({
            title: '修改提示',
            content: '修改房源信息将会把已经发布和推荐到首页的房源撤下来,需要重新审核发布才能使客户搜索到,是否确定进行修改?',
            confirmText: '确定修改',
            cancelText: '取消',
            mask: true,
            success(res) {
                if (res.confirm) {
                    that.DoChange()
                }
            }
        })
    },

    // 调用云函数进行操作
    DoChange() {
        wx.showLoading({
            title: '正在撤销发布...',
            mask: true
        })
        let id = this.data._id
        let publishPlate = this.data.publishPlate
        console.log(publishPlate)
        // 撤销发布
        wx.cloud.callFunction({
            name: 'PublishEntrust',
            data: {
                type: 'changeEntrust',
                ID: id,
                publishPlate: publishPlate
            },
            success: res => {
                console.log('changeEntrust-res', res)
                if (res.errMsg == "cloud.callFunction:ok") {
                    wx.hideLoading()
                    // 跳转到审核页面
                    if (res.result.errMsg == 'collection.update:ok' && res.result.stats.updated > 0) {
                        // 进行确认提示
                        wx.showModal({
                            title: '提示',
                            content: '成功把该已审核发布的房源撤下来,是否马上对该房源的信息进行修改?',
                            confirmText: '马上修改',
                            cancelText: '取消',
                            mask: true,
                            success(res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: `../../Adminpackage/EntrustDetail/EntrustDetail?id=${id}`,
                                    })
                                } else {
                                    // 返回委托列表
                                    wx.navigateBack({
                                        delta: -1
                                    })
                                    // wx.navigateTo({
                                    //     url: `../../Adminpackage/managerEntrust/managerEntrust`,
                                    // })
                                }
                            }
                        })
                    }
                } else {
                    // 提示网络错误
                    wx.hideLoading()
                    wx.showToast({
                        title: '撤销失败',
                        icon: 'none',
                        mask: true
                    })
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log('changeEntrust-err', err)
                wx.showToast({
                    title: '网络错误,撤销房源失败,请返回重新打开',
                    icon: 'none',
                    mask: true
                })
            }
        })
    },

    // 删除确认提示
    DeleteHouse() {
        let that = this
        // 进行确认提示
        wx.showModal({
            title: '删除提示',
            content: '房源信息一旦删除,与之有关的所有信息都会被删除,并且不能恢复,是否确定继续删除?',
            confirmText: '确定删除',
            confirmColor: '#ff0080',
            cancelText: '取消',
            mask: true,
            success(res) {
                if (res.confirm) {
                    // 删除照片
                    that.DeleteImages()
                }
            }
        })
    },

    // 删除照片
    DeleteImages() {
        wx.showLoading({
            title: '删除关联照片...',
            mask: true
        })
        let images = this.data.photoInfo
        let that = this
        wx.cloud.deleteFile({
            fileList: images,
            success: res => {
                wx.hideLoading()
                console.log(res)
                // 图片删除成功
                if (res.errMsg == "cloud.deleteFile:ok") {
                    // 删除该房源
                    that.DoDeleteHouse()
                } else {
                    wx.showToast({
                        title: '图片删除失败,房源删除失败',
                        mask: true,
                        icon: 'none'
                    })
                }
            },
            fail: err => {
                wx.hideLoading()
                // handle error
                wx.showToast({
                    title: '图片删除失败,房源删除失败',
                    mask: true,
                    icon: 'none'
                })
            }
        })
    },

    // 删除该房源
    DoDeleteHouse() {
        let that = this
        let id = this.data._id
        let publishPlate = this.data.publishPlate
        // 删除信息
        wx.showLoading({
            title: '删除房源...',
            mask: true
        })
        // 撤销发布
        wx.cloud.callFunction({
            name: 'PublishEntrust',
            data: {
                type: 'deleteEntrust',
                ID: id,
                publishPlate: publishPlate
            },
            success: res => {
                wx.hideLoading()
                console.log('changeEntrust-res', res)
                if (res.errMsg == "cloud.callFunction:ok") {
                    if (res.result.stats.removed > 0 && res.result.errMsg == 'collection.remove:ok') {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'none',
                            mask: true
                        })
                        // 跳转回去
                        wx.navigateBack({
                            delta: -1
                        })
                        // wx.navigateTo({
                        //   url: '../managerEntrust/managerEntrust',
                        // })
                    } else {
                        // 提示网络错误
                        wx.showToast({
                            title: '删除失败',
                            icon: 'none',
                            mask: true
                        })
                    }
                } else {
                    // 提示网络错误
                    wx.showToast({
                        title: '删除失败',
                        icon: 'none',
                        mask: true
                    })
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log('changeEntrust-err', err)
                wx.showToast({
                    title: '网络错误,查询失败,请返回重新打开',
                    icon: 'none',
                    mask: true
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