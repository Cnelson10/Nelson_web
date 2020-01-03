<%@page import="view.WebUserView"%>
<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.adPost.*" %> 
<%@page language="java" import="view.AdPostView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%

    // default constructor creates nice empty StringDataList with all fields "" (empty string, nothing null).
    PostWithUsers postWithUsers = new PostWithUsers();

    String searchId = request.getParameter("id");
    if (searchId == null) {
        postWithUsers.adPost.errorMsg = "Cannot search for user - 'id' most be supplied";
    } else {

        DbConn dbc = new DbConn();
        postWithUsers.adPost.errorMsg = dbc.getErr(); // returns "" if connection is good, else db error msg.

        if (postWithUsers.adPost.errorMsg.length() == 0) { // if got good DB connection,

            System.out.println("*** Ready to call allUsersAPI");
            postWithUsers.adPost = DbMods.findById2(dbc, searchId); 
            
            postWithUsers.userInfo = WebUserView.allUsersAPI(dbc);
        }
        
        
        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(postWithUsers).trim());
%>