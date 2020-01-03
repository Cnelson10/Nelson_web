var logon = {};

logon.UI = function(id) {
    
    console.log("logon.UI was called");

    var contentDOM = document.getElementById(id);
    var content = `
        <div class='logon'>
            <br/>
            Email Address <input type="text" id="emailId"/>
            &nbsp;
            Password <input type="text" id="passwordId"/>
            &nbsp;
            <input type="button" value="Submit" onclick="logon.ById('emailId', 'passwordId', 'msgArea')"/>
            <br/> <br/>
            <div id="msgArea"></div> 
        </div>
    `;
    contentDOM.innerHTML = content;
};

logon.ById = function (idOfEmail, idOfPassword, id) {

    console.log("logon.ById was called");

    // clear out any previous values in the target area
    var targetDOM = document.getElementById(id);
    targetDOM.innerHTML = "";
    
    var desiredEmailId = escape(document.getElementById(idOfEmail).value);
    var desiredPasswordId = escape(document.getElementById(idOfPassword).value);

    // the JS escape function cleans input so it can be used as a URL paramenter
    var logonUrl = "webAPIs/logonAPI.jsp?email=" + desiredEmailId + "&password=" + desiredPasswordId;
    console.log("logon.ById ready to invoke web API with this logon url: " + logonUrl);

    // Remember: getting a DB error does NOT mean ajax call unsuccessful. That is a secondary error after ajax call OK.
    ajax2({
        url: logonUrl,
        successFn: success,
        errorId: id
    });


    function success(obj) {

        // var obj = JSON.parse(hreq.responseText); // this already done by function ajax2...
        if (!obj) {
            targetDOM.innerHTML += "logon.ById (success private fn): Http Request (from AJAX call) did not parse to an object.";
            return;
        }
        console.log("logon.ById (success private fn): the obj passed in by ajax2 is on next line.");
        console.log(obj);

        if (obj.errorMsg.length > 0) {
            targetDOM.innerHTML += "Error: " + obj.errorMsg;
            return;
        } else {
            var msg = "Welcome Web User " + obj.webUserId;
            msg += "<br/>Birthday: " + obj.birthday;
            msg += "<br/>Membership Fee: " + obj.membershipFee;
            msg += "<br/>User Role: " + obj.userRoleId + " " + obj.userRoleType;
            msg += "<br/> <img src ='" +  obj.image + "'>";
            targetDOM.innerHTML = msg;  
        }

    } // end of function success
};  // users.findUI

logon.profileUI = function(id){
    
    console.log("logon.profileUI was called");
    
    var contentDOM = document.getElementById(id);
    var content = `
        <div class='logon'>
            <div id="msgArea"></div> 
        </div>
    `;
    contentDOM.innerHTML = content;
    
    ajax2({
        url: "webAPIs/getProfileAPI.jsp",
        successFn: success,
        errorId: "msgArea"
    });
    
    function success(obj) {
        targetDOM = document.getElementById("msgArea");
        targetDOM.innerHTML = "";
        
        // var obj = JSON.parse(hreq.responseText); // this already done by function ajax2...
        if (!obj) {
            targetDOM.innerHTML += "logon.profileUI (success private fn): Http Request (from AJAX call) did not parse to an object.";
            return;
        }
        console.log("logon.profileUI (success private fn): the obj passed in by ajax2 is on next line.");
        console.log(obj);

        if (obj.errorMsg.length > 0) {
            targetDOM.innerHTML += "Error: " + obj.errorMsg;
            return;
        } else {
            var msg = "User Profile for Web User: " + obj.webUserId;
            msg += "<br/>Birthday: " + obj.birthday;
            msg += "<br/>Membership Fee: " + obj.membershipFee;
            msg += "<br/>User Role: " + obj.userRoleId + " " + obj.userRoleType;
            msg += "<br/> <img src ='" +  obj.image + "'>";
            targetDOM.innerHTML = msg;  
        }

    }
    
};

logon.logoffUI = function(id) {
    
    console.log("logon.logoffUI was called");
    
    var contentDOM = document.getElementById(id);
    var content = `
        <div class='logon'>
            <div id="msgArea"></div> 
        </div>
    `;
    contentDOM.innerHTML = content;
    
    ajax('webAPIs/logoffAPI.jsp', success, 'msgArea');
    
    function success(obj) {
        targetDOM = document.getElementById("msgArea");
        targetDOM.innerHTML = "You have successfully Logged Off!";
    }
    
};