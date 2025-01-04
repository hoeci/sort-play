fetch("https://raw.githubusercontent.com/hoeci/sort-play/main/sort-play.js")
    .then(res => res.text()) 
    .then(content => new Blob([content], { type: "application/javascript" }))
    .then(URL.createObjectURL)
    .then(url => import(url));