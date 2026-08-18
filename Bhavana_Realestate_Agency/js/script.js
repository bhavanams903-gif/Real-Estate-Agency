// ============================================
// BHAVANA REALESTATE AGENCY
// Main JavaScript
// ============================================

// ---------- Mobile Navigation ----------

const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");

if (menuBtn && nav) {
    menuBtn.onclick = () => {
        nav.classList.toggle("open");
    };
}

document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
        if (nav) {
            nav.classList.remove("open");
        }
    });
});


// ---------- Active Section Navigation ----------

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll('.nav a[href^="#"]')];

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    links.forEach((link) => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === "#" + entry.target.id
                        );
                    });
                }
            });
        },
        {
            rootMargin: "-40% 0px -50% 0px"
        }
    );

    sections.forEach((section) => observer.observe(section));
}


// ---------- Favourite / Heart Button ----------

function toggleHeart(button) {
    if (button.textContent === "♡") {
        button.textContent = "♥";
        button.style.color = "#c99525";
    } else {
        button.textContent = "♡";
        button.style.color = "#071a35";
    }
}


// ---------- Toast Message ----------

function showToast(message) {
    const toast = document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3200);
}


// ---------- Property Details ----------

function openProperty(title, button) {
    const card = button.closest(".card");

    if (!card) {
        return;
    }

    const imageElement = card.querySelector(".card-img");

    const modal = document.getElementById("modal");

    // If a modal exists, show property information in it.
    if (modal) {
        const modalTitle = document.getElementById("modalTitle");
        const modalText = document.getElementById("modalText");
        const modalImg = document.getElementById("modalImg");

        if (modalTitle) {
            modalTitle.textContent = title;
        }

        if (modalText) {
            modalText.textContent =
                "This is a sample property for the Bhavana Realestate Agency " +
                "college demonstration website. Contact our team for availability, " +
                "pricing and site visit details.";
        }

        if (modalImg && imageElement) {
            const background = imageElement.style.backgroundImage;

            if (background) {
                modalImg.src = background.slice(5, -2);
            }
        }

        modal.classList.add("open");
        return;
    }

    // Fallback when no modal is present.
    showToast("Property details selected: " + title);
}


// ---------- Close Property Modal ----------

function closeModal() {
    const modal = document.getElementById("modal");

    if (modal) {
        modal.classList.remove("open");
    }
}

const modal = document.getElementById("modal");

if (modal) {
    modal.addEventListener("click", (event) => {
        if (event.target.id === "modal") {
            closeModal();
        }
    });
}


// ---------- Budget Helper ----------

function parseBudget(value) {
    const numbers =
        (value || "")
            .toLowerCase()
            .replace(/₹|,/g, "")
            .match(/[0-9]+(?:\.[0-9]+)?/g) || [];

    return numbers
        .map(Number)
        .map((number) => {
            return number < 1000 ? number * 100000 : number;
        });
}


// ---------- Read Property Price ----------

function propertyPrice(card) {
    const priceText =
        card.querySelector(".price")?.textContent || "";

    const numbers =
        priceText
            .replace(/₹|,/g, "")
            .match(/[0-9]+(?:\.[0-9]+)?/g) || [];

    if (!numbers.length) {
        return 0;
    }

    let price = Number(numbers[0]);

    if (/cr/i.test(priceText)) {
        price *= 10000000;
    } else if (/lakh/i.test(priceText)) {
        price *= 100000;
    }

    return price;
}


// ---------- Property Search ----------

function filterProperties() {
    const locationInput = document.getElementById("location");
    const typeInput = document.getElementById("type");
    const budgetInput = document.getElementById("budget");

    const query =
        locationInput?.value.toLowerCase().trim() || "";

    const type =
        typeInput?.value.toLowerCase().trim() || "";

    const budget = parseBudget(budgetInput?.value || "");

    const minBudget = budget[0] || 0;
    const maxBudget = budget[1] || Infinity;

    let shown = 0;

    document.querySelectorAll(".property").forEach((card) => {
        const location =
            (card.dataset.location || "").toLowerCase();

        const cardType =
            (card.dataset.type || "").toLowerCase();

        const words = query
            .split(/\s+/)
            .filter(Boolean);

        const locationMatch =
            !words.length ||
            words.some((word) => location.includes(word));

        const typeMatch =
            !type || cardType === type;

        const price = propertyPrice(card);

        const budgetMatch =
            !budget.length ||
            (price >= minBudget && price <= maxBudget);

        const matches =
            locationMatch &&
            typeMatch &&
            budgetMatch;

        card.style.display = matches ? "" : "none";

        if (matches) {
            shown++;
        }
    });

    const noResults = document.getElementById("noResults");

    if (noResults) {
        noResults.style.display =
            shown ? "none" : "block";
    }

    const count = document.getElementById("resultCount");

    if (count) {
        count.textContent =
            shown +
            " preferred propert" +
            (shown === 1 ? "y" : "ies") +
            " found";
    }

    const properties = document.getElementById("properties");

    if (properties) {
        properties.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ---------- Search Form ----------

const searchForm = document.getElementById("searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        filterProperties();
    });
}


// ---------- Reset Search ----------

function resetFilters() {
    const location = document.getElementById("location");
    const type = document.getElementById("type");
    const budget = document.getElementById("budget");

    if (location) location.value = "";
    if (type) type.value = "";
    if (budget) budget.value = "";

    filterProperties();
}


// ---------- Contact Form ----------

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!event.target.checkValidity()) {
            event.target.reportValidity();
            return;
        }

        const name =
            document.getElementById("contactName")?.value.trim();

        showToast(
            "Thank you, " +
            (name || "Customer") +
            "! Your enquiry has been received."
        );

        event.target.reset();
    });
}
