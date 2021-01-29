const client = require('./client');


module.exports = {
    async dbUpdate(type, column, dirName, fileName, id){
        console.log(type, column, dirName, fileName, id)

        const fileExtention = fileName.substr(fileName.indexOf("."));
        const update = await client.query(`
            UPDATE users
            SET 
                avatar = '/'||$1||'/'||uuid_generate_v1()||$2
            WHERE id = $3
            RETURNING avatar`,[dirName, fileExtention , id]
        ).catch(error => console.error(error));
        console.log(update.rows)
        const filePath = update.rows[0].avatar;
        return filePath
    }
}