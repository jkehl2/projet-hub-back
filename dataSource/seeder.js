const faker = require('faker');
const client = require('./client');
const axios = require('axios').default;
const queryString = require('query-string');
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

    async project(userId, place, nb){
        try{
            let projectsCreated = []
            const geo = await this.convertToGeo(place);
            console.log(geo)
            nb = nb > 3? 3 : nb;
            for(let i = 0; i < nb; i++) {
                const title = faker.lorem.words(4);
                const description = faker.lorem.paragraph();
                const expiration_date = faker.date.between('2020-10-01', '2024-01-05')
                const coordinates = faker.address.nearbyGPSCoordinate([geo.lat, geo.long], 15)

                const lat = parseFloat(coordinates[0]);
                const long = parseFloat(coordinates[1]);
                const location = await this.convertToAddress(lat, long);
                const author = userId;


                const projectInsertion = await client
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
                const projectCreated = projectInsertion.rows[0];
                projectCreated.need = []
                for(let i = 0; i < 2; i++) {
                    const title = faker.lorem.words(2);
                    const description = faker.lorem.sentence();
                    const needInsertion = await client
                    .query(`
                        INSERT INTO needs(
                            title, 
                            description, 
                            project_id)
                        VALUES ($1, $2, $3) 
                        RETURNING *`,
                    [title, description, projectCreated.id])
                    .catch(error => {throw {msg:error.stack,code:error.code}})
                    projectCreated.need.push(needInsertion.rows[0])
                }
                
                projectsCreated.push(projectCreated)
            }
            return projectsCreated;
    
        } catch(error){
            return error
        }
    },

    async convertToAddress(lat, long) {
        try{
            console.log("convert geo",lat,long)
            const query = queryString.stringifyUrl({
                url: 'https://nominatim.openstreetmap.org/reverse',
                query: {
                  lat: lat,
                  lon: long,
                  format: 'json',
                  zoom: 14,
                  addressdetails: 1,
                },
            });
            
            const data = await axios
                .get(query)
                .catch((error) => {throw error})

            if(data.data.address.city !== undefined)
                return data.data.address.city
            if(data.data.address.town !== undefined)
                return data.data.address.town
            if(data.data.address.village !== undefined)
                return data.data.address.village
            if(data.data.address.locality !== undefined)
                return data.data.address.locality

        } catch(error){
            return error
        }
    },

    async convertToGeo(lat, long) {
        try{
            console.log("convert geo",lat,long);
            const query = queryString.stringifyUrl({
                url: 'https://nominatim.openstreetmap.org/search',
                query: {
                  lat: lat,
                  lon: long,
                  format: 'json',
                  addressdetails: 1,
                },
            });
            
            const data = await axios
                .get(query)
                .catch((error) => {throw error})

            if(data.data.address.city !== undefined)
                return data.data.address.city
            if(data.data.address.town !== undefined)
                return data.data.address.town
            if(data.data.address.village !== undefined)
                return data.data.address.village
            if(data.data.address.locality !== undefined)
                return data.data.address.locality
        } catch(error){
            return error
        }
    },

    async convertToGeo(address) {
        try{
            console.log("convert geo",address)
            const query = queryString.stringifyUrl({
                url: 'https://nominatim.openstreetmap.org/search',
                query: {
                    adressdetails: 1,
                    q: address,
                    format: 'json',
                    limit: 1,
                },
            });
            
            const data = await axios
                .get(query)
                .catch((error) => {throw error})
            return {lat:data.data[0].lat, long:data.data[0].lon}
        } catch(error){
            return error
        }
    }
    



}

