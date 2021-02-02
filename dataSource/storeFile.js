const client = require('./client');


module.exports = {
    async dbUpdate(type, fileName, userId){
        console.log(type, fileName, userId)

        const fileExtention = fileName.substr(fileName.indexOf("."));
        if(type === 'avatar')
            return await this.updateAvatar(fileExtention , userId);

        if(type === 'image')
            return await this.updateImage(fileExtention , userId);

        if(type === 'file')
            return await this.updateFile(fileExtention , userId);

        else
            return 'upload type unknown'


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

    async updateImage(fileExtention , userId){
        try{
            const update = await client.query(`
            UPDATE projects
            SET 
                image = '/project-images/'||uuid_generate_v1()||$1
            WHERE id = $2
            RETURNING image`,[fileExtention , userId]
            ).catch(error => console.error(error));

            return update.rows[0].image
        } catch(error){
            throw error
        }
    },

    async updateFile(fileExtention , userId){
        try{
            const update = await client.query(`
            UPDATE projects
            SET 
                file = '/project-files/'||uuid_generate_v1()||$1
            WHERE id = $2
            RETURNING file`,[fileExtention , userId]
            ).catch(error => console.error(error));

            return update.rows[0].file
        } catch(error){
            throw error
        }
    },
}