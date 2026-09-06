/* ====================================================================================================================================================
   CV PIPELINE TALEND - app.js
   This script does two distinct things:
   1) On load: reads window.CV_DATA (populated by the <script> tags in DATA/*.js loaded into index.html) and builds the
      CV content in the DOM. Nothing is hard-coded here. Modifying a file in the DATA/ directory updates the page upon reload.
   2) On the fly: dynamically reloads RUNTIME/progress.js every 500 ms (using the JSONP technique, via a <script>
      tag that is re-injected) to determine how far along the Talend job has progressed, and reveals the corresponding sections.

   Everything goes through <script> tags, which work just as well when double-clicking index.html (file://) as they do once the project is hosted (http://).
   This is what makes the project usable without any installation (no Python, no server, no prerequisites).
   ==================================================================================================================================================== */

const PROGRESS_PATH = "../RUNTIME/progress.js";

let latestFileStep   = 0;
let currentDisplayed = 0;
let paused 			 = false;

//1. Constructing content from window.CV_DATA

function buildContent() {
  if (!window.CV_DATA || !window.CV_DATA.profile) {
    document.getElementById("content").innerHTML =
      '<p style="color:#f87171">Data not found. Check that the 4 files ' +
      'DATA/profile.js, DATA/skills.js, DATA/experiences.js, and DATA/education.js' +
      'are loaded by index.html (<script/>; tags at the bottom of the page).</p>';
    return;
  }
  renderHeader(window.CV_DATA.profile);
  renderProfile(window.CV_DATA.profile);
  renderSkills(window.CV_DATA.skills);
  renderExperiences(window.CV_DATA.experiences);
  renderEducation(window.CV_DATA.education);
}

function renderHeader(profile) {
  const el = document.getElementById("step-1");
  const linkedinUrl = profile.linkedin.startsWith("http") ? profile.linkedin : "https://" + profile.linkedin;
  el.innerHTML = `
    <p class="cvname">${profile.firstname} ${profile.lastname}</p>
    <p class="cvtitle">${profile.title}</p>
    <p class="cvcontact">${profile.email} · ${profile.phone} · <a href="${linkedinUrl}" target="_blank" rel="noopener">${profile.linkedin}</a></p>
  `;
}

function renderProfile(profile) {
  const el = document.getElementById("step-2");
  el.innerHTML = `
    <p class="sectiontitle">About me</p>
    <p class="desc">${profile.summary}</p>
  `;
}

function renderSkills(skills) {
  const el = document.getElementById("step-3");
  let html = '<p class="sectiontitle">Skills</p>';
  skills.skills.forEach(cat => {
    html += `<div class="skillcat">${cat.category}</div><div class="skillrow">`;
    cat.items.forEach(item => {
      html += `<span class="skillpill">${item}</span>`;
    });
    html += `</div>`;
  });
  el.innerHTML = html;
}

function renderExperiences(experiences) {
  const el = document.getElementById("step-4");
  let html = '<p class="sectiontitle">Experience</p>';
  experiences.experiences.forEach(xp => {
    html += `
      <div class="xp">
        <div class="period">${xp.period}</div>
        <div class="client">${xp.client}</div>
        <div class="role">${xp.role}</div>
        <div class="desc">${xp.description}</div>
        ${xp.environment && xp.environment.length ? `<div class="envrow">${xp.environment.map(e => `<span class="envtag">${e}</span>`).join("")}</div>` : ""}
      </div>`;
  });
  el.innerHTML = html;
}

function renderEducation(education) {
  const el = document.getElementById("step-5");
  let html = '<p class="sectiontitle">Training</p>';
  education.education.forEach(ed => {
    html += `<div class="xp"><div class="period">${ed.year}</div><div class="client">${ed.degree}</div>${ed.institution ? `<div class="role">${ed.institution}</div>` : ""}</div>`;
  });
  if (education.notes) {
    html += `<p class="desc" style="margin-top:8px">${education.notes}</p>`;
  }
  html += `
    <div class="finalbox">
      <div class="ok">JOB COMPLETED — 100% PROCESSED</div>
      <div class="sig">Thank you for playing this talend job ;)</div>
    </div>`;
  el.innerHTML = html;
}

//2. Polling de progress.js (no fetch, no server)

/* Talend writes RUNTIME/progress.js in the following format: onProgressUpdate({ "step": 3, "total": 5, "status": "RUNNING", 'message': "..." });
   A <script src="...progress.js?t=..."> tag is reinserted every 500 ms; each time it loads, the file itself calls the function
   below with its updated content. */

let progressScriptTag = null;
let livePolling 	  = true;

window.onProgressUpdate = function (data) {
  latestFileStep = data.step;
  updateStatusBar(data);
  tryReveal();
};

function pollProgress() {
  if (!livePolling) return;
  if (progressScriptTag) progressScriptTag.remove();
  progressScriptTag = document.createElement("script");
  progressScriptTag.src = PROGRESS_PATH + "?t=" + Date.now();
  progressScriptTag.onerror = function () {
    console.log("progress.js is unavailable; trying again...");
  };
  document.body.appendChild(progressScriptTag);
  setTimeout(pollProgress, 500);
}

function tryReveal() {
  if (paused) return;
  if (currentDisplayed < latestFileStep) {
    currentDisplayed++;
    revealStep(currentDisplayed);
    setTimeout(tryReveal, 400);
  }
}

function revealStep(step) {
  const el = document.getElementById("step-" + step);
  if (el) el.classList.add("show");
  const log = document.getElementById("s" + step);
  if (log) log.className = "step done";
  if (step < 5) {
    const next = document.getElementById("s" + (step + 1));
    if (next) next.className = "step running";
  }
}

function updateStatusBar(data) {
  document.getElementById("progressfill").style.width = (data.step / data.total * 100) + "%";
  document.getElementById("progresspct").textContent = Math.round(data.step / data.total * 100) + "%";
  document.getElementById("statustext").textContent = data.message || data.status;
}

//Inspections

function replay() {
  currentDisplayed = 0;
  paused = false;
  livePolling = true;
  for (let i = 1; i <= 5; i++) {
    document.getElementById("step-" + i).classList.remove("show");
    document.getElementById("s" + i).className = "step";
  }
  document.getElementById("pausebtn").textContent = "Ⅱ PAUSE";
  tryReveal();
  pollProgress();
}

function togglePause() {
  paused = !paused;
  document.getElementById("pausebtn").textContent = paused ? "▶ RESUME" : "Ⅱ PAUSE";
  document.getElementById("statusdot").className = paused ? "dot paused" : "dot";
  if (!paused) tryReveal();
}

function stepOnce() {
  if (currentDisplayed < latestFileStep) {
    currentDisplayed++;
    revealStep(currentDisplayed);
  }
}

function previewAll() {
  paused = false;
  livePolling = false;
  onProgressUpdate({ step: 5, total: 5, status: "COMPLETED", message: "Full Overview (Job Not Started)" });
  for (let i = currentDisplayed + 1; i <= 5; i++) revealStep(i);
  currentDisplayed = 5;
}

document.getElementById("previewbtn").addEventListener("click", previewAll);
document.getElementById("replaybtn").addEventListener("click", replay);
document.getElementById("pausebtn").addEventListener("click", togglePause);
document.getElementById("stepbtn").addEventListener("click", stepOnce);

buildContent();
pollProgress();