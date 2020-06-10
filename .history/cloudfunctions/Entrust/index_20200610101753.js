// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
    traceUser: true
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    const dbname = 'Entrust'

    // 用户保存自己的委托
    if (event.type === 'add') {
        let EntrustType = event.EntrustType
        let FormData = event.FormData
        let photoInfo = event.photoInfo
        let updateTime = event.updateTime
        FormData['totalPrice'] = parseInt(FormData['totalPrice'])

        return await db.collection(dbname).add({
            data: {
                _openid: openId,
                photoInfo: photoInfo,
                FormData: FormData,
                EntrustType: EntrustType,
                publish: false,
                publishTime: '',
                checkedBy: '',
                checkedTime: '',
                title: '',
                plate: '',
                publishPlate: '',
                charge: {
                    'name': '',
                    'phone': ''
                },
                updateTime: updateTime,
                recommendData: {
                    "Isrecommend": false,
                    "recommender": "",
                    "updatetime": ""
                }
            }
        })
    }

    // 用户查看自己的委托
    if (event.type === 'MyEntrust') {
        const EntrustList = await db.collection(dbname).orderBy('updateTime', 'desc').where({
            '_openid': openId,
            'EntrustType': event.key
        }).field({
            _id: true,
            EntrustType: true,
            checkedBy: true,
            checkedTime: true,
            publish: true,
            publishTime: true,
            updateTime: true,
            title: true,
            'FormData.detailLocation': true,
            'FormData.houseStyle': true
        }).get()
        return EntrustList
    }

    // 管理员获取用户的委托
    if (event.type === 'AllEntrust') {
        let IsPublish = event.IsPublish
        const EntrustList = await db.collection(dbname).orderBy('updateTime', 'desc').where({
            'publish': IsPublish
        }).field({
            _id: true,
            plate: true,
            publishPlate: true,
            EntrustType: true,
            checkedBy: true,
            checkedTime: true,
            publish: true,
            publishTime: true,
            updateTime: true,
            title: true,
            'FormData.detailLocation': true,
            'FormData.name': true,
            'FormData.phonenumber': true
        }).get()
        return EntrustList
    }

    // 详细信息
    if (event.type === 'EntrustDetail') {
        let id = event.id
        const EntrustList = await db.collection(dbname)
            .orderBy('updateTime', 'desc')
            .where({
                '_id': id
            }).get()
        return EntrustList
    }

}