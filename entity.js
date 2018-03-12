module.exports = {
    parseTicketNumber : function (text){
            var n = 7 //number of digits in a number
            var tickets = []
            var regexTickets = /inc *\d{5,}/gi;
            //ticket nymber with tag [inc124124, req23424 etc]
            var ticketWithTags = text.match(regexTickets)
            var digitsTicket = /\d{5,}/g;
            //all ther numbers [123143,2345452,43252 etc]
            var ticketWithDigits =text.match(digitsTicket)
            if (ticketWithDigits){
                ticketWithDigits = ticketWithDigits.map((number)=>{
                
                        missingLen = n - number.length;
                        if (missingLen > 0){
                            return ('inc'+'0'.repeat(missingLen)+number);
                        }
                        return 'inc'+number;
                });
        
                tickets = tickets.concat(ticketWithDigits)
            }
        
            if (ticketWithTags){
                ticketWithTags = ticketWithTags.map((ticket)=>{
                    num = ticket.substr(3).trim()
                    missingLen = n - num.length
                    if (missingLen>0){
                        return 'inc' + '0'.repeat(missingLen) + num;
                    }
                    return ticket;
                });
                tickets = tickets.concat(ticketWithTags)
            }
        
        
            return Array.from(new Set(tickets))
        },

    parseEmployeeId : function(text){
        var empid = []
        var idRegEx = /\d{5,}/g;
        //all ther numbers [123143,2345452,43252 etc]
        var ids = text.match(idRegEx)
        if (ids && ids.length == 1){
            id = parseInt(ids[0])
            if(id>99999 && id<999999){
                empid.push(id)
            }
        }
        return empid
    }
}