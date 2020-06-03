// components/myComponent.js
const QR = require('./weapp-qrcode.js')
const rpx2px = wx.getSystemInfoSync().windowWidth / 750
Component({

    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },

    properties: {
        value: String, //二维码内容
        width: String, //二维码宽度（默认长宽相等）
    },

    data: {
        qrcodeURL: ''
    },

    ready: function() {
        var imgData = QR.drawImg(this.data.value, {
            typeNumber: 3, //码点大小 1-40，数字越大，码点越小，二维码会显得越密集
            errorCorrectLevel: 'H', //纠错等级 H等级最高(30%) 简单来说，就是二维码被覆盖了多少仍然能被识别出来 详见qrcode.js
            size: parseInt(rpx2px * this.data.width)
        })
        this.setData({
            qrcodeURL: imgData
        })
        console.log('qrcodeURL', imgData)
    },


    methods: {
        /**
         * 长按保存图片
         */
        save: function() {
            var self = this
            var aa = wx.getFileSystemManager(),
                filePath = wx.env.USER_DATA_PATH + '/qrcode_' + self.data.value + '.png';
            //写入临时文件
            aa.writeFile({
                filePath: filePath,
                data: self.data.qrcodeURL.slice(22),
                encoding: 'base64',
                success: res => {
                    //保存临时文件到手机相册中去
                    wx.saveImageToPhotosAlbum({
                        filePath: filePath,
                        success: function(res) {
                            wx.showToast({
                                title: '保存成功',
                            })
                        },
                        fail: function(err) {
                            console.log('err', err)
                            // if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                            console.log("打开设置窗口");
                            wx.openSetting({
                                success(settingdata) {
                                    console.log(settingdata)
                                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                                        console.log("获取权限成功，再次点击图片保存到相册")
                                    } else {
                                        console.log("获取权限失败")
                                    }
                                }
                            })
                            // }
                        }
                    })
                    console.log(res)
                },
                fail: err => {
                    console.log(err)
                }
            })
        }
    }
})