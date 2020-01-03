function home(id) {
    
    var content = ` 
        <image src = "pics/lincoln.jpg" id = "lincoln_img" />
        
        <p> 
        AutoLunacy is a collector car and street rod classified web site.
        We provide free photo ads for collector cars, street rods and
        collectible motorcycles and there are many collector cars,
        muscle cars, street rods, motorcycles and custom cars for sale
        on our site.
        </p>

        <p>
        All the cars for sale on this site belong to their owners - not
        to us.If you want more information about a car on this site
        please use the contact information in the ad.If the contact
        information in the ad is no longer current please let us know
        and we will remove the ad.
        </p>

        <p>
        Every ad on this site is reviewed and approved by a human who is
        knowledgeable about collector cars before it is posted, to
        ensure that the car is actually collectible and that the ad is
        not some kind of a scam.
        </p>

        <p>
        Welcome to our page.To navigate the site, click the links in the
        upper right - hand corner of this landing page.The 'Home' link will
        bring you back to this page, the 'Blog' link will take your to
        our blog page. Hover over the 'Ads' link for a drop down menu
        of more options. For more related content, please visit our sister
        site, <a id = "external_link" href = "http://americandreamcars.com" target = "blank"> American Dream Cars </a>,  
        for more great content on collector cars and street rods.
        </p>
    `;
    document.getElementById(id).innerHTML = content;
}
    