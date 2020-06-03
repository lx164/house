// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'dev-house-0tiax',
    traceUser: true,
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID

    // 管理员发布委托
    if (event.type === 'add') {
        let ID = event.ID
        let publishTime = event.updateTime
        let checkedBy = event.checkedBy
        let checkedTime = event.checkedTime
        let title = event.title
        let updateTime = event.updateTime
        let dbname = event.publishPlate
        let plate = event.plate
        let publishPlate = event.publishPlate
        let charge = event.charge

        let res = await db.collection(dbname).add({
            data: {
                _openid: openId,
                ID: ID,
                updateTime: updateTime
            }
        }).then(res => {
            return res;
        })

        // 更新委托信息
        let task = await db.collection('Entrust')
            .doc(event.ID)
            .update({
                data: {
                    plate: plate,
                    publishPlate: publishPlate,
                    charge: charge,
                    publish: true,
                    publishTime: publishTime,
                    checkedBy: checkedBy,
                    checkedTime: checkedTime,
                    title: title
                }
            })
        // await task;
        // await res;
        return res;
    }

    // 修改已经审核发布的委托信息
    if (event.type === 'changeEntrust') {
        // 删除已发布到不同平台的数据
        let dbname = event.publishPlate
        let del = await db.collection(dbname).where({ ID: event.ID }).remove()
        // 设置为未发布的状态
        let res = await db.collection('Entrust')
            .where({
                _id: event.ID
            })
            .update({
                data: {
                    checkedBy: '',
                    charge: {
                        'name': '',
                        'phone': ''
                    },
                    checkedTime: '',
                    plate: '',
                    publish: false,
                    publishTime: '',
                    publishPlate: '',
                    recommendData: {
                        'Isrecommend': false,
                        'recommender': '',
                        'updatetime': '',
                        'weight': 0
                    }
                }
            })
        return res
    }


    // 删除已经审核发布的委托信息
    if (event.type === 'deleteEntrust') {
        // 删除已发布到不同平台的数据
        let dbname = event.publishPlate
        let del = await db.collection(dbname).where({ ID: event.ID }).remove()
        // 删除本体数据
        let res = await db.collection('Entrust').where({ _id: event.ID }).remove()
        return res
    }


    // 添加首页推荐
    if (event.type === 'recommend') {
        let ID = event.ID
        let updateTime = event.updateTime
        let weight = parseInt(event.weight)
        let recommender = event.recommender
        let Isrecommend = event.Isrecommend

        let res = await db.collection('Entrust')
            .doc(ID)
            .update({
                data: {
                    recommendData: {
                        "Isrecommend": Isrecommend,
                        "weight": weight,
                        "recommender": recommender,
                        "updatetime": updateTime
                    }
                }
            })
        return res;
    }

}