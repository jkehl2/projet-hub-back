module.exports = {
    async dbUpdate(type, dirName, fileName, id){

        const fileExtention = fileName.substr(fileName.indexOf("."));
        const update = await client.query(`
            UPDATE $1
            SET 
                avatar = $2||uuid_generate_v1()||$3
            WHERE id = $4
            RETURNING avatar`,[type , dirName, fileExtention , id]
        );
        const filePath = update.rows[0].avatar;
        return filePath
    }
}