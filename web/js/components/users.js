var users = {};

function my$(id) {
    return document.getElementById(id);
}

(function () { //IIFE, Immediately Invoked Function Expression

    users.list = function(id) {

        var dataList = document.createElement("div");
        dataList.id = "dataList"; // set the id so it matches CSS styling rules in listStyle.css
        dataList.innerHTML = `
                        <h1 id="userHeading"> Web Users <a href="#/userRegister"><img src="icons/insert_H18.png" alt="insert icon"/></a> </h1>
                        <p>
                            User Filter: <input id="userFilter" type="text"/>
                        </p>`;
        dataList.innerHTML += "<h3 id='listMsg'></h3>";
        dataList.innerHTML += "<p>Click column headings to sort in ascending/descending order</p>";


        document.getElementById(id).innerHTML = "";
        document.getElementById(id).appendChild(dataList);

        ajax2({
            url: 'webAPIs/listUsersAPI.jsp',
            successFn: setListUI,
            errorId: 'listMsg'
        });

        function setListUI(obj) {

            if (!obj) {
                document.getElementById("listMsg").innerHTML = "Http Request (from AJAX call) did not parse to an object.";
                return;
            }
            console.log(obj);

            var newUserList = [];
            for (var i = 0; i < obj.webUserList.length; i++) {

                var newUser = {
                    userEmail: obj.webUserList[i].userEmail,
                    image: obj.webUserList[i].image,
                    userId: obj.webUserList[i].webUserId,
                    userPassword: obj.webUserList[i].userPassword,
                    birthday: obj.webUserList[i].birthday,
                    membershipFee: obj.webUserList[i].membershipFee,
                    userRole: obj.webUserList[i].userRoleId + " " + obj.webUserList[i].userRoleType,
                    update: "<img src='" + CRUD_icons.update + "' alt='update icon' onclick='users.updateUI(" +
                        obj.webUserList[i].webUserId + ", `" + id + "` )' />",
                    delete: "<img src='" + CRUD_icons.delete + "' alt='delete icon' onclick='users.delete(" +
                        obj.webUserList[i].webUserId + ",this)'  />"
                };
                newUserList[i] = newUser;
            }

            makeTable.build({
                list: newUserList, 
                target: document.getElementById("listMsg"),
                orderPropName: "userEmail",
                reverse: false,
                searchKeyElem: document.getElementById("userFilter"),
                style: "dataList",
                imgWidth: "50px"

            });
        }
    };

    users.findUI = function(id) {

        console.log("users.findUI was called");

        var contentDOM = document.getElementById(id);
        var content = `
            <div class='logon'>
                <br/>
                Enter Id <input type="text" id="findId"/>
                &nbsp;
                <input type="button" value="Submit" onclick="users.findById('findId','msgArea')"/>
                <br/> <br/>
                <div id="msgArea"></div> 
            </div>
        `;
        contentDOM.innerHTML = content;
    };

    users.findById = function (idOfInput, id) {

        console.log("users.findById was called");

        // clear out any previous values in the target area
        var targetDOM = document.getElementById(id);
        targetDOM.innerHTML = "";

        var desiredUserId = escape(document.getElementById(idOfInput).value);

        // the JS escape function cleans input so it can be used as a URL paramenter
        var myUrl = "webAPIs/getUserByIdAPI.jsp?URLid=" + desiredUserId;
        console.log("users.findById ready to invoke web API with this url: " + myUrl);

        // Remember: getting a DB error does NOT mean ajax call unsuccessful. That is a secondary error after ajax call OK.
        ajax2({
            url: myUrl,
            successFn: success,
            errorId: id
        });


        function success(obj) {

            // var obj = JSON.parse(hreq.responseText); // this already done by function ajax2...
            if (!obj) {
                targetDOM.innerHTML += "users.findById (success private fn): Http Request (from AJAX call) did not parse to an object.";
                return;
            }
            console.log("users.findById (success private fn): the obj passed in by ajax2 is on next line.");
            console.log(obj);

            if (obj.dbError.length > 0) {
                targetDOM.innerHTML += "Database Error Encountered: " + obj.dbError;
                return;
            } else if (obj.webUserList.length === 0 ) {
                targetDOM.innerHTML = "No Web User with id "+desiredUserId+" was found in the Database.";
            } else {
                var msg = "Found Web User " + obj.webUserList[0].webUserId;
                msg += "<br/> &nbsp; Birthday: " +  obj.webUserList[0].birthday;
                msg += "<br/> &nbsp; MembershipFee: " +  obj.webUserList[0].membershipFee;
                msg += "<br/> &nbsp; User Role: " +  obj.webUserList[0].userRoleId + " " +  obj.webUserList[0].userRoleType;
                msg += "<br/> <img src ='" +  obj.webUserList[0].image + "'>";
                targetDOM.innerHTML = msg;  
            }

        } // end of function success
    };  // users.findUI

    users.delete = function (userId, icon) {
        if (confirm("Do you really want to delete user " + userId + "? ")) {
            console.log("icon that was passed into JS function is printed on next line");
            console.log(icon);
            // icon's parent is cell whose parent is row
            var dataRow = icon.parentNode.parentNode;
            var rowIndex = dataRow.rowIndex - 1; // adjust for oolumn header row?
            var dataTable = dataRow.parentNode;

            // HERE YOU HAVE TO CALL THE DELETE API and the success function should run the 
            // following (delete the row that was clicked from the User Interface).

            // parameter properties needed for ajax call: url, successFn, and errorId
            ajax2({
                url: "webAPIs/deleteUserAPI.jsp?deleteId=" + userId,
                successFn: APISuccess,
                errorId: "content"
            });

            function APISuccess(obj) { // function is local to callDeleteAPI
                console.log("successful ajax call");
                // Empty string means sucessful delete. The HTML coder gets to decide how to 
                // deliver the good news.
                if (obj.errorMsg.length === 0) {
                    var msg = "Record " + userId + " successfully deleted. ";
                    console.log(msg);
                    dataTable.deleteRow(rowIndex);
                    alert(msg);
                } else {
                    console.log("Delete Web API got this error: "+ obj.errorMsg);
                    alert("Web API successfully called, but " +
                    "got this error from the Web API: <br/><br/>" + obj.errorMsg);
                }
            }



            alert("Note: this version of the sample code DOES ACTUALLY invoke the delete Web API so row will NOT reappear when you refresh the data");
        }

    };

    function insertUpdateUI(isUpdate, targetId) {
        
        // set variables as if it will be insert...
        var webUserIdRowStyle = ' style="display:none" '; // hide row with webUserId
        var saveFn = "users.insertSave()";
        
        // change variables for update
        if (isUpdate) {
            webUserIdRowStyle = ""; // don't hide row with webUserId 
            saveFn = "users.updateSave()";
        }
        
        var html = `
        <div id="insertArea">
            <br/>
            <table>
                <tr ${webUserIdRowStyle}>
                        <td>Web User Id</td>
                        <td><input type="text"  id="webUserId" disabled /></td>
                        <td id="webUserIdError" class="error"></td> 
                </tr>
                <tr>
                    <td>Email Address</td>
                    <td><input type="text"  id="userEmail" /></td>
                    <td id="userEmailError" class="error"></td> 
                </tr>
                <tr>
                    <td>Password</td>
                    <td><input type="password"  id="userPassword" /></td>
                    <td id="userPasswordError" class="error"></td>
                </tr>
                <tr>
                    <td>Retype Your Password</td>
                    <td><input type="password" id="userPassword2" /></td>
                    <td id="userPassword2Error" class="error"></td>
                </tr>
                <tr>
                    <td>Birthday</td>
                    <td><input type="text" id="birthday" /></td>
                    <td id="birthdayError" class="error"></td> 
                </tr>
                <tr>
                    <td>Membership Fee</td>
                    <td><input type="text" id="membershipFee" /></td>
                    <td id="membershipFeeError" class="error"></td>
                </tr>
                <tr>
                    <td>User Role</td>
                    <td>
                        <select id="rolePickList">
                        <!-- JS code will make ajax call to get all the roles 
                        then populate this select tag's options with those roles -->
                        </select>
                    </td>
                    <td id="userRoleIdError" class="error"></td>
                </tr>
                <tr>
                    <td><button onclick="${saveFn}">Save</button></td>
                    <td id="recordError" class="error"></td>
                    <td></td>
                </tr>
            </table>
        </div>
        `;
        document.getElementById(targetId).innerHTML = html;
    };

    users.updateUI = function (webUserId, targetId) {

        // This is needed to "reset" the application's perception of the "current" link. 
        // Otherwise, when the user tries to click on "user list" after doing a user list -> update
        // operation, there will be no response (because link would not change). 
        // Setting window.location.hash is like auto-clicking for the user (in code). 
        // But also in index.html, you have to add a routing rule for this link and associate 
        // it will a null function (a do nothing function) - to avoid a routing error.
        window.location.hash = "#/userUpdate";

        insertUpdateUI(true, targetId); // first param is isUpdate (boolean)
        ajax2({
            url: "webAPIs/getUserWithRolesAPI.jsp?id=" + webUserId,
            successFn: proceed,
            errorId: "ajaxError"
        });
        function proceed(obj) { // obj is what got JSON.parsed from Web API's output
            dbDataToUI(obj);
        }
    };
    
    function dbDataToUI(obj) {
        console.log(obj);
        var webUserObj = obj.webUser;
        var roleList = obj.roleInfo.roleList;
        

        document.getElementById("webUserId").value = webUserObj.webUserId;
        document.getElementById("userEmail").value = webUserObj.userEmail;
        document.getElementById("userPassword").value = webUserObj.userPassword;
        document.getElementById("userPassword2").value = webUserObj.userPassword;
        document.getElementById("birthday").value = webUserObj.birthday;
        document.getElementById("membershipFee").value = webUserObj.membershipFee;
        console.log("selected role id is " + webUserObj.userRoleId);
        Utils.makePickList({
            id: "rolePickList", // id of <select> tag in UI
            list: roleList, // JS array that holds objects to populate the select list
            valueProp: "userRoleType", // field name of objects in list that hold the values of the options
            keyProp: "userRoleId", // field name of objects in list that hold the keys of the options
            selectedKey: webUserObj.userRoleId  // key that is to be pre-selected (optional)
        });
    };
    
    users.insertUI = function (targetId) {

        insertUpdateUI(false, targetId); // first param is isUpdate (boolean)

        ajax2({
            url: "webAPIs/getRolesAPI.jsp",
            successFn: setRolePickList,
            errorId: "userRoleIdError"
        });

        function setRolePickList(jsonObj) {

            console.log("setRolePickList was called, see next line for object holding list of roles");
            console.log(jsonObj);

            if (jsonObj.dbError.length > 0) {
                document.getElementById("userRoleIdError").innerHTML = jsonObj.dbError;
                return;
            }

            Utils.makePickList({
                id: "rolePickList", // id of select tag on the page
                list: jsonObj.roleList, // JS array that holds the objects to populate the select tag
                valueProp: "userRoleType", // field name of objects in list that holds the values of the select tag options
                keyProp: "userRoleId"      // field name of objects in list that holds the keys of the options 
            });

        } // setRolePickList

    }; // users.insertUI

    function getUserDataFromUI() {

        var ddList = document.getElementById("rolePickList");
        console.log("getUserDataFromUI");

        var userInputObj = {

            "webUserId": document.getElementById("webUserId").value,
            "userEmail": document.getElementById("userEmail").value,
            "userPassword": document.getElementById("userPassword").value,
            "userPassword2": document.getElementById("userPassword2").value,
            "birthday": document.getElementById("birthday").value,
            "membershipFee": document.getElementById("membershipFee").value,

            "userRoleId": ddList.options[ddList.selectedIndex].value,

            "userRoleType": "",
            "errorMsg": ""
        };

        console.log(userInputObj);
        return encodeURIComponent(JSON.stringify(userInputObj));
    }

    function writeErrorObjToUI(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("userEmailError").innerHTML = jsonObj.userEmail;
        document.getElementById("userPasswordError").innerHTML = jsonObj.userPassword;
        document.getElementById("userPassword2Error").innerHTML = jsonObj.userPassword2;
        document.getElementById("birthdayError").innerHTML = jsonObj.birthday;
        document.getElementById("membershipFeeError").innerHTML = jsonObj.membershipFee;
        document.getElementById("userRoleIdError").innerHTML = jsonObj.userRoleId;
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;

    }

    users.insertSave = function () {

         console.log("users.insertSave was called");
         var myData = getUserDataFromUI();

         ajax2({
            url: "webAPIs/insertUserAPI.jsp?jsonData=" + myData,
            successFn: processInsert,
            errorId: "recordError"
         });

         function processInsert(jsonObj) {
             if (jsonObj.errorMsg.length === 0) {
                 jsonObj.errorMsg = "Record successfully inserted";
             }
             writeErrorObjToUI(jsonObj);
         }
    };
    
    users.updateSave = function () {

        console.log("users.updateSave was called");

        // create a user object from the values that the user has typed into the page.
        var myData = getUserDataFromUI();

        ajax2({
            url: "webAPIs/updateUserAPI.jsp?jsonData=" + myData,
            successFn: processUpdate,
            errorId: "recordError"
        });




        function processUpdate(jsonObj) {

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fiels named exactly 
            // the same as the input data was named. 

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully updated!";
            }

            writeErrorObjToUI(jsonObj);
        }

    };


}()); // end of the IIFE