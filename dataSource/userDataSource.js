const { DataSource } = require('apollo-datasource');
const DataLoader = require('dataloader');
const cache = require('./cache');


class UserDataSource extends DataSource {

    constructor() {
        super();
    }
    initialize(config) {
        this.context = config.context;
        this.client = config.context.sqlClient;
    }

    async findAllUsers() {
        const result = await this.client.query('SELECT * FROM users');
        return result.rows;
    }

    async findUserById(userId) {
        const cacheKey = "user"+ userId.toString();
        return cache.wrapper(cacheKey,async () => {
            await this.userLoader.clear(userId)
            return await this.userLoader.load(userId);
        });
    };

    async insertUser(user) {
        const savedUser = await this.client.query(
            `INSERT INTO users
                (name, email, password)
                VALUES ($1, $2, crypt($3,gen_salt('md5'))) RETURNING *`,
            [user.name, user.email, user.password]
                );
        return savedUser.rows[0];
    };

    async editUserInfos(newInfos, user) {
        const savedUser = await this.client.query(`
            UPDATE users
            SET 
                name = $1,
                email = $2
            WHERE
                id = $3
            RETURNING *
             `,
            [newInfos.name, newInfos.email, user.id]
             );
        return savedUser.rows[0];
    };

    async editUserAvatar(newInfos, user) {
        const savedUser = await this.client.query(`
            UPDATE users
            SET 
                avatar = $1
            WHERE
                id = $2
            RETURNING *
             `,
            [newInfos.avatar, user.id]
             );
        return savedUser.rows[0];
    };

    async editUserPassword(newInfos, user) {
        const savedUser = await this.client.query(`
            UPDATE users
            SET 
                password = crypt($1,gen_salt('md5'))
            WHERE
                id = $2
            RETURNING *
             `,
            [newInfos.password, user.id]
             );
        return savedUser.rows[0];
    };

    async deleteUser(user) {
        const deletion = await this.client.query(`
            DELETE FROM users
            WHERE
                id = $1
            RETURNING 'Deletion completed'
             `,
            [user.id]
             );
        return {infos: deletion.rows[0]['?column?']};
    };

    async findUserByEmail(email) {
        const user = await this.client.query(
            'SELECT * FROM users WHERE email LIKE $1',
            [email]);

        if (user.rowCount > 0){
            console.log("user found");

        } else {
            console.log("user not found");
            
        }
        return user.rows[0];                

    };

    userLoader = new DataLoader(async (ids) => {
        console.log('Running batch function user Loader with', ids);
       
        const result = await this.client.query(
            'SELECT * FROM users WHERE id = ANY($1)',
            [ids]);
        const data = ids.map(id => {
            return result.rows.find( author => author.id == id);
        });
        return data;
    });


}

module.exports = UserDataSource;