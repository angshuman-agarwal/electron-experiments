This is an Electron experiment of auto-opening a hosted file using the [will-download](https://www.electronjs.org/docs/latest/api/download-item) event

I want to intercept this event and then do some checks. If the checks pass, then delegate the auto-opening of the hosted file based on the associated protocol of the _underlying OS_. I used _electron's_ `shell` api for that.

E.g. A _Word_ document should be opened using installed version of _MS WORD_

#### Open Issue PDFs open inline viewer which is not ideal. Can the PDF open in the viewer in a new window or how can I delegate to OS ?
------------------------

- Open the Project in editor of your choice
- npm i
- npm run serve (assuming port 8080 is free, if not then search and replace 8080 in the code with the port of your choice)
- npm run start
