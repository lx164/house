// pages/entrust/entrust.js
const {
    formatTime
} = require("../../utils/util.js")


Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 导航栏标题
        NavigationBarTitle: '发布委托',
        // 渲染输入框
        InputList: [{
            'id': 'detailLocation',
            'title': '房源地址:',
            'placeholder': '请填写房源详细地址',
            'type': 'text',
            'maxlength': 50
        },
        {
            'id': 'location',
            'title': '所属小区:',
            'placeholder': '如:莲湖区 梨园路',
            'type': 'text',
            'maxlength': 50
        },
        {
            'id': 'furniture',
            'title': '装修配置:',
            'placeholder': '如:有空调、有热水等',
            'type': 'text',
            'maxlength': 50
        },
        {
            'id': 'area',
            'title': '房子面积(单位:㎡):',
            'placeholder': '请填写房子的产权面积',
            'type': 'digit',
            'maxlength': 20
        },
        {
            'id': 'totalPrice',
            'title': '房租价格(单位:元/月):',
            'placeholder': '请填写房租价格',
            'type': 'digit',
            'maxlength': 20
        },
        {
            'id': 'name',
            'title': '您的称呼:',
            'placeholder': '请问如何称呼您',
            'type': 'text',
            'maxlength': 8
        },
        {
            'id': 'phonenumber',
            'title': '联系电话:',
            'placeholder': '请输入您的联系电话',
            'type': 'number',
            'maxlength': 11
        }
        ],

        // 渲染选择器
        PickerList: [{
            'id': 'HouseType',
            'title': '房子类型',
            'pickerlist': ['新房子', '二手房', '其他']
        }, {
            'id': 'LookUpStyle',
            'title': '看房方式',
            'pickerlist': ['随时看房', '电话预约', '其他']
        }, {
            'id': 'Invoice',
            'title': '契税发票时间是否满两年',
            'pickerlist': ["是", "否"]
        }, {
            'id': 'Signing',
            'title': '网签是否满三年',
            'pickerlist': ["是", "否"]
        }],

        // 房型选择列表
        HouseStyleList: [
            ['0室', '1室', '2室', '3室', '4室', '5室'],
            ['0厅', '1厅', '2厅', '3厅'],
            ['0卫', '1卫', '2卫', '3卫']
        ],
        // 房型选择结果
        HouseStyleSelected: [0, 0, 0],
        // 委托类型
        EntrustType: '',
        // 表单数据
        FormData: {
            // 详细地址
            'detailLocation': '',
            // 所在小区
            'location': '',
            //装修配置
            'furniture': '',
            // 房子面积
            'area': '',
            // 总价
            'totalPrice': '',
            // 均价
            'averagePrice': '',
            // 委托人姓名
            'name': '',
            // 委托人电话
            'phonenumber': '',
            // 房子标签
            'Tags': [],
            // 房子类型，新房，旧房
            'HouseType': '',
            // 房间类型，如：一室一厅
            'roomStyle': '',
            // 居室类型，如：一居室
            'houseStyle': '',
            // 看房方式
            'LookUpStyle': '',
            // 契税发票时间是否满两年
            'Invoice': '',
            // 网签是否满三年
            'Signing': ''
        },
        // 照片列表
        imgList: [],
        modalName: null,
        // 标签选择
        checkbox: [{
            value: 0,
            name: '近学校',
            checked: false
        }, {
            value: 1,
            name: '近地铁',
            checked: false
        }, {
            value: 2,
            name: '房子新',
            checked: false
        }, {
            value: 3,
            name: '有阳台',
            checked: false
        }, {
            value: 4,
            name: '独立厨房',
            checked: false
        }, {
            value: 5,
            name: '租房保障',
            checked: false
        }, {
            value: 6,
            name: '月租',
            checked: false
        },{
            value: 7,
            name: '整租',
            checked: false
        },{
            value: 8,
            name: '合租',
            checked: false
        }, {
            value: 9,
            name: '拎包入住',
            checked: false
        }, {
            value: 10,
            name: '随时看房',
            checked: false
        }, {
            value: 11,
            name: '押一付一',
            checked: false
        }, {
            value: 12,
            name: '交通便利',
            checked: false
        }],
        // 标签的显示
        displayTags: '',
        // 临时变量
        templeCheckbox: [],
        templeTags: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        console.log('eeeee', e, e.title)
        // 修改导航栏标题
        wx.setNavigationBarTitle({
            title: e.title
        })
        // 修改导航栏样式
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: e.backgroundcolor,
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        })
        this.setData({
            NavigationBarTitle: e.title,
            EntrustType: e.id
        })
    },

    // 获取输入框数据
    InputData: function (e) {
        console.log(e, e.currentTarget.id, e.detail.value)
        let FormData = this.data.FormData
        let id = e.currentTarget.id
        let value = e.detail.value
        FormData[id] = value
        this.setData({
            FormData
        })
    },

    // 获取单列选择器数据
    PickerData(e) {
        console.log(e, e.currentTarget.id, e.detail.value)
        let FormData = this.data.FormData
        let id = e.currentTarget.id
        let value = e.detail.value
        let list = e.currentTarget.dataset.pickerlist
        FormData[id] = list[value]
        this.setData({
            FormData
        })
    },

    // 房型选择
    HouseStyleChange(e) {
        let HouseStyleList = this.data.HouseStyleList
        let FormData = this.data.FormData
        console.log(e, e.detail.value)
        let value = e.detail.value
        let room = value[0]
        let hall = value[1]
        let toilet = value[2]

        console.log(room, typeof (room), hall, toilet)

        if (room == 0) {
            room = ''
        } else {
            room = HouseStyleList[0][room]
        }
        if (hall == 0) {
            hall = ''
        } else {
            hall = HouseStyleList[1][hall]
        }
        if (toilet == 0) {
            toilet = ''
        } else {
            toilet = HouseStyleList[2][toilet]
        }

        let houseStyle = `${room}${hall}${toilet}`

        let roomStyle = ''

        switch (e.detail.value[0]) {
            case 1:
                roomStyle = '一居室';
                break;
            case 2:
                roomStyle = '二居室';
                break;
            case 3:
                roomStyle = '三居室';
                break;
            case 4:
                roomStyle = '四居室';
                break;
            case 5:
                roomStyle = '五居室';
                break;
            default:
                roomStyle = '无'
        }

        FormData.roomStyle = roomStyle
        FormData.houseStyle = houseStyle

        this.setData({
            HouseStyleSelected: value,
            FormData
        })
    },

    // 选择照片
    ChooseImage() {
        wx.chooseImage({
            count: 4, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (res) => {
                if (this.data.imgList.length != 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        imgList: res.tempFilePaths
                    })
                }
            }
        });
    },

    // 预览照片
    ViewImage(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },

    // 删除照片
    DelImg(e) {
        wx.showModal({
            title: '提示',
            content: '确定要删除这张照片吗？',
            cancelText: '取消',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })
    },

    // 显示弹窗
    showModal(e) {
        console.log('0.showModal')
        let templeCheckbox = this.data.checkbox
        this.setData({
            templeCheckbox: templeCheckbox,
            modalName: e.currentTarget.dataset.target
        })
    },

    // 关闭弹窗
    hideModal(e) {
        // console.log('1.hideModal')
        // // let templeCheckbox = this.data.templeCheckbox
        // let Tags = this.data.Tags
        // let checkbox = this.data.checkbox
        // // 数据恢复到选择前的状态
        // this.setData({
        //     templeCheckbox: checkbox,
        //     templeTags: Tags,
        //     modalName: null
        // })
    },

    // 点击确认后保存显示confirm
    Confirm(e) {
        console.log('2.Confirm')
        let templeTags = this.data.templeTags
        let templeCheckbox = this.data.templeCheckbox
        let FormData = this.data.FormData
        FormData.Tags = templeTags
        this.setData({
            FormData: FormData,
            checkbox: templeCheckbox,
            displayTags: templeTags.join(','),
            modalName: null
        })
    },

    // 选择弹窗
    ChooseCheckbox(e) {
        console.log('3.ChooseCheckbox')
        let strArray = []
        let templeTags = this.data.templeTags
        let templeCheckbox = this.data.templeCheckbox

        console.log('templeCheckbox', templeCheckbox[0].checked)

        let values = e.currentTarget.dataset.value
        let name = e.currentTarget.dataset.name

        console.log('values', values, 'name', name, templeTags.includes(name))

        // 只能选4个标签
        if (templeTags.length < 4) {
            // 修改checkbox的显示
            for (let i = 0; i < templeCheckbox.length; i++) {
                if (templeCheckbox[i].value == values) {
                    templeCheckbox[i].checked = !templeCheckbox[i].checked;
                    break;
                }
            }
        } else if (templeTags.length >= 4) {
            // 超过四个标签后，只能取消，不能继续选
            if (templeTags.includes(name)) {
                // 修改checkbox的显示
                for (let i = 0; i < templeCheckbox.length; i++) {
                    if (templeCheckbox[i].value == values) {
                        templeCheckbox[i].checked = !templeCheckbox[i].checked;
                        break;
                    }
                }
            } else {
                wx.showToast({
                    title: '最多只能选4个',
                    icon: 'none'
                })
            }
        }

        // 实时显示
        for (let i = 0; i < templeCheckbox.length; i++) {
            if (templeCheckbox[i].checked) {
                strArray.push(templeCheckbox[i].name)
            }
        }

        console.log(strArray, templeCheckbox)

        // 存在临时的变量，点击确认后再保存显示
        this.setData({
            templeTags: strArray,
            templeCheckbox: templeCheckbox
        })

    },

    // Tab切换
    ChangeTab(e) {
        wx.showToast({
            title: `切换为 ${e.detail.name}`,
            icon: 'none'
        });
    },

    // 提交信息前进行数据校验
    Submit(e) {
        let ImgList = this.data.imgList
        let FormData = this.data.FormData
        let InputList = this.data.InputList
        // 计算平均价格
        let averagePrice = (FormData['totalPrice'] / FormData['area']).toFixed(2)
        console.log('averagePrice', averagePrice)
        FormData['averagePrice'] = averagePrice
        // 表单数据的校验
        for (let key in FormData) {
            if (FormData[key] == '') {
                wx.showToast({
                    title: '请把所有数据填写完整',
                    icon: 'none',
                    mask: true,
                    duration: 2000
                })
                return;
            }
        }

        console.log(ImgList.length)

        // 图片的校验
        // 图片为空时报错
        if (ImgList.length == 0) {
            wx.hideLoading()
            wx.showToast({
                title: '图片不能为空,最少需要一张',
                icon: 'none',
                mask: true,
                duration: 2000
            })
            return;
        }
        // 图片超过四张保错
        if (ImgList.length > 4) {
            wx.hideLoading()
            wx.showToast({
                title: '图片不能超过四张',
                icon: 'none',
                mask: true,
                duration: 2000
            })
            return;
        }

        this.setData({
            FormData: FormData
        })

        // 上传图片
        this.UploadImages()
    },


    // 上传图片
    UploadImages() {
        wx.showLoading({
            title: '保存图片...',
            mask: true
        })
        let that = this
        let imgPathList = []
        // 保存照片
        for (let i = 0; i < that.data.imgList.length; i++) {
            const fileName = that.data.imgList[i];
            const dotPosition = fileName.lastIndexOf('.');
            const extension = fileName.slice(dotPosition);
            const cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${extension}`;
            wx.cloud.uploadFile({
                cloudPath,
                filePath: fileName,
                success(res) {
                    wx.hideLoading()
                    console.log('imgs', res, imgPathList.length, that.data.imgList.length)
                    imgPathList.push(res.fileID)
                    if (imgPathList.length == that.data.imgList.length) {
                        // 保存信息
                        that.SubmitEntrust(imgPathList)
                    }
                },
                fail: err => {
                    wx.hideLoading()
                    wx.showToast({
                        title: '图片保存失败',
                        icon: "none",
                        duration: 1500
                    })
                },
                complete: res => { }
            })
        }
    },

    // 提交信息
    SubmitEntrust(photoInfo) {
        wx.showLoading({
            title: '提交委托...',
            mask: true
        })
        let FormData = this.data.FormData
        let EntrustType = this.data.EntrustType
        let that = this
        wx.cloud.callFunction({
            name: 'Entrust',
            data: {
                type: 'add',
                EntrustType: EntrustType,
                FormData: FormData,
                photoInfo: photoInfo,
                updateTime: formatTime(new Date())
            },
            success: res => {
                wx.hideLoading()
                console.log(res)
                wx.showToast({
                    title: '委托提交成功',
                    icon: 'success',
                    duration: 2000
                })
                // 页面跳转到成功页面
                wx.redirectTo({
                    url: '../steps/steps?id=entrust',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                })
            },
            fail: err => {
                wx.hideLoading()
                console.log(err)
                wx.showToast({
                    title: '委托提交失败',
                    icon: 'success',
                    duration: 2000
                })
                // 把已经上传的图片删除
                wx.cloud.deleteFile({
                    fileList: photoInfo,
                    success: res => {
                        // handle success
                        console.log('delimages', res.fileList)
                    },
                    fail: console.error
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