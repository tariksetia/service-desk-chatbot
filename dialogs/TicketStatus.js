var builder = require('botbuilder')
var entity = require('./../entity')
var snow = require('./../integrations/snow')
var cards = require('./../cards/incidentsCard')

module.exports = (bot) => {
    
    bot.dialog('/ticketStatus', [
        
        (session) => {
            session.send('I can help you finding ticket status.');
            session.beginDialog('/askForTicketNumber');
        },

        (session,results,next) => {
            if (results.tickets){
                session.conversationData.tickets = results.tickets
                session.beginDialog('/getTicketInfo',{tickets:results.tickets})
            }else{
                builder.Prompts.text(session,"Are you enquiring for tickets created by someone else?")
            }
        },

        (session, results, next) => {
            response = results.response.toString().toLowerCase()
            if (response == 'yes'){
                session.beginDialog('/askForEmployeeId',{person:"other"})
            }else{
                if (!session.userData.profile || !session.userData.profile.empid){
                    session.beginDialog('/askForEmployeeId',{person:"myself"})
                }else{
                    next({empid:session.userData.profile.empid})
                }
            }
        },
        (session,args,next)=>{
            if(args && args.escalte){
                session.say("didn't get a valid employee id. Escalting to Human agent")
                session.endConversation();
            }else if (args && args.empid){
                session.beginDialog('/getTicketForEmpId',{empid:args.empid})
            }
        },
        (session,args,next)=>{
            session.endDialog()
        }
        
    ]);
    
    bot.dialog('/askForTicketNumber', [
        (session) => {
            session.sendTyping();

            builder.Prompts.confirm(session,"Do you have a paticular ticket number in mind?");
            
        },
        (session,results,next) => {
            console.log(results.response.toString().toLowerCase())
            if ( results.response.toString().toLowerCase() =='true'){
                session.beginDialog('/parseForTicketNumber')
            }else{
                session.endDialog();
            }
        },
        (session, results, next) => {
            session.endDialogWithResult(results)
        }
    ]);

    bot.dialog('/parseForTicketNumber',[
        (session,args) =>{
            if (!args || !args.loopCount){
                session.dialogData.parseTicketLoopCount = 0
            }
            if(args && args.loopCount){
                session.dialogData.parseTicketLoopCount = args.loopCount
            }
            if (session.dialogData.parseTicketLoopCount > 1){
                session.send("Sorry, I couldn't detect any incident number")
                session.endDialogWithResult({tickets:null,escalte:true})
            }else{
                builder.Prompts.text(session,"Please enter valid ticket number(s). Separate multiple tickets with commas.");
            }
            
        },
        (session, results, next)=>{
            var text = results.response.toString().toLowerCase()
            var incList = entity.parseTicketNumber(text)
            if(incList.length>0){
                session.endDialogWithResult({tickets:incList})
            }else{
                session.replaceDialog('/parseForTicketNumber',{loopCount:session.dialogData.parseTicketLoopCount+1})
            }

        }
    ])

    bot.dialog('/getTicketInfo',[
        (session,args,next) => {
            if (!args || !args.tickets){
                session.say("Something failed, I misplaced the ticket numbers")
                session.endDialogWithResult({escalte:true})
            }else{
                snow.getSnowTicketByNumber(args.tickets)
                    .then((data)=>{
                        
                        console.log(data)
                        if (data && data.result){
                            next({tickets:data.result})
                        }else{
                            next({tickets:[]})
                        }
                    })
                    .catch((error)=>{
                        console.log(error)
                        next({tickets:[]})
                    })
            }
        },
        (session,args) =>{
            if (!args || !args.tickets || args.tickets.length ==0){
                session.send("Couldn't find any ticket")
                session.endConversation()
            }else{
                tickets = args.tickets
                console.log(tickets)
                tickets = tickets.map((inc)=>{
                    return cards.incidentCard(session,inc)
                })
                if (tickets.len == 1){
                    session.send(ticket[0])
                    session.endConversation()
                }else{
                    var reply =  new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);
                    session.send(reply)
                    session.endConversation()
                }
            }
        }
    ])

    bot.dialog('/askForEmployeeId',[
        (session,args)=>{
            console.log(JSON.stringify(args))
            if (!args || !args.loopCount){
                session.dialogData.loopCount = 0
                session.dialogData.person = args.person
            }
            
            if(args && args.loopCount){
                session.dialogData.loopCount = args.loopCount
            }
            if (session.dialogData.loopCount>2){
                session.send("Sorry, I couldn't detect any employee id.")
                session.endDialogWithResult({empid:null,escalte:true})
            }else if (args && args.person == "other"){
                builder.Prompts.text(session,"Please enter other user's employee id")
            }else if(args && args.person == "myself"){
                builder.Prompts.text(session,"Please enter your employee id")
            }else{
                builder.Prompts.text(session,"Please enter the employee id")
            }
        },
        (session, args, next) =>{
            console.log(JSON.stringify(args))
            console.log("session.dialogData.loopCount = "+ session.dialogData.loopCount)
            var id = args.response
            var id = entity.parseEmployeeId(id)
            if(id.length == 1){
                session.endDialogWithResult({empid:id[0]})
            }else{
                session.replaceDialog('/askForEmployeeId',{loopCount:session.dialogData.loopCount+1})
            }
        }
    ])

    bot.dialog('/getTicketForEmpId',[
        (session,args)=>{
            var empid = args.empid
            session.send("Now I will show all the open ticket for user with empid = "+ empid)
            session.endDialog()
        }
    ])

   
};
