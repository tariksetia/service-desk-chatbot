var builder = require('botbuilder')

module.exports = {
    incidentCard: (session,inc)=>{
        return new builder.Message(session).addAttachment(incidentCardJson(inc))
    },
    cardList: (cards) =>{
        return new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
    }
}


var incidentCardJson = function (incident) {
    return {
            "contentType" : "application/vnd.microsoft.card.adaptive",
            "content" : {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": incident.number,
                                        "horizontalAlignment": "left",
                                        "isSubtle": true
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": states[incident.state],
                                        "horizontalAlignment": "left",
                                        "spacing": "none",
                                        "color" : 'accent',
                                        "size": "large",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "separator":"true",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": incident.short_description,
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "ColumnSet",
                        "spacing": "medium",
                        "separator": true,
                        "columns": [
                            {
                                "type": "Column",
                                "width": 1,
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Priority",
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Assigned To",
                                        "spacing": "small"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Created",
                                        "spacing": "small"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Last Updated",
                                        "spacing": "small"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": 1,
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": priority[incident.priority]
                                    
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": getAssignee(incident.assigned_to),
                                        "spacing": "small"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": incident.sys_created_on,
                                        "spacing": "small"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": incident.sys_updated_on,
                                        "spacing": "small"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.OpenUrl",
                        "title": "View",
                        "url": getUrl(incident.sys_id)
                    }
                ]
            }
        }
       
}

var getStatus = (state) => {
    if (state == ''){
        return 'Not Available';
    }else{
        return state;
    }
};

var getAssignee = (assignee) => {
    
    return assignee == '' ? 'Unassigned':assignee; 

}
var getUrl = (sys_id) => {
    return "https://dev12965.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%" + sys_id;
};

var states = {
    '1' :  'New',
    '2' : 'Assigned',
    '12' : 'Referred',
    '4' : 'Awaiting User Info',
    '5' : 'Awaiting Evidence',
    '10' : 'Awaiting Change',
    '8' : 'Awaiting Vendor',
    '11' : 'Awaiting Vendor Change',
    '6' : 'Resolved',
    '7' : 'Closed'
}

var priority = {
    '1' : 'Critical',
    '2' : 'High',
    '3' : 'Moderate',
    '4' : 'Low',
    '5' : 'Planning'
}