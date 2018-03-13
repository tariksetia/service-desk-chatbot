var fetch = require('node-fetch')
let base64 = require('base-64');


module.exports = {
    getSnowTicketByNumber:(numbers,onSuccess, onError)=>{
        var url =process.env.snow_url+'/api/now/table/incident?sysparm_fields=number%2Cstate%2Cassigned_to%2Cshort_description%2Cimpact%2Csys_updated_on%2Cdescription%2Csys_id%2Cincident_state%2Curgency%2Csys_updated_by%2Copened_by%2Csys_created_on&sysparm_query='
        var numbers= numbers || null
        var tickets = []
        if(!numbers){
            return tickets
        }
        
        var query_string = ""
        for (let index = 0; index < numbers.length; index++) {
            if (index === numbers.length-1){
                query_string = query_string + "number=" + numbers[index]               
            }else{
                query_string = query_string + "number=" + numbers[index] + '^OR'
            }
        }
        
        var uri = url +query_string

        return fetch(uri,{
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + base64.encode(process.env.snow_user +':'+process.env.snow_pass),
                'Accept':'application/json',
                'Content-Type':'application/json'
                }
            })
            .then(function(response) {
                tickets = response.json();
                return tickets
            })
            .catch((error)=>{
                return []
            })

    },

    getSnowTicketsById:(id)=>{
        var id = id
     
    }


}


