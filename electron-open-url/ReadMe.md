This is an Electron experiment of the [will-download](https://www.electronjs.org/docs/latest/api/download-item) event

I want to intercept this event and then do some checks. If the checks pass, then delegate the auto-opening of the hosted file based on the associated protocol of the _underlying OS_. I used _electron's_ `shell` api for that.

E.g. A _Word_ document shoule be opened using installed version of _MS WORD_


------------------------

- Open the Project in editor of your choice
- npm i
- npm run serve (assuming port 8080 is free, if not then search and replace 8080 in the code with the port of your choice)
- npm run start