var makeTable = {};

makeTable.build = function (params) {

    function prettyColumnHeading(propName, toSort) {
        if (propName.length === 0) {
            return "";
        }
        
        var newHdg = "";
        if (toSort) {
            console.log(CRUD_icons.sort)
            var newHdg = "<img src='" + CRUD_icons.sort + "'/>";
            newHdg += " ";
        }// capitalize first letter
        newHdg += propName.charAt(0).toUpperCase();
        
        // iterate through all characters, inserting space before any capital letters.
        for (var i = 1; i < propName.length; i++) {
            if (propName.charAt(i) < "a") {
                newHdg += " ";
            }
            newHdg += propName.charAt(i);
        }
        return newHdg;
    } // end function prettyColumnHeading
    
    function align(tableData) { //right justify HTML table data (cell) if it contains a number

        var cellContent = tableData.innerHTML;
        if (cellContent.includes(".jpg") || cellContent.includes(".png")) {
            if (!cellContent.includes('icon')) {
                    tableData.innerHTML = "<img width='" + imgWidth + "' src='" + cellContent + "'>";
                    tableData.style.textAlign = "center";
            } 
        }
        if (!isNaN(cellContent) || // if numeric 
                ((cellContent.length > 0) && (cellContent.charAt(0) === "$"))) { // or dollar amt
            tableData.style.textAlign = "right";
        }
    } 
    
    function buildColHeadings(newTable, list) {

        // Create a header ("thead" DOM element) and attach the header to the table. 
        // Then put a rwo into the table header
        var tableHead = document.createElement("thead");
        newTable.appendChild(tableHead);
        var tableHeadRow = document.createElement("tr");
        tableHead.appendChild(tableHeadRow);

        // put first object (from array of objects) into a 
        // plain object (to avoid needing multi-dimensional array).
        // Extract property names from the object and use them 
        // as column headings.
        var data = list[0];
        for (var prop in data) {
            var tableHeadDetail = document.createElement("th");
            tableHeadRow.appendChild(tableHeadDetail);
            
            let isSortable = true;
            if (data[prop].includes('icons')) {
                isSortable = false;
            }
            
            tableHeadDetail.innerHTML = prettyColumnHeading(prop, isSortable);
            tableHeadDetail.sortOrder = prop; // add custom property to DOM element
            tableHeadDetail.sortReverse = false; // add custom property to DOM element

            if(isSortable){
                tableHeadDetail.onclick = function () {
                    // the keyword 'this' means the DOM element that was clicked.
                    makeTable.sort(list, this.sortOrder, this.sortReverse);
                    fillRows(newTable, list); // places sorted data from list into tbody of table.
                    this.sortReverse = !this.sortReverse;
                };
            }
        }
    } // buildColHeadings
    
    function isToShow(obj, searchKey) {
        if (!searchKey || searchKey.length === 0) {
            return true; // show the object if searchKey is empty
        }
        var searchKeyUpper = searchKey.toUpperCase();
        for (var prop in obj) {
            var propVal = obj[prop]; // associative array, using property name as if index. 
            var propValUpper = propVal.toUpperCase();
            if (propValUpper.includes(searchKeyUpper)) {
                return true;
            }
        }
        return false;
    } // isToShow
    
    function fillRows(newTable, list, searchValue) {

        // remove old tbody element if there is one 
        // (else you'll get sorted rows added to end of the rows already there).
        var oldBody = newTable.getElementsByTagName("tbody");
        if (oldBody[0]) {
            newTable.removeChild(oldBody[0]);
        }

        // create new tbody element and populate that with rows and cells. 
        var tableBody = document.createElement("tbody");
        newTable.appendChild(tableBody);

        for (var i in list) {
            var data = list[i];
            if (isToShow(data, searchValue)) {

                var tableRow = document.createElement("tr");
                tableBody.appendChild(tableRow);

                // "prop" iterates over the properties in object "data"
                for (var prop in data) {
                    var tableData = document.createElement("td");
                    tableRow.appendChild(tableData);
                    tableData.innerHTML = data[prop];
                    align(tableData); // I/O parameter
                }
            } // if isToShow...
        }
    } // fillRows
    
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

//    var sortIcon = params.sortIcon;
    var orderPropName = params.orderPropName || ""; // optional, if not supplied, no sort applied. 

    var reverse = params.reverse || false; // optional property to pass in (default value is false)

    var style = params.style || "dataList"; // optional, if not supplied apply class name "dataList"
    target.classList.add(style);
    
    var imgWidth = params.imgWidth || "50px";

    // list is like an I/O parameter. the order of elements in array list becomes changed.
    if (orderPropName && orderPropName.length > 0) {
        makeTable.sort(list, orderPropName, reverse);
        
    }

    // Create a new HTML table (DOM object) and append that into the page. 
    var newTable = document.createElement("table");

    if (params.searchKeyElem) {
        params.searchKeyElem.onkeyup = function () {
            fillRows(newTable, list, params.searchKeyElem.value);
        };
    }

    target.innerHTML = ""; // clear out any old content so replacing, not appending.
    target.appendChild(newTable);

    buildColHeadings(newTable, list);
    fillRows(newTable, list, ""); // add <tr> elements into the <tbody> of the <table>. Each <tr> is object from list.
    
}; // makeBuild.build

makeTable.convert = function (s) {

    if (!s || s.length === 0) {
        return -1;
    }

    // a string that holds a date returns true for isNaN(strDate) (it's not a number)  
    // And it returns false for isNaN(Date.parse(strDate))
    var parsedDate = Date.parse(s);
    if (isNaN(s) && !isNaN(parsedDate)) {
        return parsedDate;
    } else {
        var tmp = s;
        tmp = tmp.replace("$", ""); // remove dollar signs
        tmp = tmp.replace(",", ""); // remove commas
        if (isNaN(tmp)) { // if not a number, return what was passed in 
            return s.toUpperCase();
        } else {
            return Number(tmp);
        }
    }
}; // convert 

makeTable.compare = function (a, b, reverse) {

    // convert each 
    var aConverted = makeTable.convert(a);
    var bConverted = makeTable.convert(b);

    // dates and numbers sort best when null/empty values are represented as -1 (which is what convert already does)
    // but strings/images sort best when null/empty string are represented as "" (empty string)
    if (aConverted === -1 && isNaN(bConverted)) {
        aConverted = "";
    }
    if (bConverted === -1 && isNaN(aConverted)) {
        bConverted = "";
    }

    // come up with comparison value: 1, 0, or -1
    var comparison = 0;
    if (aConverted > bConverted) {
        comparison = 1;
    } else if (aConverted < bConverted) {
        comparison = -1;
    }
    
    if (reverse) {
        comparison = -comparison;
    }
    return comparison;
}; // compare 

makeTable.sort = function (list, byProperty, reverse) {

    // to use the built-in sort method that is available with every JS array, you must just provide 
    // (as input parameter to array.sort()) a compare function. This compare function must take 
    // two input args (both elements of the array you want to sort - name them as you wish). The compare 
    // function (anonymous function below) must output -1, 0, or 1 depending how the two array elements 
    // compare to each other. 

    // I am naming the list elements q and r just to show there's nothing magical about how you name the two array elements.  
    list.sort(function (q, r) {

        // using JS associative array notation (property name char string used inside square brackets 
        // as it if was an index value). Then pass that to the convert function (returns correct type not string).
        // q and r are objects, 
        // q[byProperty] and r[byProperty] are the value of the sort property of the two objects.
        return makeTable.compare(q[byProperty], r[byProperty], reverse);
    });
}; // sort