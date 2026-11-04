// HTML ELEMENTS

const birdResults = document.getElementById("bird-results");

const humboldtFilter = document.getElementById("humboldt-filter");

const galleryLoading = document.getElementById("gallery-loading");

const galleryError = document.getElementById("gallery-error");

const galleryEmpty = document.getElementById("gallery-empty");

const galleryDescription = document.getElementById("gallery-description");

const gallerySearch = document.getElementById("gallery-search");


// GALLERY VARIABLES

let currentPage = 1;

let loading = false;


async function loadBirds(reset = false) {

    if (loading) {
        return;
    }

    loading = true;

    galleryLoading.style.display = "block";
    galleryError.style.display = "none";
    galleryEmpty.style.display = "none";

    if (reset) {

        currentPage = 1;

        birdResults.innerHTML = "";

    }

    try {

        const url =
            "https://api.inaturalist.org/v1/observations/species_counts"
            + "?taxon_id=3"
            + "&per_page=40"
            + "&page=" + currentPage
            //the place id for humboldt county is 1247
            + (humboldtFilter.checked ? "&place_id=1247" : "");

        galleryDescription.textContent = humboldtFilter.checked
            ? "Bird species observed in Humboldt County."
            : "Explore birds from around the world.";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("API request failed.");
        }

        const data = await response.json();

        const birds = data.results.map(item => item.taxon);

        if (birds.length === 0 && currentPage === 1) {
            galleryEmpty.style.display = "block";
        }

        // CREATE BIRD CARDS

        birds.forEach(bird => {
            createBirdCard(bird);
        });

        currentPage++;

        updateLoadMoreButton(birds.length);

    }

    catch (error) {

        console.error(error);

        galleryError.style.display = "block";

    }

    finally {

        loading = false;

        galleryLoading.style.display = "none";

    }

}


function createBirdCard(bird) {

    const card = document.createElement("div");

    card.className = "bird-card";


    // BIRD IMAGE

    const image = document.createElement("img");

    image.loading = "lazy";

    image.alt = bird.preferred_common_name || bird.name;


    if (bird.default_photo) {

        image.src = bird.default_photo.medium_url;

    }

    else {

        image.src = "placeholder.png";

    }


    // COMMON NAME

    const commonName = document.createElement("h3");

    commonName.textContent =
        bird.preferred_common_name || bird.name;


    // SCIENTIFIC NAME

    const scientificName = document.createElement("p");

    scientificName.className = "scientific-name";

    scientificName.textContent = bird.name;


    // ADD ELEMENTS TO CARD

    card.appendChild(image);

    card.appendChild(commonName);

    card.appendChild(scientificName);


    // OPEN INATURALIST SPECIES PAGE

    card.addEventListener("click", function() {

        window.open(
            "https://www.inaturalist.org/taxa/" + bird.id,
            "_blank"
        );

    });


    birdResults.appendChild(card);

}


//button to load more birds

function updateLoadMoreButton(numberOfBirds) {

    let button = document.getElementById("load-more-button");

    if (!button) {

        button = document.createElement("button");

        button.id = "load-more-button";

        button.textContent = "Load More Birds";

        button.addEventListener("click", function() {

            loadBirds();

        });

        birdResults.parentElement.appendChild(button);

    }


    button.style.display =
        numberOfBirds === 40 ? "block" : "none";

}


//reloads the birds when humboldt filter is clicked

humboldtFilter.addEventListener("change", function() {

    loadBirds(true);

});


//go to birdSummary page for search 

gallerySearch.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        const searchName = gallerySearch.value.trim();

        if (searchName !== "") {

            window.location.href =
                "birdSummary.html?search=" + encodeURIComponent(searchName);

        }

    }

});


//load on page startup

loadBirds(true);
