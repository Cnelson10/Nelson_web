package view;

// classes imported from java.sql.*
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.adPost.*;

// classes in my project
import dbUtils.*;

public class AdPostView {

    public static StringDataList allUsersAPI(DbConn dbc) {

        //PreparedStatement stmt = null;
        //ResultSet results = null;
        StringDataList sdl = new StringDataList();
        try {
            
            String sql = "SELECT ad_post_id, ad_name, make, model, year_manufactured, color, price, image_url, description, " +
                    "ad_post.web_user_id, user_email, user_password, membership_fee, birthday "+
                    "FROM ad_post, web_user WHERE ad_post.web_user_id = web_user.web_user_id " + 
                    "ORDER BY ad_post_id ";  // you always want to order by something, not just random order.
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();
            while (results.next()) {
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringData sd = new StringData();
            sd.errorMsg = "Exception thrown in adPostView.allUsersAPI(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }

}