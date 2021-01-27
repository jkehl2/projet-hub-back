module.exports={        /**
    * Converts object array's timestamps to ISO string
    * 
    * @param {*} data object 
    */
    toIso(data) {
        if (data[0] !== undefined){
            const dataConverted = data.forEach(object => { 
                object.created_at = new Date(object.created_at).toISOString('fr-FR')
                object.updated_at = new Date(object.updated_at).toISOString('fr-FR')

                if (object.expiration_date)
                    object.expiration_date = new Date(object.expiration_date).toISOString('fr-FR')
        
            })
            return dataConverted;
        }
    }
    
}