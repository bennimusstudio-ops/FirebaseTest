// HTML ELEMENTS

const birdResults = document.getElementById("bird-results");

const humboldtFilter = document.getElementById("humboldt-filter");

const galleryLoading = document.getElementById("gallery-loading");

const galleryEmpty = document.getElementById("gallery-empty");

const galleryDescription = document.getElementById("gallery-description");

const gallerySearch = document.getElementById("gallery-search");

let currentPage = 1;

let loading = false;


async function loadBirds(reset = false) {

    if (loading) {
        return;
    }

    loading = true;

    galleryLoading.style.display = "block";
    galleryEmpty.style.display = "none";

    if (reset) {

        currentPage = 1;

        birdResults.innerHTML = "";

    }

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

    loading = false;

    galleryLoading.style.display = "none";

}


function createBirdCard(bird) {

    const card = document.createElement("div");

    card.className = "bird-card";


    // BIRD IMAGE

    const image = document.createElement("img");

    image.loading = "lazy";

    image.alt = bird.preferred_common_name || bird.name;

    image.src = bird.default_photo
        ? bird.default_photo.medium_url
        : "placeholder.png";


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
