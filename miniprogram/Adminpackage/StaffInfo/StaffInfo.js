// Adminpackage/StaffInfo/StaffInfo.js
const { formatTime } = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 显示列表
        showlist: false,
        // 显示输入框
        showinput: false,
        // 输入框标题
        inputTitle: '添加新的员工信息',
        // 确认按钮文字
        confirmTxt: '确定添加',
        // 输入框类型
        type: '',
        // 输入框初始数据
        id: '',
        inputName: '',
        inputPhone: '',
        // 用户列表
        UserList: [],
        // 默认数据总数
        total: 0,
        // 默认查询第一页
        page: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        let page = this.data.page
        this.DocCount()
        this.StaffList(page)
    },

    // 查询数据总数
    DocCount() {
        let that = this
        const db = wx.cloud.database()
        db.collection('ContactList')
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
    StaffList(page) {
        wx.showLoading({
            title: '加载员工信息...',
            mask: true
        })
        let that = this
        let UserList = this.data.UserList
        const db = wx.cloud.database()
        db.collection('ContactList')
            .orderBy('updatetime', 'desc')
            .skip(page)
            .limit(10)
            .get({
                success(res) {
                    wx.hideLoading()
                    console.log('Recommend-res', res)
                    if (res.errMsg == "collection.get:ok") {
                        let data = res.data
                        if (data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                UserList.push(data[i])
                            }
                            that.setData({
                                page: page,
                                UserList: UserList
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

    // 长按
    EditInfo(e) {
        console.log(e)
        let that = this
        let id = e.currentTarget.dataset.id
        let name = e.currentTarget.dataset.name
        let phone = e.currentTarget.dataset.phone
        wx.showToast({
            title: '编辑模式',
            icon: 'none'
        })
        wx.showActionSheet({
            itemList: ['修改', '删除'],
            success(res) {
                console.log(res.tapIndex)
                if (res.tapIndex === 0) {
                    //   显示修改弹窗
                    that.setData({
                        id: id,
                        inputName: name,
                        inputPhone: phone,
                        type: 'edit',
                        inputTitle: '修改员工信息',
                        confirmTxt: '确定修改',
                        showinput: true
                    })
                }
                if (res.tapIndex === 1) {
                    //   显示删除弹窗 
                    that.DeleteStaff(id, name, phone)
                }
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },

    // 确认按钮
    Confirm(e) {
        let id = e.currentTarget.dataset.id
        let type = e.currentTarget.dataset.type
        // 添加
        if (type == 'add') {
            this.AddNewStaff()
        }
        // 修改
        if (type == 'edit') {
            this.EditStaff(id)
        }
        // 数据恢复初始化
        this.setData({
            id: '',
            inputName: '',
            inputPhone: '',
            type: '',
            showinput: false
        })
    },

    // 添加
    AddNewStaff() {
        console.log('add')
        // 调用函数添加信息
        let that = this
        let name = this.data.inputName
        let phone = this.data.inputPhone
        wx.showLoading({
            title: '正在添加...',
            mask: true
        })
        wx.cloud.callFunction({
            name: 'Manager',
            data: {
                type: 'add-staff',
                name: name,
                phone: phone,
                updatetime: formatTime(new Date())
            },
            success(res) {
                wx.hideLoading()
                console.log('AddNewStaff-res', res)
                if (res.errMsg == "cloud.callFunction:ok") {
                    if (res.result.errMsg == 'collection.add:ok') {
                        // 添加成功
                        that.ShowTips('添加成功')
                        that.setData({
                            total:0,
                            page:0,
                            UserList:[] 
                        })
                        that.DocCount()
                        that.StaffList(0)
                    } else {
                        // 添加失败
                        that.ShowTips('添加失败')
                    }
                } else {
                    // 添加失败
                    that.ShowTips('添加失败')
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log('AddNewStaff-err', err)
                // 添加失败
                that.ShowTips('网络错误，添加失败')
            }
        })
    },

    // 修改
    EditStaff(id) {
        // 调用函数修改信息
        let that = this
        let name = this.data.inputName
        let phone = this.data.inputPhone

        console.log('edit', id, name, phone)

        wx.showLoading({
            title: '正在修改...',
            mask: true
        })
        wx.cloud.callFunction({
            name: 'Manager',
            data: {
                ID: id,
                type: 'edit-staff',
                name: name,
                phone: phone,
                updatetime: formatTime(new Date())
            },
            success(res) {
                wx.hideLoading()
                console.log('EditStaff-res', res)
                if (res.errMsg == "cloud.callFunction:ok") {
                    if (res.result.errMsg == 'collection.update:ok' && res.result.stats.updated > 0) {
                        // 添加成功
                        that.ShowTips('修改成功')
                        that.setData({
                            total:0,
                            page:0,
                            UserList:[] 
                        })
                        that.DocCount()
                        that.StaffList(0)
                    } else {
                        // 添加失败
                        that.ShowTips('修改失败')
                    }
                } else {
                    // 添加失败
                    that.ShowTips('修改失败')
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log('AddNewStaff-err', err)
                // 添加失败
                that.ShowTips('网络错误，修改失败')
            }
        })
    },

    // 删除
    DeleteStaff(id, name, phone) {
        console.log(id)
        let that = this
        wx.showModal({
            title: "删除提示",
            content: `确定删除 ${name} 员工的信息吗?删除后将不可恢复！`,
            confirmText: '确定删除',
            confirmColor: '#FA805C',
            cancelText: '取消',
            cancelColor: '#7CCD7D',
            success(res) {
                console.log(res)
                if (res.confirm) {
                    // 调用云函数进行信息的删除
                    console.log(`删除 ${name} ${phone}`)
                    wx.cloud.callFunction({
                        name: 'Manager',
                        data: {
                            type: 'delete-staff',
                            ID: id,
                            name: name,
                            phone: phone
                        },
                        success(res) {
                            wx.hideLoading()
                            console.log('DeleteStaff-res', res)
                            if (res.errMsg == "cloud.callFunction:ok") {
                                if (res.result.errMsg == 'collection.remove:ok' && res.result.stats.removed > 0) {
                                    // 删除成功
                                    that.ShowTips('删除成功')
                                    that.setData({
                                        total:0,
                                        page:0,
                                        UserList:[] 
                                    })
                                    that.DocCount()
                                    that.StaffList(0)
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
                            console.log('DeleteStaff-err', err)
                             // 删除失败
                             that.ShowTips('删除失败')
                        }
                    })
                }
            },
            fail(err) {
                console.log(err)
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

    // 获取输入框数据
    InputData(e) {
        console.log(e, e.currentTarget.dataset.key, e.detail.value)
        let key = e.currentTarget.dataset.key
        let value = e.detail.value
        if (key == 'name') {
            console.log('name')
            this.setData({
                inputName: value
            })
        }
        if (key == 'phone') {
            console.log('phone')
            this.setData({
                inputPhone: value
            })
        }
    },
    // 打开输入框
    OpenInput(e) {
        this.setData({
            id: '',
            inputName: '',
            inputPhone: '',
            type: 'add',
            inputTitle: '添加新的员工信息',
            confirmTxt: '确定添加',
            showinput: true
        })
    },

    // 关闭输入框
    CloseInput() {
        // 初始化数据
        this.setData({
            id: '',
            inputName: '',
            inputPhone: '',
            type: '',
            showinput: false
        })
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
        let UserList = this.data.UserList

        if (UserList.length < total) {
            page = page + 10
            this.StaffList(page)
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