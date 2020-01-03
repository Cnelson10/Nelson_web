<%@page contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%> 

<%@page language="java" import="dbUtils.*" %>
<%@page language="java" import="model.webUser.*" %> 
<%@page language="java" import="view.WebUserView" %> 
<%@page language="java" import="com.google.gson.*" %>

<%

    StringData loggedOnWebUser = (StringData) session.getAttribute("webUser");
    StringData nonLoggedOnWebUser = new StringData();
    StringDataList userData = new StringDataList();
    Gson gson = new Gson();
    
    if(loggedOnWebUser != null){
        userData.add(loggedOnWebUser);
        out.print(gson.toJson(loggedOnWebUser).trim());
    } else {
        nonLoggedOnWebUser.errorMsg = "No user logged on!";
        userData.add(nonLoggedOnWebUser);
        out.print(gson.toJson(nonLoggedOnWebUser).trim());
        System.out.println("No user logged on!");
    }

%>