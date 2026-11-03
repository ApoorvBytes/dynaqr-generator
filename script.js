let qr;
let currentEntry = null;
const historyKey = "qr-studio-history";

const elements = {
  form: document.getElementById("qrForm"),
  text: document.getElementById("qrText"),
  color: document.getElementById("qrColor"),
  background: document.getElementById("backgroundColor"),
  size: document.getElementById("qrSize"),
  sizeValue: document.getElementById("sizeValue"),
  characterCount: document.getElementById("characterCount"),
  qrCode: document.getElementById("qrCode"),
  qrWrapper: document.getElementById("qrWrapper"),
  emptyState: document.getElementById("emptyState"),
  previewStatus: document.getElementById("previewStatus"),
  formMessage: document.getElementById("formMessage"),
  copy: document.getElementById("copyBtn"),
  download: document.getElementById("downloadBtn"),
  historySection: document.getElementById("historySection"),
  historyGrid: document.getElementById("historyGrid")
};

function updateColorLabel(input, labelId) {
  document.getElementById(labelId).textContent = input.value.toUpperCase();
}

function updateFormDetails() {
  elements.characterCount.textContent = `${elements.text.value.length} / 1200`;
  elements.sizeValue.textContent = `${elements.size.value} px`;
  updateColorLabel(elements.color, "qrColorValue");
  updateColorLabel(elements.background, "backgroundColorValue");
}

function getEntry() {
  return {
    text: elements.text.value.trim(),
    color: elements.color.value,
    background: elements.background.value,
    size: Number(elements.size.value),
    createdAt: Date.now()
  };
}

function showMessage(message = "") {
  elements.formMessage.textContent = message;
}

function generateQR(event, shouldSave = true) {
  if (event) event.preventDefault();
  const entry = getEntry();

  if (!entry.text) {
    showMessage("Add a link or some text to generate your QR code.");
    elements.text.focus();
    return;
  }

  if (typeof QRCode === "undefined") {
    showMessage("The QR library could not load. Check your connection and try again.");
    return;
  }

  showMessage();
  elements.qrCode.replaceChildren();
  qr = new QRCode(elements.qrCode, {
    text: entry.text,
    width: entry.size,
    height: entry.size,
    colorDark: entry.color,
    colorLight: entry.background,
    correctLevel: QRCode.CorrectLevel.H
  });

  currentEntry = entry;
  elements.emptyState.hidden = true;
  elements.qrWrapper.hidden = false;
  elements.copy.disabled = false;
  elements.download.disabled = false;
  elements.previewStatus.textContent = "Ready to share";
  if (shouldSave) saveToHistory(entry);
}

function getQrImage() {
  return elements.qrCode.querySelector("img") || elements.qrCode.querySelector("canvas");
}

function downloadQR() {
  const image = getQrImage();
  if (!image) return;
  const link = document.createElement("a");
  link.download = "qr-studio-code.png";
  link.href = image.tagName === "CANVAS" ? image.toDataURL("image/png") : image.src;
  link.click();
}

async function copyQR() {
  const image = getQrImage();
  if (!image) return;
  try {
    const canvas = image.tagName === "CANVAS" ? image : document.createElement("canvas");
    if (image.tagName !== "CANVAS") {
      canvas.width = image.naturalWidth || currentEntry.size;
      canvas.height = image.naturalHeight || currentEntry.size;
      canvas.getContext("2d").drawImage(image, 0, 0);
    }
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    elements.copy.innerHTML = "<span>✓</span> Copied";
    setTimeout(() => { elements.copy.innerHTML = "<span>▣</span> Copy"; }, 1600);
  } catch {
    elements.previewStatus.textContent = "Copy is unavailable in this browser";
  }
}

function saveToHistory(entry) {
  let history = getHistory().filter(item => item.text !== entry.text);
  history.unshift(entry);
  localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 6)));
  renderHistory();
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(historyKey)) || []; } catch { return []; }
}

function renderHistory() {
  const history = getHistory();
  elements.historySection.hidden = history.length === 0;
  elements.historyGrid.replaceChildren();
  if (typeof QRCode === "undefined") return;
  history.forEach(entry => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "history-card";
    card.innerHTML = `<span class="history-qr"></span><span class="history-text"><strong>${escapeHtml(entry.text)}</strong><small>${formatDate(entry.createdAt)} · ${entry.size}px</small></span>`;
    const preview = card.querySelector(".history-qr");
    new QRCode(preview, { text: entry.text, width: 42, height: 42, colorDark: entry.color, colorLight: entry.background });
    card.addEventListener("click", () => {
      elements.text.value = entry.text;
      elements.color.value = entry.color;
      elements.background.value = entry.background;
      elements.size.value = entry.size;
      updateFormDetails();
      generateQR();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    elements.historyGrid.append(card);
  });
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function resetForm() {
  elements.form.reset();
  elements.qrCode.replaceChildren();
  elements.qrWrapper.hidden = true;
  elements.emptyState.hidden = false;
  elements.copy.disabled = true;
  elements.download.disabled = true;
  elements.previewStatus.textContent = "Waiting for your content";
  currentEntry = null;
  showMessage();
  updateFormDetails();
}

elements.form.addEventListener("submit", generateQR);
elements.download.addEventListener("click", downloadQR);
elements.copy.addEventListener("click", copyQR);
elements.text.addEventListener("input", updateFormDetails);
elements.color.addEventListener("input", () => { updateFormDetails(); if (currentEntry) generateQR(null, false); });
elements.background.addEventListener("input", () => { updateFormDetails(); if (currentEntry) generateQR(null, false); });
elements.size.addEventListener("input", () => { updateFormDetails(); if (currentEntry) generateQR(null, false); });
document.getElementById("resetBtn").addEventListener("click", resetForm);
document.getElementById("clearHistory").addEventListener("click", () => {
  localStorage.removeItem(historyKey);
  renderHistory();
});
document.querySelectorAll("[data-example]").forEach(button => {
  button.addEventListener("click", () => {
    elements.text.value = button.dataset.example;
    updateFormDetails();
    generateQR();
  });
});
document.getElementById("themeToggle").addEventListener("click", event => {
  document.body.classList.toggle("light-theme");
  const light = document.body.classList.contains("light-theme");
  event.currentTarget.textContent = light ? "☾" : "☼";
  event.currentTarget.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  localStorage.setItem("qr-studio-theme", light ? "light" : "dark");
});
elements.text.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") generateQR(event);
});

if (localStorage.getItem("qr-studio-theme") === "light") {
  document.body.classList.add("light-theme");
  const toggle = document.getElementById("themeToggle");
  toggle.textContent = "☾";
  toggle.setAttribute("aria-label", "Switch to dark theme");
}
updateFormDetails();
renderHistory();
