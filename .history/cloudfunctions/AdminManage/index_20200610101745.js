// 云函数入口文件
// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
    MD5
} = require("./MD5.js")


cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
    traceUser: true
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID

    // 获取管理员权限级别
    if (event.type === 'adminInfo') {
        let res = await db.collection('AdminStator').where({
            '_openid': openId
        }).field({
            'name': true,
            'level': true
        }).get()
        return res
    }

    // 获取管理员列表
    if (event.type === 'AdminList') {
        let count = await db.collection('AdminStator').where({
            '_openid': openId
        }).count()
        // 再次验证是否为管理员
        if (count.total) {
            var res = await db.collection('AdminStator').orderBy('level', 'asc').get()
        } else {
            var res = {
                'data': []
            }
        }
        return res
    }

    // 添加管理员
    if (event.type === 'add-admin') {
        let data = event.data
        let name = event.name
        let phone = event.phone
        let avatarUrl = event.avatarUrl
        let updatetime = event.updatetime
        // 修改状态
        let ChangeStats = await db.collection('TempCllection')
            .where({
                _id: data.id
            })
            .update({
                data: {
                    stats: true
                }
            })
        // let total = await db.collection('AdminStator').where({ '_openid': openId }).count()
        // 更新成功，添加管理员
        if (ChangeStats.stats.updated) {
            // 添加管理员
            let add = await db.collection('AdminStator')
                .add({
                    data: {
                        _openid: openId,
                        name: name,
                        phone: phone,
                        level: 1,
                        avatarUrl: avatarUrl,
                        updatetime: updatetime
                    }
                })

            if (add.errMsg == "collection.add:ok") {
                // 删除记录
                let remove = await db.collection('TempCllection').doc(data.id).remove()
                if (remove.stats.removed) {
                    // 完成
                    var res = {
                        'code': 200,
                        'errMsg': 'ok'
                    }
                } else {
                    // 失败
                    var res = {
                        'code': 400,
                        'errMsg': 'err'
                    }
                }
            } else {
                // 失败
                var res = {
                    'code': 400,
                    'errMsg': 'err'
                }
            }
        } else {
            // 失败
            var res = {
                'code': 400,
                'errMsg': 'err'
            }
        }
        return res
    }

    // 删除管理员
    if (event.type === 'delete-admin') {
        let info = await db.collection('AdminStator').where({
            '_openid': openId
        }).get()
        // 再次验证是否为超级管理员
        if (info.data[0].level === 0) {
            // 检查需要删除的管理员的openid是否与自己的相同
            if (event.openid != openId) {
                var remove = await db.collection('AdminStator')
                    .where({
                        _id: event.ID,
                        _openid: event.openid,
                        name: event.name,
                        phone: event.phone
                    }).remove()
                var res = {
                    'stats': remove.stats.removed,
                    'errMsg': 'collection.remove:ok'
                }
            } else {
                // 提示不能删除自己
                var res = {
                    'stats': -999,
                    'errMsg': 'collection.remove:ok'
                }
            }
        } else {
            var res = {
                'stats': -100,
                'errMsg': 'collection.remove:ok'
            }
        }
        return res
    }

    // 获取二维码
    if (event.type === 'qrcode') {
        let info = await db.collection('AdminStator').where({
            '_openid': openId
        }).get()
        // 再次验证是否为超级管理员
        if (info.data[0].level === 0) {
            // 生成随机码
            // 生成10位的随机数字符串
            let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            let str = "";
            let n = 25
            for (var i = 0; i < n; i++) {
                var id = Math.ceil(Math.random() * 35);
                str += chars[id];
            }
            // 对字符串MD5加密
            let md5 = MD5(str)
            let code = str + md5.toUpperCase() + str
            // var res = await db.collection('AdminStator').orderBy('level','asc').get()
            var add = await db.collection('TempCllection')
                .add({
                    data: {
                        'stats': false,
                        'code': code,
                        'updatetime': event.updatetime
                    }
                })
            // 数据写入成功
            if (add.errMsg == 'collection.add:ok') {
                var res = {
                    'id': add._id,
                    'stats': false,
                    'code': code,
                    'updatetime': event.updatetime
                }
            } else {
                var res = {
                    'id': '',
                    'stats': '',
                    'code': '',
                    'updatetime': event.updatetime
                }
            }
        } else {
            var res = {
                'id': '',
                'stats': false,
                'code': '',
                'updatetime': event.updatetime
            }
        }
        return {
            'data': res
        }
    }

}