CV_PIPELINE_TALEND
========================================================

No installation is required to view the web output (no Python, no Node, no server).
Double-click WEB/index.html and that's it ;)
It works on Windows, macOS, and Linux, in any modern browser.


Project contents:

  DATA/       The 4 .js files containing your actual background (profile,
              skills, experiences, education). This is the ONLY place
              you need to edit to update your resume. Each file
              contains a JavaScript object very similar to JSON—you
              edit the content between the curly braces, keeping the
              first line (window.CV_DATA...) and the final semicolon
              intact.

              No changes to the Talend job or app.js are
              required to change the resume's content.

  WEB/        The web page index.html loads DATA/*.js and js/app.js
              using simple <script> tags (no fetch, so no
              CORS restrictions, so no server required).

  RUNTIME/    Contains progress.js, rewritten by the Talend job at
              each step. The provided file is in its initial state
              (step 0, status READY). It is a JS file that calls
              onProgressUpdate(...), automatically reloaded by the
              page every 500 ms.

  TALEND/     The code for each component to be recreated in Talend Open
              Studio, plus JOB_CONSTRUCTION.txt, which summarizes the
              complete setup and the context variables to be defined.


To test the web output (without Talend, without installing anything):

  1. Open WEB/index.html by double-clicking on it.
  2. As long as no job has been launched, the page remains blank (status "READY")
     — this is normal; it is waiting for the signal from the Talend job.
  3. Click the "👁 Full Overview" button to view the entire CV
     immediately, without having to launch Talend or edit any files.


For the complete CV pipeline, using Talend:

  1. Unzip this folder to a permanent location on your computer.
  2. Open Talend Open Studio and recreate the CV_PIPELINE_TALEND job
     by following TALEND/JOB_CONSTRUCTION.txt (or the PDF guide provided
     alongside it).
  3. Update the context variables with the actual path to this
     folder.
  4. Run the job: the browser opens, and the page is built with
     your actual data, section by section, every 3 seconds.


To host this project (e.g., GitHub Pages):

  The same code works as-is once hosted at http:// — the
  <script> tags have no CORS restrictions, unlike
  fetch(). Simply publish the contents of WEB/ and DATA/ (adjust
  the relative paths "../DATA/" if necessary if the
  folder structure changes).

For full details (diagrams, complete code, architectural choices):
see the two PDFs provided separately — "Construction Guide" and
"Architecture Note."
