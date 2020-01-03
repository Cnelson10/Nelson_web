var posts = {};

function my$(id) {
    return document.getElementById(id);
}

(function () { //IIFE, Immediately Invoked Function Expression
    posts.list = function(id) {
        var dataList = document.createElement("div");
        dataList.id = "dataList"; // set the id so it matches CSS styling rules in listStyle.css
        dataList.innerHTML = `
                        <h1 id="userHeading"> Ad Posts <a href="#/postUpload"><img src="icons/insert_H18.png" alt="insert icon"/></a> </h1>
                        <p>
                            Post Filter: <input id="postFilter" type="text"/>
                        </p>
                        `;
        dataList.innerHTML += "<h3 id='listMsg'></h3>";
        dataList.innerHTML += "<p>Click column headings to sort in ascending/decending order</p>";
        
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).appendChild(dataList);
        
        ajax2({
            url: 'webAPIs/listAdPostsAPI.jsp',
            successFn: setListUI,
            errorId: 'listMsg'
        });
        
        function setListUI(obj) {

            if (!obj) {
                document.getElementById("listMsg").innerHTML = "Http Request (from AJAX call) did not parse to an object.";
                return;
            }
            console.log(obj);

            var newPostList = [];
            for (var i = 0; i < obj.adPostList.length; i++) {
                
                var newPost = {
                    adName: obj.adPostList[i].adName,
                    postId: obj.adPostList[i].adPostId,
                    image: obj.adPostList[i].imageUrl,
                    year: obj.adPostList[i].yearManufactured,
                    makeAndModel: obj.adPostList[i].make + " " + obj.adPostList[i].model,
                    color: obj.adPostList[i].color,
                    price: obj.adPostList[i].price,
                    description: obj.adPostList[i].description,
                    userId: obj.adPostList[i].webUserId,
                    email: obj.adPostList[i].userEmail,
                    update: "<img src='" + CRUD_icons.update + "' alt='update icon' onclick='posts.updateUI(" +
                        obj.adPostList[i].adPostId + ", `" + id + "` )' />",
                    delete: "<img src='" + CRUD_icons.delete + "' alt='delete icon' onclick='posts.delete(" +
                        obj.adPostList[i].adPostId + ",this)'  />"
                };
                newPostList[i] = newPost;
            }
            makeTable.build({
                list: newPostList, 
                target: document.getElementById("listMsg"),
                orderPropName: "adName",
                reverse: false,
                searchKeyElem: document.getElementById("postFilter"),
                style: "dataList", 
                imgWidth: "50px"

            });   
        }
    };
    
    posts.delete = function (postId, icon) {
        if (confirm("Do you really want to delete ad post " + postId + "? ")) {
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
                url: "webAPIs/deletePostAPI.jsp?deleteId=" + postId,
                successFn: APISuccess,
                errorId: "content"
            });

            function APISuccess(obj) { // function is local to callDeleteAPI
                console.log("successful ajax call");
                // Empty string means sucessful delete. The HTML coder gets to decide how to 
                // deliver the good news.
                if (obj.errorMsg.length === 0) {
                    var msg = "Record " + postId + " successfully deleted. ";
                    console.log(msg);
                    dataTable.deleteRow(rowIndex);
                    alert(msg);
                } else {
                    console.log("Delete Post API got this error: "+ obj.errorMsg);
                    alert("Post API successfully called, but " +
                    "got this error from the Post API: <br/><br/>" + obj.errorMsg); 
                }
            }

            alert("Note: this version of the sample code DOES ACTUALLY invoke the delete Web API so row will NOT reappear when you refresh the data");
        }
    };
    
    function insertUpdatePostUI(isUpdate, targetId) {
        
        // set variables as if it will be insert...
        var adPostIdRowStyle = ' style="display:none" '; // hide row with webUserId
        var saveFnPost = "posts.insertSave()";
        
        // change variables for update
        if (isUpdate) {
            adPostIdRowStyle = ""; // don't hide row with webUserId 
            saveFnPost = "posts.updateSave()";
        }
      
        var html = `
        <div id="insertArea">
            <br/>
            <table>
                <tr ${adPostIdRowStyle}>
                    <td>Ad Post Id</td>
                    <td><input type="text"  id="adPostId" disabled /></td>
                    <td id="adPostIdError" class="error"></td> 
                </tr>
                <tr>
                    <td>Ad Name</td>
                    <td><input type="text"  id="adName" /></td>
                    <td id="adNameError" class="error"></td> 
                </tr>
                <tr>
                    <td>Make</td>
                    <td><input type="text"  id="make" /></td>
                    <td id="makeError" class="error"></td>
                </tr>
                <tr>
                    <td>Model</td>
                    <td><input type="text" id="model" /></td>
                    <td id="modelError" class="error"></td>
                </tr>
                <tr>
                    <td>Year</td>
                    <td><input type="text" id="yearManufactured" /></td>
                    <td id="yearManufacturedError" class="error"></td> 
                </tr>
                <tr>
                    <td>Color</td>
                    <td><input type="text" id="color" /></td>
                    <td id="colorError" class="error"></td> 
                </tr>
                <tr>
                    <td>Price</td>
                    <td><input type="text" id="price" /></td>
                    <td id="priceError" class="error"></td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td><textarea id="description" name="message" rows="10" cols="50"></textarea></td>
                    <td id="descriptionError" class="error"></td>
                </tr>
                <tr>
                    <td>Web User</td>
                    <td>
                        <select id="userPickList">
                            <!-- JS code will make ajax call to get all the roles 
                            then populate this select tag's options with those roles -->
                        </select>
                    </td>
                    <td id="webUserIdError" class="error"></td>
                </tr>
                <tr>
                    <td><button onclick="${saveFnPost}">Save</button></td>
                    <td id="recordError" class="error"></td>
                    <td></td>
                </tr>
            </table>
        </div>
        `;
        document.getElementById(targetId).innerHTML = html;
    };
    
    posts.updateUI = function (adPostId, targetId) {

        // This is needed to "reset" the application's perception of the "current" link. 
        // Otherwise, when the user tries to click on "user list" after doing a user list -> update
        // operation, there will be no response (because link would not change). 
        // Setting window.location.hash is like auto-clicking for the user (in code). 
        // But also in index.html, you have to add a routing rule for this link and associate 
        // it will a null function (a do nothing function) - to avoid a routing error.
        window.location.hash = "#/postUpdate";

        insertUpdatePostUI(true, targetId); // first param is isUpdate (boolean)
        ajax2({
            url: "webAPIs/getPostWithUsersAPI.jsp?id=" + adPostId,
            successFn: proceed,
            errorId: "ajaxError"
        });
        function proceed(obj) { // obj is what got JSON.parsed from Web API's output
            dbDataToUIPost(obj);
        }
    };
    
    function dbDataToUIPost(obj) {
        console.log(obj);
        var adPostObj = obj.adPost;
        var webUserList = obj.userInfo.webUserList;

        document.getElementById("adPostId").value = adPostObj.adPostId;
        document.getElementById("adName").value = adPostObj.adName;
        document.getElementById("make").value = adPostObj.make;
        document.getElementById("model").value = adPostObj.model;
        document.getElementById("yearManufactured").value = adPostObj.yearManufactured;
        document.getElementById("color").value = adPostObj.color;
        document.getElementById("price").value = adPostObj.price;
        document.getElementById("description").value = adPostObj.description;
        console.log("selected user id is " + adPostObj.webUserId);
        Utils.makePickList({
            id: "userPickList", // id of <select> tag in UI
            list: webUserList, // JS array that holds objects to populate the select list
            valueProp: "userEmail", // field name of objects in list that hold the values of the options
            keyProp: "webUserId", // field name of objects in list that hold the keys of the options
            selectedKey: "webUserId" // key that is to be pre-selected (optional)
        });
    };
    
    posts.insertUI = function (targetId) {

        insertUpdatePostUI(false, targetId); // first param is isUpdate (boolean)

        ajax2({
            url: "webAPIs/getUsersAPI.jsp",
            successFn: setUserPickList,
            errorId: "webUserIdError"
        });
    
        function setUserPickList(obj) {
            
            console.log("setUserPickList was called, see next line for object holding list of roles");
            console.log(obj);

            if(obj.dbError.length > 0) {
                document.getElementById("webUserIdError").innerHTML = obj.dbError;
                return;
            }

            Utils.makePickList({
               id: "userPickList",
               list: obj.webUserList,
               valueProp: "userEmail",
               keyProp: "webUserId"
            });

        }

    }; // posts.insertUI
    
    function getPostUploadFromUI() {
        var ddListPost = document.getElementById("userPickList");
        console.log("getUserDataFromUI");

        var postUploadObj = {

            "adPostId": document.getElementById("adPostId").value,
            "adName": document.getElementById("adName").value,
            "make": document.getElementById("make").value,
            "model": document.getElementById("model").value,
            "yearManufactured": document.getElementById("yearManufactured").value,
            "color": document.getElementById("color").value,
            "price": document.getElementById("price").value,
            "description": document.getElementById("description").value,
            
            "webUserId": ddListPost.options[ddListPost.selectedIndex].value,

            "errorMsg": ""
        };

        console.log(postUploadObj);
        return encodeURIComponent(JSON.stringify(postUploadObj));
    }
    
    function writeErrorObjToUIPost(jsonObj) {
        console.log("here is JSON object (holds error messages.");
        console.log(jsonObj);

        document.getElementById("adNameError").innerHTML = jsonObj.adName;
        document.getElementById("makeError").innerHTML = jsonObj.make;
        document.getElementById("modelError").innerHTML = jsonObj.model;
        document.getElementById("yearManufacturedError").innerHTML = jsonObj.yearManufactured;
        document.getElementById("colorError").innerHTML = jsonObj.color;
        document.getElementById("priceError").innerHTML = jsonObj.price;
        document.getElementById("descriptionError").innerHTML = jsonObj.description;
        document.getElementById("webUserIdError").innerHTML = jsonObj.webUserId;
        document.getElementById("recordError").innerHTML = jsonObj.errorMsg;

    }
    
    posts.insertSave = function () {

         console.log("posts.insertSave was called");
         var myPost = getPostUploadFromUI();

         ajax2({
            url: "webAPIs/insertPostAPI.jsp?jsonData=" + myPost,
            successFn: processInsert,
            errorId: "recordError"
         });

         function processInsert(jsonObj) {
             if (jsonObj.errorMsg.length === 0) {
                 jsonObj.errorMsg = "Record successfully inserted";
             }
             writeErrorObjToUIPost(jsonObj);
         }
    };
    
    posts.updateSave = function () {

        console.log("posts.updateSave was called");

        // create a user object from the values that the user has typed into the page.
        var myPost = getPostUploadFromUI();

        ajax2({
            url: "webAPIs/updatePostAPI.jsp?jsonData=" + myPost,
            successFn: processPostUpdate,
            errorId: "recordError"
        });




        function processPostUpdate(jsonObj) {

            // the server prints out a JSON string of an object that holds field level error 
            // messages. The error message object (conveniently) has its fiels named exactly 
            // the same as the input data was named. 

            if (jsonObj.errorMsg.length === 0) { // success
                jsonObj.errorMsg = "Record successfully updated!";
            }

            writeErrorObjToUIPost(jsonObj);
        }

    };
    

}()); // end of the IIFE