var companyList = new Array();

var newCompany;
var rowID;

function Company (name, city, province, website, phone, image, longitude, latitude) {
    this.name = name;
    this.city = city;
    this.province = province;
    this.website = website;
    this.province = province;
    this.phone = phone;
    this.image =  image;
    this.longitude = longitude;
    this.latitude = latitude;
}

function buildContent() {
    console.log("in build content");

    $("#menu").html("");
    for(var i = 0; i < companyList.length; i++) {
        $("#menu").append(
            "<div data-role='collapsible'>" +
                "<h3>" + companyList[i].name + "</h3>" +
                "<div class='ui-grid-c ui-responsive'>" +
                    "<section class='ui-block-a' id='maina'>" +
                        "<p>City: " + companyList[i].city + "</p>" +
                        "<p>Province: " + companyList[i].province + "</p>" +
                    "</section>" +
                    "<section class='ui-block-b' id='mainb'>" +
                        "<p>Website: <a href='" + companyList[i].website +
                        "' target='_blank'>" +
                        companyList[i].website + "</a></p>" +
                        "<p>Phone: " + companyList[i].phone + "</p>" +
                    "</section>" +
                    "<section class='ui-block-c' id='mainc'>" +
                        "<p><img src='_images/" + companyList[i].image +
                        "' width='60%'></p>" +
                    "</section>" +
                    "<section class='ui-block-d' id='maind'>" +
                        "<p><a a-id='" + i + "' href='#individual' class='ui-btn ui-btn-inline" +
                        "ui-corner-all ui-btn-icon-left ui-icon-location'>Map it!</a></p>" +
                    "</section>" +
                "</div>" +
            "</div>"
        );
    }
}


function buildFooter() {
    console.log("in build footer");
    $(".ft").html(
        "<nav data-role='navbar'>" +
            "<ul>" +
                "<li>" +
                    "<a href='#about' class='ui-btn ui-icon-about ui-btn-icon-top'>About</a>" +
                "</li>" +
                "<li>" +
                    "<a href='https://www.sheridancollege.ca/' class='ui-btn ui-icon-sheridan ui-btn-icon-top' target='_blank'>Sheridan College</a>" +
                "</li>" +
                "<li>" +
                    "<a href='http://www.ulta.com/' class='ui-btn ui-icon-ulta ui-btn-icon-top' target='_blank'>Ulta</a>" +
                "</li>" +
            "</ul>" +
        "</nav>"
    );
}


$(document).on("pagebeforecreate", "#home", function() {
    buildFooter();
    $.getJSON("companies.json", function(data) {
        console.log(data);

        var list = data.companies;

        for(var i = 0; i < list.length; i++)
        {
            var name = list[i].name;
            var city = list[i].city;
            var province = list[i].province;
            var website = list[i].website;
            var phone = list[i].phone;
            var image = list[i].image;
            var longitude = list[i].longitude;
            var latitude = list[i].latitude;

            newCompany = new Company(name, city,province, website, phone, image, longitude, latitude);
            companyList.push(newCompany);
        }

        buildContent();

        $("#menu").collapsibleset("refresh");
    });
});

$(document).on("click", "p >a", function() {
    rowID = $(this).closest("a").attr("a-id");
    console.log(rowID);
    $("#heading").html("");
});


$(document).on("pageshow", "#individual", function() {
    console.log("inside map page");

    $("#heading").append(companyList[rowID].name + " Location");


    if(navigator.geolocation) {
        var options = {
            enableHighAccuracy : true,
            timeout : 5000,      //how long to wait
            maximumAge: 0       //new location each time
        };
        navigator.geolocation.getCurrentPosition(success, fail, options);
        //.watchPosition - returns every time moved
    }
    else {
        alert("geo not supported");
    }
});

function fail (err) {
    alert("FAIL " + err.code + " - " + err.message);
}

function success(pos) {

    var lat = companyList[rowID].latitude;
    var lng = companyList[rowID].longitude;

    mapObject = new google.maps.LatLng(lat, lng);

    var mapOptions = {
        center: mapObject,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    //add a marker
    var icon = {
        url: "_images/" + companyList[rowID].image, // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    var s1 = new google.maps.Marker({
        position: mapObject,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: icon
    });


    // info windows
    var info = new google.maps.InfoWindow(
        {
            content: "<h3>HELLO</h3><img src='_images/'" + companyList[rowID].image> + "'>"
        }
    );

    google.maps.event.addListener(s1, "click", function() {
        info.open(map, s1);
    });

    s1.setTitle(companyList[rowID].name);
}


