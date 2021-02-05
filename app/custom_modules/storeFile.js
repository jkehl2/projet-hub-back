const client = require('../dataSource/client');


module.exports = {
    /**
     * Define avatar extention and return avatar name stored in database
     * using subfunction
     * 
     * @param {String} fileName 
     * @param {Number} userId
     * @returns {String} stored file name with folder path
     */
    async dbUpdateAvatar(fileName, userId){

        const fileExtention = fileName.substr(fileName.indexOf("."));

        return await this.updateAvatar(fileExtention , userId);

    },

    /**
     *Define project image or file extention, determine type image or file
     * and return file name stored in database using subfunction
     * 
     * @param {String} type string "image" || "file"
     * @param {String} fileName original name of file to store
     * @param {Number} userId 
     * @param {Number} projectId 
     * @returns {String} stored file name with folder path
     */
    async dbUpdate(type, fileName, userId, projectId){

        console.log(type, fileName,userId,projectId)
        const fileExtention = fileName.substr(fileName.indexOf("."));

        if(type === 'image')
            return await this.updateImage(fileExtention , userId, projectId);

        if(type === 'file')
            return await this.updateFile(fileExtention , userId, projectId);

        else
            return 'upload type unknown'
    },

    /**
     * Generate and return an UUID name for the avatar image to store
     * 
     * @param {Sting} fileExtention 
     * @param {Number} userId 
     * @returns {String} stored file name with folder path
     */
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
            console.log('\x1b[31m%s\x1b[0m', error)
            throw error
        }
    },

    /**
     * Generate and return an UUID name for the project image to store 
     * while storing it in DB
     * @param {String} fileExtention 
     * @param {Number} userId 
     * @param {Number} projectId 
     * @returns {String} stored file name with folder path
     */
    async updateImage(fileExtention , userId, projectId){
        try{
            const update = await client.query(`
            UPDATE projects
            SET 
                image = '/project-images/'||uuid_generate_v1()||$1
            WHERE id = $2
            RETURNING image`,[fileExtention , projectId]
            ).catch(error => console.error(error));

            return update.rows[0].image
        } catch(error){
            console.log('\x1b[31m%s\x1b[0m', error)
            throw error
        }
    },

    /**
     * Generate and return an UUID name for the project file to store 
     * while storing it in DB
     * @param {String} fileExtention 
     * @param {Number} userId 
     * @param {Number} projectId 
     * @returns {String} stored file name with folder path
     */
    async updateFile(fileExtention , userId, projectId){
        try{
            const update = await client.query(`
            UPDATE projects
            SET 
                file = '/project-files/'||uuid_generate_v1()||$1
            WHERE id = $2
            RETURNING file`,[fileExtention , projectId]
            ).catch(error => console.error(error));

            return update.rows[0].file
        } catch(error){
            console.log('\x1b[31m%s\x1b[0m', error)
            throw error
        }
    },
}