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

    // 用户保存自己的委托
    if (event.type === 'INIT') {
        const dbname = 'UserList'
        return await db.collection(dbname).where({
            '_openid': openId
        }).field({
            _openid: true,
            name: true,
            phone: true,
            address:true,
            manager:true
        }).get()
    }

    // 查询是否为管理员
    if (event.type == 'ADMIN') {
        const dbname = 'AdminStator'
        return await db.collection(dbname).where({
            '_openid': openId
        }).count()
    }

}