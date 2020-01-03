var slideShow = {};

slideShow.list = function (targetId) {
    
    console.log(targetId);
    var slideShow1 = document.createElement("div");
    slideShow1.id = "slideShow1";
    
    var slideShow2 = document.createElement("div");
    slideShow2.id = "slideShow2";
    
    document.getElementById(targetId).innerHTML = "";
    document.getElementById(targetId).appendChild(slideShow1);
    document.getElementById(targetId).appendChild(slideShow2);
    
    ajax('webAPIs/listUsersAPI.jsp', 
        setSlideShow1UI,
        'slideShow1');
    
    function setSlideShow1UI(httpRequest) {
        
        console.log("starting slideCRUD.list (setSlideShow1UI) with this httpRequest object (next line)");
        console.log(httpRequest);
        
        var slide1List = JSON.parse(httpRequest.responseText);
        console.log(slide1List);
        if (slide1List === null) {
            document.getElementById("slideShow1").innerHTML = "slideCRUD.list Error: JSON string evaluated to null.";
            return;
        }
        var newSlide1List = [];
        for (var i = 0; i < slide1List.webUserList.length; i++) {
            var newUser = {
                caption: slide1List.webUserList[i].userEmail,
                image: slide1List.webUserList[i].image
            };
            newSlide1List[i] = newUser;
        }
        
        console.log(newSlide1List);
        var ss1 = makeSlideShow.build({
            list: newSlide1List,
            target: document.getElementById("slideShow1"),
            opacity: 0.5,
            reverse: true
        });

        //ss1.go(4000);
    }
    
    ajax('webAPIs/listAdPostsAPI.jsp', setSlideShow2UI, 'slideShow2');
    
    function setSlideShow2UI(httpRequest) {
        console.log("starting slideCRUD.list (setSlideShow2UI) with this httpRequest object (next line)");
        console.log(httpRequest);
        
        var slide2List = JSON.parse(httpRequest.responseText);
        if (slide2List === null) {
            document.getElementById("slideShow2").innerHTML = "slideCRUD.list Error: JSON string evaluated to null.";
            return;
        }
        var newSlide2List = [];
        for (var i = 0; i < slide2List.adPostList.length; i++) {
            var newPost = {
                caption: slide2List.adPostList[i].make + " " + slide2List.adPostList[i].model,
                image: slide2List.adPostList[i].imageUrl
            };
            newSlide2List[i] = newPost;
        }
        
        console.log(newSlide2List);
        var ss2 = makeSlideShow.build({
            list: newSlide2List,
            target: document.getElementById("slideShow2")
        });
        
        ss2.makeFancy(document.getElementById("slideShow2"));
        
        //ss2.goWithDelay(2000, 2000);
    };
};