const adviceBox = document.querySelector(".advise-box");
const numtip = document.querySelector(".num");
const tips = document.querySelector(".text-advicd");
const refbtn = document.querySelector(".img-btn");

const ulapi = "https://api.adviceslip.com/advice";

async function displaytip() {
    adviceBox.classList.add("loading");
    refbtn.disabled = true;

    try {
        // The API caches responses for ~2s, so bypass the browser cache
        // to get a new piece of advice on every click.
        const requet = await fetch(`${ulapi}?t=${Date.now()}`, { cache: "no-store" });
        if (!requet.ok) {
            throw new Error(`Request failed with status ${requet.status}`);
        }
        const dataset = await requet.json();
        numtip.textContent = `#${dataset.slip.id}`;
        tips.textContent = `“${dataset.slip.advice}”`;
    } catch (error) {
        console.error(error);
        tips.textContent = "Couldn't fetch advice right now. Please try again.";
    } finally {
        adviceBox.classList.remove("loading");
        refbtn.disabled = false;
    }
}

refbtn.addEventListener("click", displaytip);
displaytip();
