var fetch = require('fetch');

module.exports ={
    getSnowTicketByNumber:(numbers)=>{
        var url =process.env.url+'/api/now/v1/table/incident?sysparm_query='
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

        var URI = url +query_string

        fetch(URI,{
            method: 'GET',
            headers: {
                'Authorization': 'Basic' + btoa(process.enc.snow_user +':'+process.env.snow_pass)
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
        var 
    }


}


