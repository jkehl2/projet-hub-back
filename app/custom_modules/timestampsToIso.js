   
/**
* Converts array of users or projects objects timestamps to ISO string
* 
* @param {Array} data : array containing projects or users objects 
* @returns {Array} array of projects passed in param with converted time datas
*/
function timestampsToIso(data) {
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

module.exports = timestampsToIso
