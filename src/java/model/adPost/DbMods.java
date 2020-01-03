package model.adPost;

import dbUtils.DbConn;
import dbUtils.PrepStatement;
import dbUtils.ValidationUtils;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DbMods {

    public static StringDataList findById (DbConn dbc, String id) {
        
        StringDataList sdl = new StringDataList();
        try {
            String sql = "SELECT ad_post_id, ad_name, make, model, year_manufactured, "
                    + "color, price, image_url, description, web_user_id "
                    + "FROM ad_post WHERE ad_post_id = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            stmt.setString(1, id);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in AdPostView.getUserById(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;

    } // getUserById
    
    public static StringData findById2(DbConn dbc, String id) {

        StringData sd = new StringData();
        try {
            String sql = "SELECT ad_post_id, ad_name, make, model, year_manufactured, "
                    + "color, price, image_url, description, web_user_id "
                    + "FROM ad_post WHERE ad_post_id = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            stmt.setString(1, id);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set
                sd = new StringData(results);
            } else {
                sd.errorMsg = "The database has no Ad Post Record with id " + id;
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.adPost.DbMods.findById2(): " + e.getMessage();
        }
        return sd;

    } // findById
    
    public static String delete(String postId, DbConn dbc) {

        if (postId == null) {
            return "Error in model.adPost.DbMods.delete: cannot delete ad_post record because 'postId' is null";
        }

        // This method assumes that the calling Web API (JSP page) has already confirmed 
        // that the database connection is OK. BUT if not, some reasonable exception should 
        // be thrown by the DB and passed back anyway... 
        String result = ""; // empty string result means the delete worked fine.
        try {

            String sql = "DELETE FROM ad_post WHERE ad_post_id = ?";

            // This line compiles the SQL statement (checking for syntax errors against your DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, postId);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                result = "Record not deleted - there was no record with web_user_id " + postId;
            } else if (numRowsDeleted > 1) {
                result = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            result = "Exception thrown in model.apPost.DbMods.delete(): " + e.getMessage();
        }

        return result;
    }
    
    private static StringData validate(StringData inputData) {
        
        StringData errorMsgs = new StringData();
        errorMsgs.adName = ValidationUtils.stringValidationMsg(inputData.adName, 45, true);
        errorMsgs.make = ValidationUtils.stringValidationMsg(inputData.make, 15, true);
        errorMsgs.model = ValidationUtils.stringValidationMsg(inputData.model, 15, false);
        errorMsgs.yearManufactured = ValidationUtils.yearValidationMsg(inputData.yearManufactured, 4, false);
        errorMsgs.color = ValidationUtils.stringValidationMsg(inputData.color, 15, false);
        errorMsgs.price = ValidationUtils.decimalValidationMsg(inputData.price, false);
        errorMsgs.description = ValidationUtils.stringValidationMsg(inputData.description, 150, false);
        errorMsgs.webUserId = ValidationUtils.integerValidationMsg(inputData.webUserId, true);

        return errorMsgs;
    }
    
    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /*
                  String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "+
                    "web_user.user_role_id, user_role_type "+
                    "FROM web_user, user_role where web_user.user_role_id = user_role.user_role_id " + 
                    "ORDER BY web_user_id ";
             */
            // Start preparing SQL statement
            String sql = "INSERT INTO ad_post (ad_name, make, model, year_manufactured, color, price, description, web_user_id) "
                    + "values (?,?,?,?,?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.adName); // string type is simple
            pStatement.setString(2, inputData.make);
            pStatement.setString(3, inputData.model);
            pStatement.setInt(4, ValidationUtils.integerConversion(inputData.yearManufactured));
            pStatement.setString(5, inputData.color);
            pStatement.setBigDecimal(6, ValidationUtils.decimalConversion(inputData.price));
            pStatement.setString(7, inputData.description);
            pStatement.setInt(8, ValidationUtils.integerConversion(inputData.webUserId));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Web User Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That ad name is already being used";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    }
    
    public static StringData update(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            String sql = "UPDATE ad_post SET ad_name=?, make=?, model=?, year_manufactured=?, color=?, price=?, description=?, "
                    + "web_user_id=? WHERE ad_post_id = ?";
            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.adName); // string type is simple
            pStatement.setString(2, inputData.make);
            pStatement.setString(3, inputData.model);
            pStatement.setInt(4, ValidationUtils.integerConversion(inputData.yearManufactured));
            pStatement.setString(5, inputData.color);        
            pStatement.setBigDecimal(6, ValidationUtils.decimalConversion(inputData.price));
            pStatement.setString(7, inputData.description);
            pStatement.setInt(8, ValidationUtils.integerConversion(inputData.webUserId));
            pStatement.setInt(9, ValidationUtils.integerConversion(inputData.adPostId));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were updated (expected to update one record).";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Ad Post Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That ad name is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update
    
} // class
