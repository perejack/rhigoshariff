/* =========================================
   RHINGGO ENERGY - HOMEPAGE JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const mobileMenu = document.getElementById("mobileMenu");
const navMenu = document.getElementById("navMenu");

if (mobileMenu && navMenu) {

    mobileMenu.addEventListener("click", function () {

        navMenu.classList.toggle("show");

    });


    /* Close menu when a link is clicked */

    document.querySelectorAll(".nav-menu a").forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("show");

        });

    });

}


/* =========================================
   HERO VIDEO + IMAGE SLIDESHOW
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const video = document.getElementById("heroVideo");
    const slideshow = document.getElementById("heroSlideshow");
    const slides = document.querySelectorAll("#heroSlideshow .slide");

    if (!video || !slideshow || slides.length === 0) {
        console.log("Hero video or slideshow elements not found.");
        return;
    }

    let currentSlide = 0;
    let slideshowTimer = null;

    /* -----------------------------------------
       INITIAL STATE
    ----------------------------------------- */

    video.style.opacity = "1";
    slideshow.style.opacity = "0";

    slides.forEach(function (slide) {
        slide.classList.remove("active");
    });

    slides[0].classList.add("active");


    /* -----------------------------------------
       START IMAGE SLIDESHOW
    ----------------------------------------- */

    function startImageSlideshow() {

        console.log("Video finished - starting image slideshow");

        /* Hide video */
        video.style.opacity = "0";

        /* Show slideshow */
        slideshow.style.opacity = "1";

        /* Start from first image */
        currentSlide = 0;

        slides.forEach(function (slide) {
            slide.classList.remove("active");
        });

        slides[0].classList.add("active");


        /* Clear any previous timer */
        clearInterval(slideshowTimer);


        /* Change image every 4 seconds */

        slideshowTimer = setInterval(function () {

            /* Hide current image */
            slides[currentSlide].classList.remove("active");

            /* Move to next image */
            currentSlide++;


            /* -----------------------------------------
               ALL IMAGES FINISHED
            ----------------------------------------- */

            if (currentSlide >= slides.length) {

                clearInterval(slideshowTimer);

                /* Hide slideshow */
                slideshow.style.opacity = "0";

                /* Reset to first image */
                currentSlide = 0;

                slides.forEach(function (slide) {
                    slide.classList.remove("active");
                });

                slides[0].classList.add("active");


                /* -----------------------------------------
                   PLAY VIDEO AGAIN
                ----------------------------------------- */

                video.currentTime = 0;

                video.style.opacity = "1";

                video.play().catch(function (error) {
                    console.log("Video could not replay:", error);
                });

                return;
            }


            /* Show next image */
            slides[currentSlide].classList.add("active");

        }, 4000);

    }


    /* -----------------------------------------
       VIDEO FINISHED
    ----------------------------------------- */

    video.addEventListener("ended", function () {

        startImageSlideshow();

    });


    /* -----------------------------------------
       VIDEO ERROR
    ----------------------------------------- */

    video.addEventListener("error", function () {

        console.log("Video error - starting slideshow");

        startImageSlideshow();

    });


    /* -----------------------------------------
       START VIDEO
    ----------------------------------------- */

    video.play().catch(function (error) {

        console.log("Autoplay prevented:", error);

    });

});


/* =========================================
   HERO TEXT SLIDER
========================================= */

const heroInfoSlides =
    document.querySelectorAll(
        ".hero-info-slide"
    );


const heroButtons =
    document.querySelectorAll(
        ".hero-buttons"
    );


let currentHeroInfoSlide = 0;

let heroSlideTimer;

let heroSliderPaused = false;


/* =========================================
   NEXT TEXT SLIDE
========================================= */

function nextHeroSlide() {

    /* Don't change while hovering buttons */

    if (
        heroSliderPaused ||
        heroInfoSlides.length <= 1
    ) {

        return;

    }


    /* Hide current text */

    heroInfoSlides[
        currentHeroInfoSlide
    ].classList.remove("active");


    /* Move to next */

    currentHeroInfoSlide++;


    /* Return to first */

    if (
        currentHeroInfoSlide >=
        heroInfoSlides.length
    ) {

        currentHeroInfoSlide = 0;

    }


    /* Show next */

    heroInfoSlides[
        currentHeroInfoSlide
    ].classList.add("active");

}


/* =========================================
   START TEXT SLIDER
========================================= */

function startHeroTextSlider() {

    /* Clear previous timer */

    clearInterval(heroSlideTimer);


    /* Start timer */

    heroSlideTimer = setInterval(
        function () {

            nextHeroSlide();

        },
        5000
    );

}


/* =========================================
   PAUSE TEXT SLIDER
   ONLY WHEN HOVERING BUTTONS
========================================= */

heroButtons.forEach(function (button) {


    button.addEventListener(
        "mouseenter",
        function () {

            heroSliderPaused = true;

        }
    );


    button.addEventListener(
        "mouseleave",
        function () {

            heroSliderPaused = false;

        }
    );

});


/* =========================================
   START HERO TEXT SLIDER
========================================= */

if (
    heroInfoSlides.length > 0
) {

    /* Make sure first slide is active */

    heroInfoSlides.forEach(
        function (slide) {

            slide.classList.remove(
                "active"
            );

        }
    );


    heroInfoSlides[0]
        .classList.add("active");


    startHeroTextSlider();

}


/* =========================================
   DEBUG INFORMATION
========================================= */

console.log(
    "Rhinggo homepage JavaScript loaded"
);

console.log(
    "Hero slides:",
    slides.length
);

console.log(
    "Hero text slides:",
    heroInfoSlides.length
);

/* =========================================
   RHINGGO IMPACT NUMBER ANIMATION
========================================= */

const impactNumbers =
    document.querySelectorAll(".impact-number");

let impactAnimated = false;


function animateImpactNumbers() {

    if (impactAnimated) {
        return;
    }

    impactAnimated = true;


    impactNumbers.forEach(function (element) {

        const text = element.textContent.trim();

        /*
            Only animate values that contain
            a numerical value.
        */

        const match = text.match(/[\d,]+/);

        if (!match) {
            return;
        }


        const target =
            parseInt(
                match[0].replace(/,/g, ""),
                10
            );


        if (isNaN(target)) {
            return;
        }


        const suffix =
            text.substring(
                match[0].length
            );


        let current = 0;

        const duration = 1800;

        const startTime = performance.now();


        function updateNumber(currentTime) {

            const progress =
                Math.min(
                    (currentTime - startTime) /
                    duration,
                    1
                );


            /*
                Ease-out animation
            */

            const ease =
                1 - Math.pow(
                    1 - progress,
                    3
                );


            current =
                Math.floor(
                    target * ease
                );


            element.textContent =
                current.toLocaleString() +
                suffix;


            if (progress < 1) {

                requestAnimationFrame(
                    updateNumber
                );

            } else {

                element.textContent =
                    target.toLocaleString() +
                    suffix;

            }

        }


        requestAnimationFrame(
            updateNumber
        );

    });

}


/* =========================================
   START WHEN SECTION IS VISIBLE
========================================= */

const impactSection =
    document.querySelector(".rhinggo-impact");


if (impactSection) {

    const impactObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            animateImpactNumbers();

                            impactObserver.disconnect();

                        }

                    }
                );

            },
            {
                threshold: 0.25
            }
        );


    impactObserver.observe(
        impactSection
    );

}