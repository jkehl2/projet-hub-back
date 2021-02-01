const faker = require('faker');
const client = require('./client');

faker.locale = "fr";


module.exports = {
    async user(nb){
        try{
            let accountsCreated = []
            for(let i = 0; i < nb; i++) {
                const firstName = faker.name.firstName();
                const lastName = faker.name.lastName();
                const name = `${firstName} ${lastName}`;
                console.log(name);
                const email = `${firstName}.${lastName}@localhub.com`;
                const password = 'password';

                const insertion = await client
                .query(`
                    INSERT INTO users(
                        name, 
                        email, 
                        password)
                    VALUES (
                        $1, 
                        $2, 
                        crypt($3,gen_salt('md5'))) 
                    RETURNING *`,
                    [name, email, password])
                .catch(error => {throw {msg:error.stack,code:error.code}})
                
                console.log(insertion.rows[0])
                accountsCreated.push(insertion.rows[0].email)
            }
            return accountsCreated;
    
        } catch(error){
            throw error
        }
    },

    async project(nb){
        try{
            let projectsCreated = []
            for(let i = 0; i < nb; i++) {
                const title = faker.lorem.words(4);
                const description = faker.lorem.paragraph();
                const expiration_date = faker.date.between('2020-10-01', '2024-01-05')
                const location = faker.address.streetAddress();
                const coordinates = faker.address.nearbyGPSCoordinate(['47.2184','-1.5536'], 40, true)
                console.log(coordinates)
                const lat = coordinates[0];
                const long = coordinates[1];
                const author = 1;
                console.log(location);

                const insertion = await client
                .query(`
                    INSERT INTO projects(
                        title, 
                        description, 
                        expiration_date, 
                        location, 
                        lat, 
                        long,  
                        author)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) 
                    RETURNING *`,
                    [title, description, expiration_date, location, lat, long, author])
                .catch(error => {throw {msg:error.stack,code:error.code}})
                
                console.log(insertion.rows[0])
                projectsCreated.push(insertion.rows[0])
            }
            return projectsCreated;
    
        } catch(error){
            return error
        }
    },



}

