const client = require('./client');


module.exports = {
    async dbUpdate(type, fileName, userId){
        console.log(type, fileName, userId)

        const fileExtention = fileName.substr(fileName.indexOf("."));
        if(type === 'avatar')
            return await this.updateAvatar(fileExtention , userId);

        if(type === 'image')
            return await this.updateAvatar(fileExtention , userId);


    },

    async updateAvatar(fileExtention , userId){
        try{
        const update = await client.query(`
        UPDATE users
        SET 
            avatar = '/avatars/'||uuid_generate_v1()||$1
        WHERE id = $2
        RETURNING avatar`,[fileExtention , userId]
        ).catch(error => console.error(error));

        return update.rows[0].avatar
        } catch(error){
            throw error
        }
    },
}