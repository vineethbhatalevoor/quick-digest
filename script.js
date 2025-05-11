// Dark Mode Toggle
document.getElementById("themeToggle").addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});

// Summarization Function
async function summarizeNews() {
  const newsText = document.getElementById("newsInput").value;
  const summaryOutput = document.getElementById("summaryOutput");
  const summarizeButton = document.getElementById("summarizeButton");

  if (!newsText.trim()) {
    summaryOutput.innerHTML = "⚠️ Please enter some news text.";
    return;
  }

  try {
    console.log("Sending request to backend...");

    // Button animation effect when clicked
    summarizeButton.style.backgroundColor = "#FFA500"; // Turns orange when clicked

    const response = await fetch("http://127.0.0.1:5000/summarize-text", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newsText })
    });

    console.log("Response Status:", response.status); // Debugging

    const data = await response.json();
    console.log("Response Data:", data); // Debugging

    // Restore button color after fetching summary
    summarizeButton.style.backgroundColor = "#007BFF"; 

    if (data && data.summary) {
      summaryOutput.innerHTML = `<strong>📝 Summary:</strong> ${data.summary}`;
    } else {
      summaryOutput.innerHTML = "❌ Error: No summary received.";
      console.error("No summary received from API");
    }
  } catch (error) {
    summaryOutput.innerHTML = "⚠️ Error fetching summary!";
    console.error("API Error:", error);
  }
}

// Text-to-Speech for Summary Output
document.getElementById("listenButton").addEventListener("click", function () {
  const summaryText = document.getElementById("summaryOutput").innerText.trim();
  
  if (!summaryText) {
    alert("⚠️ No summary available to read!");
    return;
  }

  const speech = new SpeechSynthesisUtterance(summaryText);
  speech.lang = "en-US"; // Default voice
  speech.rate = 1.0; // Normal speed
  speech.volume = 1; // Ensure volume is up
  speech.pitch = 1; // Normal pitch

  // Select the first available voice
  const voices = window.speechSynthesis.getVoices();
  speech.voice = voices.length > 0 ? voices[0] : null;

  window.speechSynthesis.speak(speech);
});