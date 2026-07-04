async function askGPT() {

    const prompt = document.getElementById("prompt").value;

    const responseBox = document.getElementById("response");
    responseBox.innerText = "Thinking...";

    const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: prompt
        })
    });

    const data = await response.json();

    responseBox.innerText = data.reply;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function makeWindowDraggable() {
    const windowEl = document.querySelector(".msn-window");
    const titleBar = document.querySelector(".msn-titlebar");

    if (!windowEl || !titleBar) {
        return;
    }

    let isDragging = false;
    let pointerId = null;
    let offsetX = 0;
    let offsetY = 0;

    titleBar.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) {
            return;
        }

        if (event.target.closest("button")) {
            return;
        }

        const rect = windowEl.getBoundingClientRect();
        isDragging = true;
        pointerId = event.pointerId;
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        titleBar.setPointerCapture(pointerId);
        windowEl.classList.add("dragging");

        // Switch from centered transform to absolute coordinates after first drag.
        windowEl.style.transform = "none";
        windowEl.style.left = `${rect.left}px`;
        windowEl.style.top = `${rect.top}px`;

        event.preventDefault();
    });

    titleBar.addEventListener("pointermove", (event) => {
        if (!isDragging || event.pointerId !== pointerId) {
            return;
        }

        const maxLeft = Math.max(0, window.innerWidth - windowEl.offsetWidth);
        const maxTop = Math.max(0, window.innerHeight - windowEl.offsetHeight);
        const nextLeft = clamp(event.clientX - offsetX, 0, maxLeft);
        const nextTop = clamp(event.clientY - offsetY, 0, maxTop);

        windowEl.style.left = `${nextLeft}px`;
        windowEl.style.top = `${nextTop}px`;
    });

    const endDrag = (event) => {
        if (!isDragging || event.pointerId !== pointerId) {
            return;
        }

        isDragging = false;
        windowEl.classList.remove("dragging");
        titleBar.releasePointerCapture(pointerId);
        pointerId = null;
    };

    titleBar.addEventListener("pointerup", endDrag);
    titleBar.addEventListener("pointercancel", endDrag);

    window.addEventListener("resize", () => {
        const rect = windowEl.getBoundingClientRect();
        const maxLeft = Math.max(0, window.innerWidth - windowEl.offsetWidth);
        const maxTop = Math.max(0, window.innerHeight - windowEl.offsetHeight);

        windowEl.style.transform = "none";
        windowEl.style.left = `${clamp(rect.left, 0, maxLeft)}px`;
        windowEl.style.top = `${clamp(rect.top, 0, maxTop)}px`;
    });
}

document.addEventListener("DOMContentLoaded", makeWindowDraggable);