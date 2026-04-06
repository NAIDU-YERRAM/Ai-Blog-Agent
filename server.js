import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Hashtags
function generateHashtags(topic) {
  const base = topic.toLowerCase().replace(/\s/g, "");
  return `#${base} #Trending #Innovation #Future #Tech #Growth #Learning`;
}

// 🎨 Thumbnail prompt (PRO)
function generateThumbnail(topic) {
  return `Ultra-realistic cinematic YouTube thumbnail about "${topic}", bold typography, glowing title, futuristic UI elements, 4K resolution, sharp focus, vibrant colors, professional composition`;
}

app.post("/generate", async (req, res) => {
  const { topic, style, language } = req.body;

  const prompt = `
Write a clean blog about "${topic}"

STRICT RULES:
- Language must be ONLY ${language}
- Do not mix languages
- Use headings (##, ###)
- Use bullet points
- Clean formatting like Medium article
- No messy symbols like **

STYLE: ${style}
`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt,
        stream: false
      })
    });

    const data = await response.json();

    res.json({
      blog: data.response,
      caption: `🔥 ${topic} explained simply!`,
      hashtags: generateHashtags(topic),
      thumbnail: generateThumbnail(topic)
    });

  } catch {
    res.status(500).json({ error: "Ollama not running" });
  }
});

app.listen(3000, () => console.log("🚀 Clean Blog Agent running"));