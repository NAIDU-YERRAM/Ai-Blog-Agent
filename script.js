function formatBlog(text) {
  return text
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/\n/g, "<br>");
}

async function generate() {
  const topic = document.getElementById("topic").value;
  const style = document.getElementById("style").value;
  const language = document.getElementById("language").value;

  const output = document.getElementById("output");
  output.innerHTML = "⏳ Generating...";

  const res = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ topic, style, language })
  });

  const data = await res.json();

  output.innerHTML = `
    <div class="card">
      <h2>📝 Blog</h2>
      ${formatBlog(data.blog)}

      <div class="section">
        <h3>📢 Caption</h3>
        <p>${data.caption}</p>
      </div>

      <div class="section">
        <h3>🔥 Hashtags</h3>
        <p class="tags">${data.hashtags}</p>
      </div>

      <div class="section">
        <h3>🎨 Thumbnail Prompt</h3>
        <div class="thumbnail-box">
          ${data.thumbnail}
        </div>
      </div>
    </div>
  `;
}

// PDF
async function downloadPDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();
  const content = document.getElementById("output").innerText;

  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 10, 10);

  doc.save("blog.pdf");
}