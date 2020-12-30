// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
    traceUser: true
})
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID

    // 查询房子
    if (event.type === 'query') {
        let limit = 10
        let dbname = event.key
        let page = event.page

        let res = await db.collection(dbname).aggregate()
            .skip(page)
            .limit(limit)
            .sort({
                updateTime: -1
            })
            .lookup({
                from: 'Entrust',
                localField: 'ID',
                foreignField: '_id',
                as: 'EntrustInfo',
            })
            .match({
                'EntrustInfo.publish': true
            })
            .project({
                'ID': true,
                'updateTime': true,
                'EntrustInfo.title': true,
                'EntrustInfo.FormData.houseStyle': true,
                'EntrustInfo.FormData.roomStyle': true,
                'EntrustInfo.FormData.area': true,
                'EntrustInfo.FormData.location': true,
                'EntrustInfo.FormData.Tags': true,
                'EntrustInfo.FormData.averagePrice': true,
                'EntrustInfo.FormData.totalPrice': true,
                'EntrustInfo.photoInfo': true
            })
            .replaceRoot({
                newRoot: $.mergeObjects([$.arrayElemAt(['$EntrustInfo', 0]), '$$ROOT'])
            })
            .project({
                '_id': false,
                'EntrustInfo': false
            })
            .end()
        return res
    }

    // 房型筛选
    if (event.type == 'housetype') {
        let limit = 10
        let dbname = event.key
        let page = event.page
        let RoomStyle = event.RoomStyle
        let res = await db.collection(dbname).aggregate()
            .skip(page)
            .limit(limit)
            .sort({
                updateTime: -1
            })
            .lookup({
                from: 'Entrust',
                localField: 'ID',
                foreignField: '_id',
                as: 'EntrustInfo',
            })
            .match({
                'EntrustInfo.publish': true,
                'EntrustInfo.FormData.roomStyle': RoomStyle
            })
            .project({
                'ID': true,
                'updateTime': true,
                'EntrustInfo.title': true,
                'EntrustInfo.FormData.houseStyle': true,
                'EntrustInfo.FormData.roomStyle': true,
                'EntrustInfo.FormData.area': true,
                'EntrustInfo.FormData.location': true,
                'EntrustInfo.FormData.Tags': true,
                'EntrustInfo.FormData.averagePrice': true,
                'EntrustInfo.FormData.totalPrice': true,
                'EntrustInfo.photoInfo': true
            })
            .replaceRoot({
                newRoot: $.mergeObjects([$.arrayElemAt(['$EntrustInfo', 0]), '$$ROOT'])
            })
            .project({
                '_id': false,
                'EntrustInfo': false
            })
            .end()
        return res
    }

    // 价格筛选
    if (event.type == 'houseprice') {
        let limit = 10
        let page = 0
        let dbname = event.key
        let min = parseInt(event.min)
        let max = parseInt(event.max)

        let res = await db.collection(dbname).aggregate()
            .skip(page)
            .limit(limit)
            .sort({
                updateTime: -1
            })
            .lookup({
                from: 'Entrust',
                localField: 'ID',
                foreignField: '_id',
                as: 'EntrustInfo',
            })
            .match({
                'EntrustInfo.publish': true,
                'EntrustInfo.FormData.totalPrice': _.gte(min).lte(max)
            })
            .project({
                'ID': true,
                'updateTime': true,
                'EntrustInfo.title': true,
                'EntrustInfo.FormData.houseStyle': true,
                'EntrustInfo.FormData.roomStyle': true,
                'EntrustInfo.FormData.area': true,
                'EntrustInfo.FormData.location': true,
                'EntrustInfo.FormData.Tags': true,
                'EntrustInfo.FormData.averagePrice': true,
                'EntrustInfo.FormData.totalPrice': true,
                'EntrustInfo.photoInfo': true
            })
            .replaceRoot({
                newRoot: $.mergeObjects([$.arrayElemAt(['$EntrustInfo', 0]), '$$ROOT'])
            })
            .project({
                '_id': false,
                'EntrustInfo': false
            })
            .end()
        return res
    }

}