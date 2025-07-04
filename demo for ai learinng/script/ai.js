async function askGemini(question) {
  const apiKey = "AIzaSyAgnH1k9pLFBPNDMyjiqhnaRuCmr9-W-m8";  // Your key

  const body = {
    contents: [{
      parts: [{ text: question }]
    }]
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return answer || "❌ No response from AI.";
  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    return "❌ AI error. Check your connection or key.";
  }
}


