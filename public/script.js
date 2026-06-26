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