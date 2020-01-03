var makeSlideShow = {};

makeSlideShow.build = function(params){
    
    if (!params || !params.list || params.list.length < 1) {
        alert("Must supply input parameter object with 'list' property that holds an array with at least one element.");
        return;
    }
    
    var list = params.list;
    var target = params.target;
    if (!params.target) {
        alert("Must supply input parameter object with 'target' property " +
                "that references a valid DOM object (where HTML table is to be placed).");
        return;
    }
    var opacity = params.opacity || 1; // optional, if not supplied, no opacity applied. 
    var reverse = params.reverse || false; // optional property to pass in (default value is false)
    
    var slideShow = target;
    var div = document.createElement("div");
    div.id = "slideShow";
    slideShow.appendChild(div);
    
    var myImage = document.createElement("img");
    div.append(myImage);
    //myImage.src = list[0].image;
    if (list[0].image === null){
        myImage.src = "https://freeiconshop.com/wp-content/uploads/edd/car-outline-front-view.png";
    } else if(list[0].image === ""){
        myImage.src = "https://freeiconshop.com/wp-content/uploads/edd/car-outline-front-view.png";
    } else {
        myImage.src = list[0].image;
    }
    
    if(opacity !== 1){
        myImage.style.opacity = opacity;
    }
    
    if(reverse) {
        myImage.id = "reverse";
    }
    
    var myCaption = document.createElement("p");
    div.append(myCaption);
    myCaption.innerHTML = list[0].caption;
    
    // add back button under the image 
    var backButton = document.createElement("button");
    backButton.innerHTML = " &lt; ";
    slideShow.appendChild(backButton);
    
    // add forward button under the image 
    var fwdButton = document.createElement("button");
    fwdButton.innerHTML = " &gt; ";
    slideShow.appendChild(fwdButton);
    
    // private variable that keeps track of which image is showing
    var picNum = 0;
    
    // Advance to next image in the picture list
    function nextPic() {
        picNum++;
        if (picNum >= list.length) {
            picNum = 0;
        }
        // change the src attribute of the image element to the desired new image)				
        //myImage.src = list[picNum].image;
        if (list[picNum].image === null){
            myImage.src = "https://freeiconshop.com/wp-content/uploads/edd/car-outline-front-view.png";
        } else if(list[picNum].image === ""){
            myImage.src = "https://freeiconshop.com/wp-content/uploads/edd/car-outline-front-view.png";
        } else {
            myImage.src = list[picNum].image;
        }
        myCaption.innerHTML = list[picNum].caption;
    }
    
    // Go to the previous image in the picture list
    function prevPic() {
        picNum--;
        if (picNum < 0) {
            picNum = list.length - 1;
        }
        // change the src attribute of the image element to the desired new image)				
        //myImage.src = list[picNum].image;
        if (list[picNum].image === null){
            myImage.src = "https://freeiconshop.com/wp-content/uploads/edd/car-outline-front-view.png";
        } else if(list[picNum].image === ""){
            myImage.src = "https://freeiconshop.com/wp-content/uploads/edd/car-outline-front-view.png";
        } else {
            myImage.src = list[picNum].image;
        }
        myCaption.innerHTML = list[picNum].caption;
    }
    
    // add previous and back functionality to the previous and back buttons.
    backButton.onclick = prevPic;
    fwdButton.onclick = nextPic;
    
    // go: AUTO ADVANCE
    var intervalHandler;
    slideShow.go = function (intervalMillisecs) {
        intervalHandler = setInterval(nextPic, intervalMillisecs);
    };

    // goWithDelay: AUTO ADVANCE WITH DELAY
    slideShow.goWithDelay = function (intervalMillisecs, delayMillisecs) {
        setTimeout(function () {
            intervalHandler = setInterval(nextPic, intervalMillisecs);
        }, delayMillisecs);
    };

    // STOP AUTO ADVANCE
    slideShow.stop = function () {
        clearInterval(intervalHandler);
    };
    
    slideShow.makeFancy = function (target) {
        target.classList.add("fancy");
    };

    return slideShow;
};