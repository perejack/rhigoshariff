/* =========================================
   RHINGGO LOCATIONS JAVASCRIPT
========================================= */


/* =========================================
   LOCATION DATA
========================================= */

const locations = [

    {
        city: "Nairobi",

        type: "both",

        lat: -1.4000,

        lng: 36.9500,

        address:
            "Mavoko Business Park, Mombasa Road, opposite Signature Mall",

        hours:
            "Mon–Sat: 8:30 AM – 5:30 PM",

        service:
            "Branch + Battery Swap Station",

        phone:
            "+254111393268"
    },


    {
        city: "Kisumu",

        type: "both",

        lat: -0.0917,

        lng: 34.7680,

        address:
            "Obote Road, next to KCB Kisumu West, opposite CMC Motors",

        hours:
            "Mon–Sat: 8:30 AM – 5:30 PM",

        service:
            "Branch + Battery Swap Station",

        phone:
            "+254792809855"
    },


    {
        city: "Mombasa",

        type: "both",

        lat: -4.0619,

        lng: 39.6682,

        address:
            "Ferry, opposite Likoni Towers",

        hours:
            "Mon–Sat: 8:30 AM – 5:30 PM",

        service:
            "Branch + Battery Swap Station",

        phone:
            "+254751722008"
    },


    {
        city: "Malindi",

        type: "both",

        lat: -3.2192,

        lng: 40.1169,

        address:
            "Near Mass Petrol Station, opposite Mogo Office",

        hours:
            "Mon–Sat: 8:30 AM – 5:30 PM",

        service:
            "Branch + Battery Swap Station",

        phone:
            "+254798393508"
    }

];


/* =========================================
   DOM ELEMENTS
========================================= */

const searchInput =
    document.getElementById("locationSearch");

const locationCards =
    document.querySelectorAll(".location-card");

const noResults =
    document.getElementById("noResults");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const findStationBtn =
    document.getElementById("findStationBtn");

const googleMap =
    document.querySelector(".google-map");


/* =========================================
   CURRENT FILTER
========================================= */

let currentFilter = "all";


/* =========================================
   FILTER LOCATIONS
========================================= */

function filterLocations() {

    const search =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    let visibleCount = 0;


    locationCards.forEach(function(card) {

        const city =
            (card.dataset.city || "")
                .toLowerCase();

        const type =
            (card.dataset.type || "")
                .toLowerCase();


        /* Search */

        const matchesSearch =
            city.includes(search);


        /* Filter */

        let matchesFilter = true;


        if (currentFilter === "branch") {

            matchesFilter =
                type === "branch" ||
                type === "both";

        }


        if (currentFilter === "swap") {

            matchesFilter =
                type === "swap" ||
                type === "both";

        }


        /* Show / hide */

        if (
            matchesSearch &&
            matchesFilter
        ) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    /* No results */

    if (noResults) {

        noResults.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }

}


/* =========================================
   SEARCH EVENT
========================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterLocations
    );

}


/* =========================================
   FILTER BUTTONS
========================================= */

filterButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            /* Remove active */

            filterButtons.forEach(
                function(btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            /* Add active */

            button.classList.add(
                "active"
            );


            /* Get filter */

            currentFilter =
                button.dataset.filter ||
                "all";


            /* Apply filter */

            filterLocations();

        }
    );

});


/* =========================================
   CALL STATION BUTTONS
========================================= */

locationCards.forEach(function(card) {

    const city =
        card.dataset.city;


    const location =
        locations.find(function(item) {

            return item.city.toLowerCase() ===
                city.toLowerCase();

        });


    if (!location) {
        return;
    }


    const directionButton =
        card.querySelector(".direction-btn");


    if (directionButton) {

        /*
            The old button said
            "Get Directions".

            We are changing it to
            "Call Station".
        */

        directionButton.textContent =
            "Call Office";


        /*
            Make the button call
            the station.
        */

        directionButton.href =
            "tel:" + location.phone;


        /*
            Do not open a new browser tab.
        */

        directionButton.removeAttribute(
            "target"
        );

        directionButton.removeAttribute(
            "rel"
        );

    }

});


/* =========================================
   VIEW BUTTONS
========================================= */

document
    .querySelectorAll(".view-btn")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const city =
                    button.dataset.location;


                showLocation(city);

            }
        );

    });


/* =========================================
   SHOW LOCATION
========================================= */

function showLocation(city) {

    const location =
        locations.find(function(item) {

            return item.city.toLowerCase() ===
                city.toLowerCase();

        });


    if (!location) {
        return;
    }


    /*
        Google My Maps is being used to display the locations on a map.
    */

    if (googleMap) {

        googleMap.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /*
        Highlight the selected card
    */

    locationCards.forEach(function(card) {

        card.classList.remove(
            "location-selected"
        );

    });


    const selectedCard =
        document.querySelector(
            '.location-card[data-city="' +
            city +
            '"]'
        );


    if (selectedCard) {

        selectedCard.classList.add(
            "location-selected"
        );

    }

}


/* =========================================
   FIND NEAREST STATION
========================================= */

if (findStationBtn) {

    findStationBtn.addEventListener(
        "click",
        function() {

            /*
                Check browser support
            */

            if (!navigator.geolocation) {

                alert(
                    "Location services are not supported by your browser."
                );

                return;

            }


            /*
                Change button text
            */

            findStationBtn.textContent =
                "Finding nearest station...";


            findStationBtn.disabled = true;


            /*
                Get visitor location
            */

            navigator.geolocation.getCurrentPosition(

                function(position) {

                    const userLat =
                        position.coords.latitude;


                    const userLng =
                        position.coords.longitude;


                    let nearest =
                        null;


                    let shortestDistance =
                        Infinity;


                    /*
                        Compare visitor position
                        with every RhingGo location.
                    */

                    locations.forEach(
                        function(location) {

                            const distance =
                                getDistance(
                                    userLat,
                                    userLng,
                                    location.lat,
                                    location.lng
                                );


                            if (
                                distance <
                                shortestDistance
                            ) {

                                shortestDistance =
                                    distance;

                                nearest =
                                    location;

                            }

                        }
                    );


                    /*
                        Display nearest location
                    */

                    if (nearest) {

                        showLocation(
                            nearest.city
                        );


                        alert(
                            "Nearest RhingGo location: " +
                            nearest.city +
                            "\n\n" +
                            nearest.address
                        );

                    }


                    /*
                        Restore button
                    */

                    findStationBtn.textContent =
                        "Find Nearest Station";

                    findStationBtn.disabled =
                        false;

                },


                function(error) {

                    let message =
                        "We couldn't access your location.";


                    if (
                        error.code ===
                        error.PERMISSION_DENIED
                    ) {

                        message =
                            "Location access was denied. Please allow location access in your browser.";

                    }


                    alert(message);


                    findStationBtn.textContent =
                        "Find Nearest Station";

                    findStationBtn.disabled =
                        false;

                },

                {
                    enableHighAccuracy: true,

                    timeout: 10000,

                    maximumAge: 300000

                }

            );

        }
    );

}


/* =========================================
   DISTANCE CALCULATION
========================================= */

function getDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius = 6371;


    const dLat =
        toRadians(
            lat2 - lat1
        );


    const dLon =
        toRadians(
            lon2 - lon1
        );


    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(
            toRadians(lat1)
        ) *

        Math.cos(
            toRadians(lat2)
        ) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;

}


function toRadians(degrees) {

    return degrees *
        Math.PI /
        180;

}


/* =========================================
   MOBILE MENU
========================================= */

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );

const mainNav =
    document.querySelector(
        ".main-nav"
    );


if (
    mobileMenu &&
    mainNav
) {

    mobileMenu.addEventListener(
        "click",
        function() {

            mainNav.classList.toggle(
                "mobile-show"
            );

        }
    );


    /*
        Close menu after clicking
        a navigation link.
    */

    mainNav
        .querySelectorAll("a")
        .forEach(function(link) {

            link.addEventListener(
                "click",
                function() {

                    mainNav.classList.remove(
                        "mobile-show"
                    );

                }
            );

        });

}


/* =========================================
   MOBILE NAV CSS
========================================= */

const mobileNavStyle =
    document.createElement("style");


mobileNavStyle.textContent = `

    @media (max-width: 800px) {

        .main-nav.mobile-show {

            display: flex;

            position: absolute;

            top: 78px;

            left: 0;

            width: 100%;

            padding: 15px;

            background: white;

            flex-direction: column;

            align-items: stretch;

            box-shadow:
                0 10px 25px
                rgba(0,0,0,.12);

            z-index: 999;

        }


        .main-nav.mobile-show a {


            text-align: center;

            padding: 12px;

        }

    }

`;


document.head.appendChild(
    mobileNavStyle
);


/* =========================================
   INITIAL FILTER
========================================= */

filterLocations();