const adviceBox = document.querySelector(".advise-box");
const numtip = document.querySelector(".num");
const tips = document.querySelector(".text-advicd");
const refbtn = document.querySelector(".img-btn");
const copyBtn = document.querySelector(".copy-btn");
const shareBtn = document.querySelector(".share-btn");
const toast = document.querySelector(".toast");

const ulapi = "https://api.adviceslip.com/advice";

// Used when the API can't be reached, so the app still works offline
const fallbackAdvice = [
    { id: 117, advice: "It is easy to sit up and take notice, what's difficult is getting up and taking action." },
    { id: 4, advice: "Don't compare yourself to others." },
    { id: 21, advice: "Don't be afraid of change." },
    { id: 71, advice: "Always the burrito." },
    { id: 155, advice: "If you're not sure, ask." },
];

let current = null;
let toastTimer;

async function fetchSlip(id) {
    // The API caches responses for ~2s, so bypass the browser cache
    // to get a new piece of advice on every click.
    const url = id ? `${ulapi}/${id}` : `${ulapi}?t=${Date.now()}`;
    const requet = await fetch(url, { cache: "no-store" });
    if (!requet.ok) {
        throw new Error(`Request failed with status ${requet.status}`);
    }
    const dataset = await requet.json();
    if (!dataset.slip) {
        throw new Error("No advice found");
    }
    return dataset.slip;
}

function randomFallback() {
    const options = fallbackAdvice.filter((slip) => slip.id !== current?.id);
    return options[Math.floor(Math.random() * options.length)];
}

function showSlip(slip) {
    current = slip;
    numtip.textContent = `#${slip.id}`;
    tips.textContent = `“${slip.advice}”`;
    // Restart the fade-in animation for each new piece of advice
    tips.classList.remove("fade-in");
    void tips.offsetWidth;
    tips.classList.add("fade-in");

    // Keep the address bar pointing at this advice so it can be shared
    const url = new URL(window.location);
    url.searchParams.set("id", slip.id);
    history.replaceState(null, "", url);
}

async function displaytip(id) {
    adviceBox.classList.add("loading");
    refbtn.disabled = true;

    try {
        let slip = await fetchSlip(id);
        // Ask once more if the API hands back the advice we're already showing
        if (!id && slip.id === current?.id) {
            slip = await fetchSlip();
        }
        showSlip(slip);
    } catch (error) {
        console.error(error);
        showSlip(randomFallback());
    } finally {
        adviceBox.classList.remove("loading");
        refbtn.disabled = false;
    }
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function adviceText() {
    return `“${current.advice}” — Advice #${current.id}`;
}

async function copyAdvice() {
    if (!current) return;
    try {
        await navigator.clipboard.writeText(adviceText());
        showToast("Advice copied!");
    } catch {
        showToast("Couldn't copy advice");
    }
}

async function shareAdvice() {
    if (!current) return;
    const url = window.location.href;
    if (navigator.share) {
        try {
            await navigator.share({ title: "Advice generator", text: adviceText(), url });
        } catch {
            // The user closed the share sheet
        }
        return;
    }
    try {
        await navigator.clipboard.writeText(url);
        showToast("Link copied!");
    } catch {
        showToast("Couldn't copy link");
    }
}

refbtn.addEventListener("click", () => displaytip());
copyBtn.addEventListener("click", copyAdvice);
shareBtn.addEventListener("click", shareAdvice);

document.addEventListener("keydown", (event) => {
    // Space anywhere on the page rolls the dice, unless a button or link has focus
    if (event.code === "Space" && !event.target.closest("button, a, input, textarea")) {
        event.preventDefault();
        if (!refbtn.disabled) displaytip();
    }
});

// Open a specific piece of advice when the link includes ?id=
const sharedId = Number(new URLSearchParams(window.location.search).get("id"));
displaytip(Number.isInteger(sharedId) && sharedId > 0 ? sharedId : undefined);
