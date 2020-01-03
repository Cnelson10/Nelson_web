function blog(id) {

    var content = `  
      <h2>HW 1 Home Page</h2>
      <p>
        My web development experience consists of a couple weeks of messing around 
        with Free Code Camp.
      </p>
      <p>
        In this homework I learned about HTML, CSS, and how to publish a web page.
        The parts that I found easy were putting together the simple HTML and CSS 
        layout. 
        The part that I found more difficult was getting the dropdown menu working 
        correctly. 
      </p>
      <h2>HW 2 Databases</h2>
      <p>
        I have very minimal experience working with databases, I took a quick online 
        class on Lynda.com for SQL.
      </p>
      <p>
        To see my database work, click 
        <a href="js/components/3308_HW02_Databases.docx">here</a>.
      </p>
      <p>
        The part that I found easy was entering the data into the database. 
        The part that I found more challenging was setting up the foreign key. 
      </p>
      <h2>HW 2 Routing</h2>
      <p>
        In this homework I learned how to add interface reuse to my webpage by 
        adding JavaScript code that implements routing.
        The part of this assignment that I found easy was creating the separate 
        js file components that would be injected into the page when a link was 
        clicked. 
        The difficult part of the assignment was understanding the routing function.
      </p>
      <h2>HW 3 Web API</h2>
      <p>
        I have never written any server side database access code before this 
        assignment. In this homework I learned how to write a Web API that uses 
        Java/JSP code to display data from my database. I learned how to recognize 
        the common errors involved with this and how to handle them. 
      </p>
      <p>  
        The part that I found easy was generating the common errors when working 
        with JSP pages and learning what to look for such as syntax errors in the 
        SQL statement and data extraction errors from entering the wrong data type 
        for a formatting method in the constructor of our StringData class. To 
        see my work on generating these and other common errors when working with 
        JSP pages, click 
        <a href="js/components/3308_HW3.docx">here</a>.
      </p>
      <p>
        The part that I found hard/ confusing was trying to understand what all 
        the code was doing in the first JSP page we looked at.
      </p>
      <ul>
        <li>
          To invoke my User list Web API, click <a target="_blank" href="webAPIs/listUsersAPI.jsp" >here</a>.
        </li>
        <li>
          To invoke my Ad Post list Web API, click <a target="_blank" href="webAPIs/listAdPostsAPI.jsp" >here</a>.
        </li>
      </ul>
      <h2>HW 4 Display Data</h2>
      <p>  
        In this homework I learned how to write AJAX calls to make asynchronous 
        http requests to the Web APIs I made last week. After retrieving the 
        data, I manipulated the DOM by adding a table to the document and 
        populated the table with the information from my databases. 
      </p>
      <p>
        What I found easy in this project was creating and styling the table. 
        The difficult part of this assignment, in my opinion, was getting AJAX 
        to work with my Web APIs and also creating the table features, like 
        click sortable column headings and a search feature.
      </p>
      <h2>HW 5 JS</h2>
      <p>  
        In this homework I learned how to leverage JavaScript in order to create 
        a couple slide shows to display the images and some data from my user and 
        ad post (other) database. Similar to last week I used AJAX to make 
        asynchronous http requests to the Web APIs to retrieve data. After 
        retrieving the data, I manipulated the DOM by adding an image with a caption 
        (paragragh tag) and some buttons. I then used JS to put click listeners 
        on the buttons and gave the slideshow object I created methods that could 
        be envoked.
      </p>
      <p>
        What I found easy in this project was styling the slideshows with their 
        own stylesheet. The difficult part of this assignment, in my opinion, 
        was creating the makeSlideShow function that took in a list of parameters,
        some of which are optional.
      </p>
      <h2>HW 6 Logon</h2>
      <p>  
        In this homework I learned how to leverage Web APIs in order to create a 
        crude logon page that verifies email and password credentials from our 
        database, saves the session attributes so the logged on user my access a 
        profile page, and created a log off Web API to invalidate the logged on 
        session.
      </p>
      <p>
        What I found easy in this project was creating the web APIs and using 
        URL tampering in order to test the newly created logon, get profile and 
        log off APIs. The difficult part of this assignment, incorporating the 
        Web APIs into my existing web app. 
      </p>
      <p>
        Here are direct links to my Web APIs:
        <br/> <a href="http://localhost:8080/Nelson_web/webAPIs/logonAPI.jsp?email=chrisnelson@gmail.com&password=nelson1">Log On</a>
        <br/> <a href="http://localhost:8080/Nelson_web/webAPIs/getProfileAPI.jsp">Get Profile</a>
        <br/> <a href="http://localhost:8080/Nelson_web/webAPIs/logoffAPI.jsp">Log Off</a>
        <br/> <a href="http://localhost:8080/Nelson_web/webAPIs/listUsersAPI.jsp">Get All Users</a>
      </p>
      <h2>HW 7 Delete</h2>
      <p>  
        In this homework I learned how to use Web APIs to delete data from our 
        databases. I added a new "Delete" column in both my user table and ad 
        post table that included an 'x' icon. This icon had an onclick listener 
        which when activated called a delete function for the respective table 
        and proceeded to delete the data row from the database as well as delete 
        the row display in the table.
      </p>
      <p>
        The easy part of this project setting up the new Web APIs and the delete 
        functions for the user and ad post tables. The difficult portion of the 
        assignment was updating the UI, making sure the tables had the delete column 
        and making sure the row was deleted from the table when it was deleted 
        from the database.
      </p>
      <h2>HW 8 Insert</h2>
      <p>  
        In this homework I learned how to use Web APIs to insert new data into  
        my databases. I added a new "Insert" icon near the header of both my users
        and ad posts table. This icon had an onclick listener which brought up a 
        user interface with all of the fields that could be filled out for a new 
        user or ad post being inserted into the database. The I used validations 
        to ensure all the requirements for all fields being added into the table 
        were met (e.g. all emails or ad names were unique, all non-null fields 
        were populated and that length and input types were correct).
      </p>
      <p>
        The easy part of this project setting up the UIs for when a user clicked 
        on the insert icon on the user and ad post table. The difficult part was 
        the validations to check for correct input types, length requirements were 
        met, all non-null fileds were populated, etc.
      </p>
      <h2>HW 9 Update</h2>
      <p>  
        In this homework I learned how to use Web APIs to update existing data in  
        my databases. I added a new column in the table for an "Update" icon. 
        This icon had an onclick listener which brought up a user interface with
        all of the fields of the database that can be updated, prefilled with 
        the existing data for the record in which the update icon was pressed. 
        The I used validations to ensure all the requirements for all fields 
        being updated were met (e.g. all emails or ad names were unique, all non-
        null fields were populated and that length and input types were correct).
      </p>
      <p>
        The easy part of this project setting up the UIs for when a user clicked 
        on the update icon on the user and ad post table and prefilling it with 
        the existing data for that record. The difficult part was writing an 
        update method for the database modification code (DbMods). This required 
        validating the updated data, creating a SQL string and then encoding the 
        string values of the update data for the database into the proper 
        prepared statement and finally checking for errors. 
      </p>
    `;
    document.getElementById(id).innerHTML = content;
}

