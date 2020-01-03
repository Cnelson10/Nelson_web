package model.adPost;

import model.adPost.*;
import dbUtils.FormatUtils;
import java.sql.ResultSet;


/* The purpose of this class is just to "bundle together" all the 
 * character data that the user might type in when they want to 
 * add a new Customer or edit an existing customer.  This String
 * data is "pre-validated" data, meaning they might have typed 
 * in a character string where a number was expected.
 * 
 * There are no getter or setter methods since we are not trying to
 * protect this data in any way.  We want to let the JSP page have
 * free access to put data in or take it out. */
public class StringData {

    public String adPostId = "";
    public String adName = "";
    public String make = "";
    public String model = "";
    public String yearManufactured = "";
    public String color = "";
    public String price = "";
    public String imageUrl = "";
    public String description = "";
    public String webUserId = "";       // Foreign Key
    public String userEmail = "";       // getting it from joined web_user table.
    public String userPassword = "";    // getting it from joined web_user table.
    public String birthday = "";        // getting it from joined web_user table.
    public String membershipFee = "";   // getting it from joined web_user table.

    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData(ResultSet results) {
        try {
            this.adPostId = FormatUtils.formatInteger(results.getObject("ad_post_id"));
            this.adName = FormatUtils.formatString(results.getObject("ad_name"));
            this.make = FormatUtils.formatString(results.getObject("make"));
            this.model = FormatUtils.formatString(results.getObject("model"));
            this.yearManufactured = FormatUtils.formatYear(results.getObject("year_manufactured"));
            this.color = FormatUtils.formatString(results.getObject("color"));
            this.price = FormatUtils.formatDollar(results.getObject("price"));
            this.imageUrl = FormatUtils.formatString(results.getObject("image_url"));
            this.description = FormatUtils.formatString(results.getObject("description"));
            this.webUserId = FormatUtils.formatInteger(results.getObject("ad_post.web_user_id"));
            this.userEmail = FormatUtils.formatString(results.getObject("user_email"));
            this.userPassword = FormatUtils.formatString(results.getObject("user_password"));
            this.birthday = FormatUtils.formatDate(results.getObject("birthday"));
            this.membershipFee = FormatUtils.formatDollar(results.getObject("membership_fee"));
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.webUser.StringData (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.adPostId + this.adName + this.make + this.model + this.yearManufactured 
                + this.color + this.price + this.imageUrl + this.description + this.webUserId 
                + this.userEmail + this.userPassword + this.birthday + this.membershipFee;
        return s.length();
    }

    public String toString() {
        return "Ad Post Id: " + this.adPostId
                + ", Ad Name: " + this.adName
                + ", Make: " + this.make
                + ", Model: " + this.model
                + ", Year: " + this.yearManufactured
                + ", Color: " + this.color
                + ", Price: " + this.price
                + ", Image Url: " + this.imageUrl
                + ", Description: " + this.description
                + ", Web User Id: " + this.webUserId
                + ", User Email: " + this.userEmail
                + ", User Password: " + this.userPassword
                + ", Birthday: " + this.birthday
                + ", Membership Fee: " + this.membershipFee;
    }
}
