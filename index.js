const PORT = process.env.PORT || 4200;
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());
app.use(express.static("static"));
app.use(bp.json({ limit: "50mb" }));

app.post("/html", async (req, res) => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page = await browser.newPage();
  // const HTML = await fs.promises.readFile("./index.html", { encoding: "utf8" });
  const HTML = req.body.html;
  page.on("console", (consoleObj) => {
    const text = consoleObj.text();
    if (text.startsWith("data")) {
      base64_decode(
        text.split(";base64,").pop(),
        `./static/images/${Date.now()}.png`
      );
    }
  });
  await page.setContent(HTML, { waitUntil: "networkidle0" });
  await page.evaluate((_) => {
    html2canvas(document.body, {
      height: window.innerHeight,
      width: window.innerWidth,
      allowTaint: false,
      scrollY: 0 - window.pageYOffset,
      proxy: "https://widget.easy.xyz/",
    })
      .then((canvas) => {
        const b64 = canvas.toDataURL();
        console.log(b64);
      })
      .catch((error) => console.log(error));
  });
  res.json({ message: true });
});

app.get("/decode", async (req, res) => {
  const data = await fs.promises.readFile("./encoded.txt");
  const decoded = data.toString("utf-8");
  res.json({ decoded });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function base64_decode(base64Image, file) {
  fs.writeFile(file, base64Image, { encoding: "base64" }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("File Created");
    }
  });
}
