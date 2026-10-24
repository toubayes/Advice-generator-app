const adviceBox = document.querySelector(".advise-box");
const numtip = document.querySelector(".num");
const tips = document.querySelector(".text-advicd");
const refbtn = document.querySelector(".img-btn");
const copyBtn = document.querySelector(".copy-btn");
const shareBtn = document.querySelector(".share-btn");
const toast = document.querySelector(".toast");

const ulapi = "https://api.adviceslip.com/advice";
// The API has about 224 slips. Asking for a random id avoids the API's
// 2-second server cache, which returns the same advice on quick clicks.
const maxAdviceId = 224;

// Used when the API can't be reached, so the app still works offline
const fallbackAdvice = [
    "It is easy to sit up and take notice, what's difficult is getting up and taking action.",
    "Don't compare yourself to others.",
    "Don't be afraid of change.",
    "If you're not sure, ask.",
    "Take a break and come back with fresh eyes.",
];

let current = null;
let toastTimer;

async function fetchSlip(id) {
    const requet = await fetch(`${ulapi}/${id}`, { cache: "no-store" });
    if (!requet.ok) {
        throw new Error(`Request failed with status ${requet.status}`);
    }
    const dataset = await requet.json();
    // Missing ids come back as { message: { type: "error", ... } }
    if (!dataset.slip) {
        throw new Error(dataset.message?.text || "No advice found");
    }
    return dataset.slip;
}

async function fetchRandomSlip() {
    let lastError;
    for (let attempt = 0; attempt < 4; attempt++) {
        const id = Math.floor(Math.random() * maxAdviceId) + 1;
        if (id === current?.id) continue;
        try {
            return await fetchSlip(id);
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError || new Error("No advice found");
}

function randomFallback() {
    const options = fallbackAdvice.filter((advice) => advice !== current?.advice);
    return { id: null, advice: options[Math.floor(Math.random() * options.length)] };
}

function showSlip(slip) {
    current = slip;
    numtip.textContent = slip.id ? `#${slip.id}` : "";
    tips.textContent = `“${slip.advice}”`;
    // Restart the fade-in animation for each new piece of advice
    tips.classList.remove("fade-in");
    void tips.offsetWidth;
    tips.classList.add("fade-in");
}

async function displaytip(id) {
    adviceBox.classList.add("loading");
    refbtn.disabled = true;

    try {
        showSlip(id ? await fetchSlip(id) : await fetchRandomSlip());
    } catch (error) {
        console.error(error);
        showSlip(randomFallback());
    } finally {
        adviceBox.classList.remove("loading");
        refbtn.disabled = false;
    }
}

function shareUrl() {
    const url = new URL(window.location);
    url.search = "";
    url.hash = "";
    if (current.id) url.searchParams.set("id", current.id);
    return url.href;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function adviceText() {
    return current.id ? `“${current.advice}” — Advice #${current.id}` : `“${current.advice}”`;
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
    const url = shareUrl();
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

// Open a specific piece of advice when the link includes ?id=, then tidy
// the address bar so refreshing the page gives new advice again
const sharedId = Number(new URLSearchParams(window.location.search).get("id"));
if (Number.isInteger(sharedId) && sharedId > 0) {
    history.replaceState(null, "", window.location.pathname);
    displaytip(sharedId);
} else {
    displaytip();
}
