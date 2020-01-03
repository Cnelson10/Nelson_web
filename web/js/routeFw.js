function routeFw(params) {

    var fw = {};

    var startingPath = params.startingPath || '/home';
    var contentId = params.contentId || "content";

    if (!params.routeArray || params.routeArray[0]) {
        alert("parameter object must specify array 'routeArray' with at least one element");
        return;
    }

    var routes = params.routeArray;
    
    console.log(routes);

    function router() {

        console.log("location.hash (the link that was clicked) is " + location.hash);
        
        var path = location.hash.slice(1) || '/';
        console.log('path (with no #) is ' + path);

        if (!routes[path]) {
            document.getElementById(contentId).innerHTML = "Error: link '" + path +
                    "' was never added to the routing.";
        } else {
            routes[path](contentId); 
        }
    }

    fw.printRoutes = function () {
        console.log("routes will be printed on the next line ");
        console.log(routes);
    };
    
    window.addEventListener('hashchange', router);

    window.location.hash = startingPath;

    return fw;
}