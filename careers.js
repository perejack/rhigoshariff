/* =========================================================
   RHINGGO ENERGY
   CAREERS PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const mobileMenu =
    document.getElementById("mobileMenu");

const navMenu =
    document.getElementById("navMenu");


if (mobileMenu && navMenu) {

    mobileMenu.addEventListener(
        "click",
        function () {

            navMenu.classList.toggle("show");

            const icon =
                mobileMenu.querySelector("i");

            if (
                navMenu.classList.contains("show")
            ) {

                icon.classList.remove(
                    "fa-bars"
                );

                icon.classList.add(
                    "fa-xmark"
                );

            } else {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );

            }

        }
    );


    document
        .querySelectorAll(".nav-menu > li > a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <= 850
                    ) {

                        navMenu.classList.remove(
                            "show"
                        );

                        const icon =
                            mobileMenu.querySelector("i");

                        icon.classList.remove(
                            "fa-xmark"
                        );

                        icon.classList.add(
                            "fa-bars"
                        );

                    }

                }
            );

        });

}




/* =========================================================
   JOB BOARD
   SEARCH + FILTERS + DYNAMIC COUNT + CV UPLOAD
========================================================= */

const jobSearch = document.getElementById("jobSearch");
const departmentFilter = document.getElementById("departmentFilter");
const locationFilter = document.getElementById("locationFilter");
const searchJobs = document.getElementById("searchJobs");
const jobsContainer = document.getElementById("jobsContainer");
const jobsCount = document.getElementById("jobsCount");
const noResults = document.getElementById("noResults");
const jobCards = Array.from(document.querySelectorAll(".job-card"));


function filterJobs() {

    const searchValue = jobSearch
        ? jobSearch.value.toLowerCase().trim()
        : "";

    const departmentValue = departmentFilter
        ? departmentFilter.value
        : "all";

    const locationValue = locationFilter
        ? locationFilter.value
        : "all";

    let visibleJobs = 0;


    jobCards.forEach(function (job) {

        const title =
            (job.dataset.title || "").toLowerCase();

        const department =
            (job.dataset.department || "").toLowerCase();

        const location =
            (job.dataset.location || "").toLowerCase();

        const content =
            job.textContent.toLowerCase();

        const matchesSearch =
            !searchValue ||
            title.includes(searchValue) ||
            department.includes(searchValue) ||
            location.includes(searchValue) ||
            content.includes(searchValue);

        const matchesDepartment =
            departmentValue === "all" ||
            department === departmentValue;

        const matchesLocation =
            locationValue === "all" ||
            location === locationValue;

        const shouldShow =
            matchesSearch &&
            matchesDepartment &&
            matchesLocation;

        job.classList.toggle(
            "is-hidden",
            !shouldShow
        );

        if (shouldShow) {
            visibleJobs++;
        }

    });


    if (jobsCount) {

        jobsCount.textContent =
            `${visibleJobs} ${visibleJobs === 1 ? "OPEN JOB" : "OPEN JOBS"}`;

    }


    if (noResults) {

        noResults.style.display =
            visibleJobs === 0 ? "block" : "none";

    }


    if (jobsContainer) {

        jobsContainer.style.display =
            visibleJobs === 0 ? "none" : "grid";

    }

}


if (searchJobs) {

    searchJobs.addEventListener(
        "click",
        filterJobs
    );

}


if (jobSearch) {

    jobSearch.addEventListener(
        "input",
        filterJobs
    );

}


if (departmentFilter) {

    departmentFilter.addEventListener(
        "change",
        filterJobs
    );

}


if (locationFilter) {

    locationFilter.addEventListener(
        "change",
        filterJobs
    );

}


/* =========================================================
   SHOW / HIDE FILTERS
========================================================= */

const showFilters =
    document.getElementById("showFilters");

const jobsFilterPanel =
    document.getElementById("jobsFilterPanel");


function toggleFilters() {

    if (!jobsFilterPanel || !showFilters) {
        return;
    }

    const isOpen =
        jobsFilterPanel.classList.toggle("show");

    showFilters.textContent =
        isOpen ? "HIDE FILTERS" : "SHOW FILTERS";

}


if (showFilters) {

    showFilters.addEventListener(
        "click",
        toggleFilters
    );

}


/* =========================================================
   COUNTRY BUTTON
   Opens the location filter and focuses it.
========================================================= */

const countryButton =
    document.getElementById("countryButton");


if (countryButton) {

    countryButton.addEventListener(
        "click",
        function () {

            if (jobsFilterPanel) {

                jobsFilterPanel.classList.add("show");

            }

            if (showFilters) {

                showFilters.textContent =
                    "HIDE FILTERS";

            }

            countryButton.classList.add("active");
            countryButton.setAttribute(
                "aria-expanded",
                "true"
            );

            if (locationFilter) {

                locationFilter.focus();

            }

        }
    );

}


/* =========================================================
   FAVORITE JOBS
========================================================= */

document
    .querySelectorAll(".job-favorite")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const icon =
                    button.querySelector("i");

                if (!icon) {
                    return;
                }

                icon.classList.toggle("fa-regular");
                icon.classList.toggle("fa-solid");

                button.classList.toggle("saved");

            }
        );

    });


/* =========================================================
   CV UPLOAD + APPLICATION
========================================================= */

const cvUploadButton =
    document.getElementById("cvUploadButton");

const cvFileInput =
    document.getElementById("cvFileInput");

const selectedCV =
    document.getElementById("selectedCV");

const cvFileName =
    document.getElementById("cvFileName");

const applicationForm =
    document.getElementById("applicationForm");

const applicationCV =
    document.getElementById("applicationCV");

const applicationCVButton =
    document.getElementById("applicationCVButton");

const applicationCVName =
    document.getElementById("applicationCVName");

const applicationJob =
    document.getElementById("applicationJob");

const applicationSubmit =
    document.getElementById("applicationSubmit");

const applicationStatus =
    document.getElementById("applicationStatus");

let selectedCVFile = null;
let selectedJob = "";

const MAX_CV_SIZE = 5 * 1024 * 1024;
const ALLOWED_CV_EXTENSIONS = ["pdf", "doc", "docx"];


function getFileExtension(file) {

    return file.name
        .split(".")
        .pop()
        .toLowerCase();

}


function validateCV(file) {

    if (!file) {
        return "Please select a CV.";
    }

    const extension = getFileExtension(file);

    if (!ALLOWED_CV_EXTENSIONS.includes(extension)) {
        return "Please upload your CV as a PDF, DOC or DOCX file.";
    }

    if (file.size > MAX_CV_SIZE) {
        return "Your CV must be smaller than 5 MB.";
    }

    return "";
}


function setSelectedCV(file) {

    const error = validateCV(file);

    if (error) {
        alert(error);
        return false;
    }

    selectedCVFile = file;

    if (cvFileName) {
        cvFileName.textContent = file.name;
    }

    if (selectedCV) {
        selectedCV.classList.add("show");
    }

    if (cvUploadButton) {
        cvUploadButton.classList.add("has-cv");
    }

    if (applicationCVName) {
        applicationCVName.textContent = file.name;
    }

    /* Keep the application form's file input synchronized. */
    if (applicationCV) {

        try {

            const transfer = new DataTransfer();
            transfer.items.add(file);
            applicationCV.files = transfer.files;

        } catch (error) {
            console.warn("Could not synchronize CV input.", error);
        }

    }

    return true;
}


/* TOP CV BUTTON */

if (cvUploadButton && cvFileInput) {

    cvUploadButton.addEventListener("click", function () {
        cvFileInput.click();
    });

}


if (cvFileInput) {

    cvFileInput.addEventListener("change", function () {

        const file = cvFileInput.files[0];

        if (file) {
            setSelectedCV(file);
        }

    });

}


/* APPLICATION CV BUTTON */

if (applicationCVButton && applicationCV) {

    applicationCVButton.addEventListener("click", function () {
        applicationCV.click();
    });

}


if (applicationCV) {

    applicationCV.addEventListener("change", function () {

        const file = applicationCV.files[0];

        if (file) {
            setSelectedCV(file);
        }

    });

}


/* =========================================================
   JOB SELECTION
========================================================= */

const jobButtons =
    document.querySelectorAll(".job-button");

const selectedJobNotice =
    document.getElementById("selectedJobNotice");

const applicationSection =
    document.getElementById("apply");


function selectJob(job) {

    selectedJob = job || "";

    if (applicationJob) {
        applicationJob.value = selectedJob;
    }

    if (selectedJobNotice) {

        selectedJobNotice.classList.add("has-job");

        selectedJobNotice.innerHTML =
            `<i class="fa-solid fa-briefcase"></i>` +
            `<span>Applying for: <strong>${escapeHTML(selectedJob)}</strong>` +
            `${selectedCVFile ? ` • CV: <strong>${escapeHTML(selectedCVFile.name)}</strong>` : ""}` +
            `</span>`;

    }

}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


jobButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        selectJob(
            button.dataset.job || "Selected position"
        );

        if (applicationSection) {

            setTimeout(function () {

                applicationSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 50);

        }

    });

});


/* =========================================================
   APPLICATION SUBMISSION
========================================================= */

if (applicationForm) {

    applicationForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!selectedJob) {

            applicationStatus.textContent =
                "Please select a job before submitting your application.";

            applicationStatus.className =
                "application-status error";

            document.getElementById("open-positions")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }

        if (!selectedCVFile) {

            applicationStatus.textContent =
                "Please upload your CV before submitting.";

            applicationStatus.className =
                "application-status error";

            applicationCVButton?.focus();

            return;
        }

        const cvError = validateCV(selectedCVFile);

        if (cvError) {

            applicationStatus.textContent = cvError;
            applicationStatus.className = "application-status error";
            return;
        }

        if (!applicationForm.checkValidity()) {

            applicationForm.reportValidity();
            return;
        }

        const formData = new FormData(applicationForm);

        /* Explicitly append the selected CV. */
        formData.delete("cv");
        formData.append("cv", selectedCVFile, selectedCVFile.name);
        formData.set("job", selectedJob);

        applicationSubmit.disabled = true;
        applicationSubmit.innerHTML =
            `SUBMITTING... <i class="fa-solid fa-spinner fa-spin"></i>`;

        applicationStatus.textContent =
            "Sending your application...";

        applicationStatus.className =
            "application-status";

        try {

            let response = await fetch("/api/apply", {
                method: "POST",
                body: formData
            });

            if (response.status === 404) {
                // Fallback for local/traditional PHP environments
                response = await fetch("apply.php", {
                    method: "POST",
                    body: formData
                });
            }

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to submit application."
                );
            }

            applicationStatus.textContent =
                result.message;

            applicationStatus.className =
                "application-status success";

            applicationForm.reset();

            selectedJob = "";
            selectedCVFile = null;

            if (applicationJob) {
                applicationJob.value = "";
            }

            if (selectedCV) {
                selectedCV.classList.remove("show");
            }

            if (cvUploadButton) {
                cvUploadButton.classList.remove("has-cv");
            }

            if (cvFileName) {
                cvFileName.textContent = "No CV selected";
            }

            if (applicationCVName) {
                applicationCVName.textContent = "No CV selected";
            }

            if (selectedJobNotice) {

                selectedJobNotice.classList.remove("has-job");

                selectedJobNotice.innerHTML =
                    `<i class="fa-solid fa-circle-check"></i>` +
                    `<span>Application submitted successfully.</span>`;

            }

        } catch (error) {

            console.error(error);

            applicationStatus.textContent =
                error.message ||
                "We could not submit your application. Please try again.";

            applicationStatus.className =
                "application-status error";

        } finally {

            applicationSubmit.disabled = false;

            applicationSubmit.innerHTML =
                `SUBMIT APPLICATION <i class="fa-solid fa-arrow-right"></i>`;

        }

    });

}


/* =========================================================
   INITIAL JOB COUNT
========================================================= */

filterJobs();


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "Rhinggo Careers page loaded successfully."
);

/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqItems =
    document.querySelectorAll(
        ".faq-item"
    );


faqItems.forEach(function (item) {


    const question =
        item.querySelector(
            ".faq-question"
        );


    const answer =
        item.querySelector(
            ".faq-answer"
        );


    question.addEventListener(
        "click",
        function () {


            const isOpen =
                item.classList.contains(
                    "active"
                );


            /*
                Close all FAQ items
            */

            faqItems.forEach(
                function (otherItem) {

                    otherItem.classList.remove(
                        "active"
                    );

                    const otherAnswer =
                        otherItem.querySelector(
                            ".faq-answer"
                        );

                    otherAnswer.style.maxHeight =
                        null;

                }
            );


            /*
                Open selected item
            */

            if (!isOpen) {

                item.classList.add(
                    "active"
                );

                answer.style.maxHeight =
                    answer.scrollHeight +
                    "px";

            }

        }
    );

});



/* =========================================================
   STATISTICS COUNTER
========================================================= */

const statNumbers =
    document.querySelectorAll(
        ".stat-number"
    );


let statsAnimated = false;



function animateStats() {


    if (statsAnimated) {

        return;

    }


    statsAnimated = true;


    statNumbers.forEach(
        function (element) {


            const target =
                parseInt(
                    element.dataset.target,
                    10
                );


            const suffix =
                element.dataset.suffix ||
                "";


            let current = 0;


            const duration =
                1800;


            const startTime =
                performance.now();


            function updateCounter(
                currentTime
            ) {


                const progress =
                    Math.min(
                        (
                            currentTime -
                            startTime
                        ) / duration,
                        1
                    );


                /*
                    Ease out
                */

                const ease =
                    1 -
                    Math.pow(
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
                        updateCounter
                    );

                } else {

                    element.textContent =
                        target.toLocaleString() +
                        suffix;

                }

            }


            requestAnimationFrame(
                updateCounter
            );

        }
    );

}



/* =========================================================
   STATS INTERSECTION OBSERVER
========================================================= */

const statsSection =
    document.querySelector(
        ".career-stats"
    );


if (statsSection) {


    const statsObserver =
        new IntersectionObserver(
            function (entries) {


                entries.forEach(
                    function (entry) {


                        if (
                            entry.isIntersecting
                        ) {


                            animateStats();


                            statsObserver.disconnect();


                        }

                    }
                );

            },
            {
                threshold: 0.25
            }
        );


    statsObserver.observe(
        statsSection
    );

}



/* =========================================================
   EMPLOYEE STORY SLIDER
========================================================= */

const storiesTrack =
    document.getElementById(
        "storiesTrack"
    );


const storyCards =
    document.querySelectorAll(
        ".story-card"
    );


const prevStory =
    document.getElementById(
        "prevStory"
    );


const nextStory =
    document.getElementById(
        "nextStory"
    );


const storyDots =
    document.querySelectorAll(
        ".story-dot"
    );


let currentStory = 0;



function getStoryPosition() {


    if (
        window.innerWidth <= 850
    ) {

        return 100;

    }


    return 50;

}



function updateStorySlider() {


    if (!storiesTrack) {

        return;

    }


    const position =
        getStoryPosition();


    storiesTrack.style.transform =
        "translateX(-" +
        (currentStory * position) +
        "%)";


    storyDots.forEach(
        function (dot, index) {

            dot.classList.toggle(
                "active",
                index === currentStory
            );

        }
    );

}



if (nextStory) {

    nextStory.addEventListener(
        "click",
        function () {


            currentStory++;


            if (
                currentStory >=
                storyCards.length
            ) {

                currentStory = 0;

            }


            updateStorySlider();

        }
    );

}



if (prevStory) {

    prevStory.addEventListener(
        "click",
        function () {


            currentStory--;


            if (
                currentStory < 0
            ) {

                currentStory =
                    storyCards.length - 1;

            }


            updateStorySlider();

        }
    );

}



storyDots.forEach(
    function (dot, index) {


        dot.addEventListener(
            "click",
            function () {

                currentStory = index;

                updateStorySlider();

            }
        );

    }
);



window.addEventListener(
    "resize",
    updateStorySlider
);



/* =========================================================
   AUTO STORY SLIDESHOW
========================================================= */

let storyTimer =
    setInterval(
        function () {


            currentStory++;


            if (
                currentStory >=
                storyCards.length
            ) {

                currentStory = 0;

            }


            updateStorySlider();


        },
        6000
    );



/*
    Stop autoplay when user interacts
*/

[
    nextStory,
    prevStory
].forEach(function (button) {


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {


            clearInterval(
                storyTimer
            );


            storyTimer =
                setInterval(
                    function () {


                        currentStory++;


                        if (
                            currentStory >=
                            storyCards.length
                        ) {

                            currentStory = 0;

                        }


                        updateStorySlider();


                    },
                    6000
                );

        }
    );

});



/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".value-card, .job-card, .development-card, .application-step"
    );


const revealObserver =
    new IntersectionObserver(
        function (entries) {


            entries.forEach(
                function (entry) {


                    if (
                        entry.isIntersecting
                    ) {


                        entry.target.classList.add(
                            "revealed"
                        );


                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );



revealElements.forEach(
    function (element) {

        revealObserver.observe(
            element
        );

    }
);



/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "Rhinggo Careers page loaded successfully."
);

