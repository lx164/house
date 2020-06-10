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

    // 添加员工
    if (event.type === 'add-staff') {
        let dbname = 'ContactList'
        return await db.collection(dbname)
            .add({
                data: {
                    name: event.name,
                    phone: event.phone,
                    updatetime: event.updatetime
                }
            })

    }

    // 修改员工
    if (event.type === 'edit-staff') {
        let dbname = 'ContactList'
        return await db.collection(dbname)
            .where({
                _id: event.ID
            })
            .update({
                data: {
                    name: event.name,
                    phone: event.phone,
                    updatetime: event.updatetime
                }
            })

    }

    // 删除员工
    if (event.type === 'delete-staff') {
        let dbname = 'ContactList'
        try {
            return await db.collection(dbname)
                .where({
                    _id: event.ID,
                    name: event.name,
                    phone: event.phone
                }).remove()
        } catch (e) {
            console.error(e)
        }
    }

    // 更新公司信息
    if(event.type==='update-company'){
        let dbname = 'CompanyInfo'
        return await db.collection(dbname)
            .where({
                _id: event.ID
            })
            .update({
                data: {
                    introduce:event.introduce,
                    notice:event.notice,
                    editer: event.editer,
                    phone: event.phone,
                    updatetime: event.updatetime
                }
            })
    }
}