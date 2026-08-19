/* =====================================================
   MOBILE NAVIGATION
===================================================== */

const menuToggle =
    document.getElementById("menuToggle");

const mobileNavigation =
    document.getElementById("mobileNavigation");


menuToggle.addEventListener("click", function () {

    mobileNavigation.classList.toggle("active");


    const icon =
        menuToggle.querySelector("i");


    if (
        mobileNavigation.classList.contains("active")
    ) {

        icon.classList.remove("fa-bars");

        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");

    }

});



/* =====================================================
   CLOSE MOBILE MENU AFTER CLICK
===================================================== */

const mobileLinks =
    mobileNavigation.querySelectorAll("a");


mobileLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        mobileNavigation.classList.remove("active");


        const icon =
            menuToggle.querySelector("i");


        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");

    });

});



/* =====================================================
   CONTACT FORM
===================================================== */

const form =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");

const submitButton =
    form.querySelector(".submit-btn");



form.addEventListener("submit", function (event) {

    event.preventDefault();


    const firstName =
        document.getElementById("firstName")
        .value
        .trim();


    const lastName =
        document.getElementById("lastName")
        .value
        .trim();


    const phone =
        document.getElementById("phone")
        .value
        .trim();


    const email =
        document.getElementById("email")
        .value
        .trim();


    const location =
        document.getElementById("location")
        .value
        .trim();


    const interest =
        document.getElementById("interest")
        .value;


    const message =
        document.getElementById("message")
        .value
        .trim();



    /* =================================================
       REQUIRED FIELD VALIDATION
    ================================================= */

    if (
        !firstName ||
        !lastName ||
        !phone ||
        !email ||
        !location ||
        !interest ||
        !message
    ) {

        showMessage(
            "Please complete all required fields.",
            "error"
        );

        return;
    }



    /* =================================================
       EMAIL VALIDATION
    ================================================= */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        showMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }



    /* =================================================
       PHONE VALIDATION
    ================================================= */

    const phonePattern =
        /^[+0-9\s()-]{7,20}$/;


    if (!phonePattern.test(phone)) {

        showMessage(
            "Please enter a valid phone number.",
            "error"
        );

        return;
    }



    /* =================================================
       SUBMITTING
    ================================================= */

    submitButton.disabled = true;


    submitButton.querySelector("span")
        .textContent = "SENDING...";



    /* =================================================
       DEMO SUBMISSION

       Connect this to your backend/email service
       when you're ready.
    ================================================= */

    setTimeout(function () {


        showMessage(
            "Thank you! Your inquiry has been received. We will get back to you shortly.",
            "success"
        );


        form.reset();


        submitButton.disabled = false;


        submitButton.querySelector("span")
            .textContent = "SEND INQUIRY";


    }, 1200);

});



/* =====================================================
   FORM MESSAGE
===================================================== */

function showMessage(text, type) {

    formMessage.textContent = text;

    formMessage.classList.add("show");


    if (type === "error") {

        formMessage.style.background = "#fff2f2";

        formMessage.style.color = "#a33";

    } else {

        formMessage.style.background = "#f3f9e8";

        formMessage.style.color = "#547000";

    }


    setTimeout(function () {

        formMessage.classList.remove("show");

    }, 5000);

}