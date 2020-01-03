<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%

    // default constructor creates nice empty StringDataList with all fields "" (empty string, nothing null).
    StringData user = new StringData();

    String searchEmail = request.getParameter("email");
    String searchPw = request.getParameter("password");
    if (searchEmail == "" || searchPw == "") {
        user.errorMsg = "Cannot search for logonMsg - 'email' and 'password' must be supplied";
    } else {

        DbConn dbc = new DbConn();
        user.errorMsg = dbc.getErr(); // returns "" if connection is good, else db error msg.

        if (user.errorMsg.length() == 0) { // if got good DB connection,

            System.out.println("*** Ready to LogOn");
            user = DbMods.logonFind(searchEmail, searchPw, dbc); 
            if (user.errorMsg.length() == 0) {
                session.setAttribute ("webUser", user);
            }  
        }

        dbc.close(); // EVERY code path that opens a db connection, must also close it - no DB Conn leaks.
    }
    // This object (from the GSON library) can to convert between JSON <-> POJO (plain old java object) 
    Gson gson = new Gson();
    out.print(gson.toJson(user).trim());
%>