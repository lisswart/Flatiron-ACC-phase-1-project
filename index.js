console.log("Hi");

const learnerDictionApiKey = "3248df3e-261a-4346-bf3d-e4d8e4480e1e";
const learnerDictionarybaseURL = "https://www.dictionaryapi.com/api/v3/references/learners/json/";
const resultPanel = document.querySelector("#result-panel");
const searchType = document.querySelector("#search-type");
const lookUpWord = document.querySelector("#search-box");
const searchButton = document.querySelector("#search-button");

searchButton.addEventListener("click", event => {
    event.preventDefault();
    const arrOfRespObjects = getDictionary(lookUpWord.value);
    if(searchType.value === "short-def") {
        arrOfRespObjects.then( arr => {
            displayShortDef(arr);
            console.log(arr);
        });
    }    
    else if(searchType.value === "dros") {
        arrOfRespObjects.then(arr => {
            displayDRP(arr);
            console.log(arr);            
        })
    }
    else if(searchType.value === "def") {
        arrOfRespObjects.then(arr => {
            displayDef(arr);
            console.log(arr);
        })
    }
});

function getDictionary(word) {    
    return fetch(learnerDictionarybaseURL+word+"?key="+learnerDictionApiKey)
        .then(resp => resp.json());
}

function displayShortDef(arrayOfObjects) {
    resultPanel.innerHTML = "";
    arrayOfObjects.forEach(object => {
        const shortDefDiv = document.createElement("div");
        shortDefDiv.className = "short-definition-div";
        const functionalLabel = document.createElement("li");
        functionalLabel.className = "fl";
        functionalLabel.textContent = object.fl;
        const headword = document.createElement("h3");
        headword.className = "hwi";
        headword.textContent = object.hwi.hw;
        const unorderedList = document.createElement("ul");
        unorderedList.appendChild(headword);
        const arrOfShortDef = object.shortdef;
        arrOfShortDef.forEach( strings => {
            const para = document.createElement("li");
            para.textContent = strings;
            unorderedList.appendChild(para);
        });       
        shortDefDiv.appendChild(functionalLabel);
        shortDefDiv.appendChild(unorderedList);
        resultPanel.appendChild(shortDefDiv);
    });
}

function displayDef(arrayOfObjects) {
    resultPanel.innerHTML = "";
    arrayOfObjects.forEach(resp => {
        const defDiv = document.createElement("div");
        defDiv.className = "def-div";
        const orderedList = document.createElement("ol");
        orderedList.className = "ol";
        const functionalLabel = document.createElement("li");
        functionalLabel.className = "fl";
        functionalLabel.textContent = resp.fl;
        const headword = document.createElement("h3");
        headword.className = "def-hw";
        headword.textContent = resp.hwi.hw;
        defDiv.appendChild(functionalLabel);
        defDiv.appendChild(headword);
        
        const objDef = resp.def;
        if(typeof(objDef) === "object") {
            objDef.forEach(defArray => {
                const sseq = defArray.sseq;
                sseq.forEach(sense => {
                    sense.forEach(senseLayer => {
                        senseLayer.forEach(dt => {
                            const t = dt.dt;
                            if(typeof(t) === "object") {
                                t.forEach(t_0 => {
                                    t_0.forEach(textvis => {
                                        if(typeof(textvis) === "string" && textvis.length > 10) {                                            
                                            const defText = document.createElement("li");
                                            defText.className = "def-text";
                                            defText.textContent = textvis;
                                            orderedList.appendChild(defText);
                                            defDiv.appendChild(orderedList);
                                            resultPanel.appendChild(defDiv);
                                        }
                                        const visUL = document.createElement("ul");
                                        Array.from(textvis).forEach(vis => {
                                            if(typeof(vis) != typeof("")) {                                                
                                                const vis_t = document.createElement("li");
                                                vis_t.className = "vis";
                                                vis_t.textContent = vis.t;
                                                visUL.appendChild(vis_t);
                                                orderedList.appendChild(visUL);
                                                defDiv.appendChild(orderedList);
                                                resultPanel.appendChild(defDiv);
                                            }
                                        })
                                    })
                                })
                            }
                        })
                    })               
                })
            })
        }
    })
}

function displayDRP(arrOfRespObjs) {
    resultPanel.innerHTML = "";
    arrOfRespObjs.forEach(respObj => {        
        const drpDiv = document.createElement("div");
        drpDiv.className = "drp-div";
        const unorderedList = document.createElement("ul");
        unorderedList.className = "ul";

        const functionalLabel = document.createElement("li");
        functionalLabel.className = "fl";
        functionalLabel.textContent = respObj.fl;        
        const headword = document.createElement("h3");
        headword.className = "hwi";
        headword.textContent = respObj.hwi.hw;
        drpDiv.appendChild(functionalLabel);                
        
        if(respObj.dros) {
            unorderedList.appendChild(headword);
            drpDiv.appendChild(unorderedList);                       
            resultPanel.appendChild(drpDiv);
            
            const phraseOL = document.createElement("ol");
            phraseOL.className = "ordered-list";
            phraseOL.classList.add = "phrases";

            const dros = respObj.dros;
            dros.forEach(drp => {
                const drPhrase = document.createElement("li");
                drPhrase.className = "drp";
                drPhrase.innerHTML = `<span class="phrase">phrase: </span>${drp.drp}`;
                phraseOL.appendChild(drPhrase);
                drpDiv.appendChild(phraseOL);
                resultPanel.appendChild(drpDiv);
                const drpdef = drp.def;
                getDrpDef(drpdef, drpDiv, phraseOL);
            });   
        }
    });    
}

function getDrpDef(drpdef, drpDiv, phraseOL) {               
    drpdef.forEach(sseq => {
        (sseq.sseq).forEach(array1 => {                                          
            array1.forEach(sense => {
                if(typeof(sense) === "object") {                                
                    sense.forEach(a => {                  
                        if(typeof(a) === "object") {
                            if(a.dt) {
                                dtTrooper(drpDiv, phraseOL, a);
                            }
                        }
                    }); 
                }                                                                                  
            });                                        
        });
    });
}

function displayPhraseDefinition(text, visUL) {
    const phraseDefinition_0 = document.createElement("li");
    phraseDefinition_0.className = "phrase-def";
    phraseDefinition_0.innerHTML = `<span class="phrase-def">phrase definition: </span>${text}`;
    visUL.appendChild(phraseDefinition_0);
}

function displayVerbalIllustrations(dt, visUL, phraseOL, drpDiv) {
    const dt_0 = document.createElement("li");
    dt_0.className = "vis";                                                                    
    dt_0.innerHTML = `<span class="vis">verbal illustration: </span>${dt}`;
    visUL.appendChild(dt_0);
    phraseOL.appendChild(visUL);
    drpDiv.appendChild(phraseOL);
    resultPanel.appendChild(drpDiv);
}

function dtTrooper(drpDiv, phraseOL, a) {
    if(typeof(a.dt) === "object") {
        const visUL = document. createElement("ul");
        visUL.className = "vis-ul";                                             
        (a.dt).forEach(b => {
            if(typeof(b[1]) == typeof("")) {
                displayPhraseDefinition(b[1], visUL);
            }
            b.forEach(c => {
                if(typeof(c[1]) == typeof("") && c[1].length > 3) {
                    displayPhraseDefinition(c[1], visUL);
                }                                                                                                        
                if(typeof(c) === "object") {
                    c.forEach(d => {
                        if(typeof(d[1]) == typeof("") && d[1].length > 5) {
                            displayPhraseDefinition(d[1], visUL);
                        }                                                                                                                            
                        if(typeof(d.t) == typeof("")) {
                            const dt = d.t;
                            displayVerbalIllustrations(dt, visUL, phraseOL, drpDiv);                            
                        }
                        //error thrown: "d.forEach is not a function"
                        //reason: d is an array-like iterable object but not an array per se
                        //fix: utilize Array.from(arraylike) to convert an array-like object to an array                                                                
                        Array.from(d).forEach(e => {
                            if(typeof(e[1]) == typeof("") && e[1].length > 3) {
                                displayPhraseDefinition(e[1], visUL);
                            }                                                                        
                            if(typeof(e) === "object") {
                                e.forEach(f => {                                                                                
                                    if(typeof(f.t) == typeof("")) {
                                        const ft = f.t;
                                        displayVerbalIllustrations(ft, visUL, phraseOL, drpDiv);                                                                                                                                   
                                    }                                                                                
                                    if(typeof(f) === "object") {
                                        //error thrown: "f.forEach is not a function"
                                        //reason: f is an array-like iterable object but not an array per se
                                        //fix: utilize Array.from(arraylike) to convert an array-like object to an array 
                                        Array.from(f).forEach(g => {                                                                          
                                            if(typeof(g.t) == typeof("")) {
                                                const gt = g.t;
                                                displayVerbalIllustrations(gt, visUL, phraseOL, drpDiv);
                                            }                                                                                  
                                        });                                                                            
                                    }                                                                                                                                                                                                                                            
                                });
                            }
                        }); 
                    });                                                    
                }
            });
        });
    }
}