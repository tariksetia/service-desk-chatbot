module.exports = {
    getByNumbers:getByNumbers
}

var getByNumbers ={
    onSuccess : (tickets,session,builder) =>{
        session.send(JSON.stringify(tickets))
        session.endConversation()
    },
    onError: (session,builder) =>{
        session.send("Sorry I Could not find any ticket")
    }
}