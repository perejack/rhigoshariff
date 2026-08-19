const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");


    menuToggle.addEventListener("click", function () {

        navMenu.classList.toggle("show");

        const icon =
            menuToggle.querySelector("i");

        if (navMenu.classList.contains("show")) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        }

    });


    /* Close mobile menu when link is clicked */

    document.querySelectorAll(".nav-menu a")
        .forEach(function(link) {

            link.addEventListener("click", function() {

                navMenu.classList.remove("show");

                menuToggle
                    .querySelector("i")
                    .classList.remove("fa-xmark");

                menuToggle
                    .querySelector("i")
                    .classList.add("fa-bars");

            });

        });

        /* =====================================================
   RHINGGO YOUTUBE MEDIA
   ===================================================== */
   
   
   /*
       ADD YOUR YOUTUBE VIDEOS HERE
   
       You only need to change:
       - YouTube link
       - TV station / media name
       - Video title
       - Description
   */
   
   const rhinggoMedia = [
   
       {
           youtube:
               "https://youtu.be/zZF9sFy9bzw?si=m6PKNv9WjDwLw1fR",
   
           station:
               "CITIZEN TV",
   
           title:
               "Rhinggo Electric Mobility Featured on Citizen Tv",
   
           description:
               "Rhinggo discusses the future of electric mobility and sustainable transport in Kenya."
       },
   
   
       {
           youtube:
               "https://youtube.com/watch?v=pv_c1aCuI5M&si=B2HALhSvOHFFwnKD",
   
           station:
               "KTN TV",
   
           title:
               "Rhinggo Electric Tuk-Tuks Transforming Transport",
   
           description:
               "A look at how electric tuk-tuks are changing the way people move and earn."
       },
   
   
       {
           youtube:
               "https://youtu.be/CHL1-rATNhY?si=6OEYV72hsl6aylp9",
   
           station:
               "TV47 Kenya",
   
           title:
               "The Future of Electric Mobility in Kenya",
   
           description:
               "Rhinggo shares its vision for cleaner, smarter and more affordable transportation."
       },
   
   
       {
           youtube:
               "https://www.youtube.com/watch?v=Dl8T01mRDZI",
   
           station:
               "Ramogi TV",
   
           title:
               "Rhinggo Driving Kenya's Electric Mobility Revolution",
   
           description:
               "Discover how Rhinggo is helping accelerate the transition to electric mobility."
       }
   
   ];
   
   
   
   /* =====================================================
      EXTRACT YOUTUBE VIDEO ID
   ===================================================== */
   
   function getYouTubeID(url) {
   
       const patterns = [
   
           /youtube\.com\/watch\?v=([^&]+)/,
   
           /youtu\.be\/([^?&]+)/,
   
           /youtube\.com\/embed\/([^?&]+)/,
   
           /youtube\.com\/shorts\/([^?&]+)/
   
       ];
   
   
       for (let pattern of patterns) {
   
           const match = url.match(pattern);
   
           if (match) {
   
               return match[1];
   
           }
   
       }
   
   
       return null;
   
   }
   
   
   
   /* =====================================================
      CREATE MEDIA CARDS
   ===================================================== */
   
   const mediaGrid =
       document.getElementById("mediaVideoGrid");
   
   
   rhinggoMedia.forEach(function(video) {
   
       const videoID =
           getYouTubeID(video.youtube);
   
   
       if (!videoID) {
   
           return;
   
       }
   
   
       const thumbnail =
           `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
   
   
       const card =
           document.createElement("article");
   
   
       card.className =
           "media-video-card";
   
   
       card.innerHTML = `
   
           <a
               href="${video.youtube}"
               target="_blank"
               rel="noopener noreferrer"
               class="youtube-thumbnail"
           >
   
               <img
                   src="${thumbnail}"
                   alt="${video.title}"
                   loading="lazy"
               >
   
               <div class="youtube-overlay">
   
                   <div class="youtube-play">
   
                       <i class="fab fa-youtube"></i>
   
                   </div>
   
               </div>
   
           </a>
   
   
           <div class="media-video-content">
   
               <span class="media-station">
                   ${video.station}
               </span>
   
   
               <h3>
                   ${video.title}
               </h3>
   
   
               <p>
                   ${video.description}
               </p>
   
   
               <a
                   href="${video.youtube}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="watch-youtube"
               >
   
                   Watch on YouTube
   
                   <i class="fas fa-arrow-right"></i>
   
               </a>
   
           </div>
   
       `;
   
   
       mediaGrid.appendChild(card);
   
   });