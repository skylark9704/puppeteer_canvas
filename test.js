async function sendHtml() {
  const cloned = document.cloneNode(true);
  const scripts = cloned.getElementsByTagName("script");
  console.log(`Found ${scripts.length} scripts`);
  console.log("Recursively Removing Scripts");
  const head = cloned.getElementsByTagName("head")[0];
  const base = cloned.createElement("base");
  base.href = window.location.origin;

  head.appendChild(base);
  removeScriptsFromDOM(cloned);
  console.log(`Scripts Left : ${cloned.getElementsByTagName("script").length}`);
  const html2canvas = cloned.createElement("script");
  html2canvas.src = "http://localhost:4200/js/html2canvas.js";
  head.appendChild(html2canvas);
  const html = `<html>${cloned.documentElement.innerHTML}</html>`;
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    html: html,
  });

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  const request = await fetch("http://localhost:4200/html", requestOptions);
  const response = await request.json();
  if (response.message) {
    console.log("Successful");
  }
}

function removeScriptsFromDOM(doc) {
  const scripts = doc.getElementsByTagName("script");
  let removedScripts = 0;
  for (let script of scripts) {
    script.parentNode.removeChild(script);
    removedScripts += 1;
  }
  if (removedScripts !== 0) {
    removeScriptsFromDOM(doc);
  }
}
