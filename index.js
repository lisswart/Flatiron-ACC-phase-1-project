const learnerDictionApiKey = "3248df3e-261a-4346-bf3d-e4d8e4480e1e";
const learnerDictionarybaseURL = "https://www.dictionaryapi.com/api/v3/references/learners/json/";
const thesaurusAPIkey = "969242a7-379c-400e-8c2b-e07bdc47843c";
const thesaurusBaseURL = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/";
const resultPanel = document.getElementById("result-panel");
const searchType = document.getElementById("search-type");
const lookUpWord = document.getElementById("search-box");
const searchButton = document.getElementById("search-button");
const audioBase = "https://media.merriam-webster.com/audio/prons/en/us/mp3/";
        
searchButton.addEventListener("click", event => {
    event.preventDefault();
    if(searchType.value === "short-def") {
        const arrOfRespObjs = getDictionary(lookUpWord.value);
        arrOfRespObjs.then(arr => {
            displayShortDef(arr);
            console.log(arr);
        });
    }    
    else if(searchType.value === "dros") {
        const arrOfRespObjs = getDictionary(lookUpWord.value);
        arrOfRespObjs.then(arr => {
            displayDRP(arr);
            console.log(arr);
        });
    }
    else if(searchType.value === "def") {
        const arrOfRespObjs = getDictionary(lookUpWord.value);
        arrOfRespObjs.then(arr => {
            displayDef(arr);
            console.log(arr);
        });
    }
    else if(searchType.value === "syn") {
        const arrOfRespObjs = getThesaurus(lookUpWord.value);
        arrOfRespObjs.then(arr => {
            displaySynonyms(arr);
            console.log(arr);
        });
    }
});

function getDictionary(word) {    
    return fetch(learnerDictionarybaseURL+word+"?key="+learnerDictionApiKey)
            .then(resp => resp.json());
}

function getThesaurus(word) {
    return fetch(`${thesaurusBaseURL}${word}?key=${thesaurusAPIkey}`)
            .then(resp => resp.json());
}

function displaySynonyms(arrayOfObjects) {
    resultPanel.innerHTML = "";
    arrayOfObjects.forEach(object => {
        if(typeof object !== "string") {
            const synDiv_0 = document.createElement("div");
            synDiv_0.className = "syn-div-0";
            const functionalLabel = document.createElement("p");
            functionalLabel.className = "fl";
            functionalLabel.textContent = object.fl;
            const headword = document.createElement("h3");
            headword.className = "hwi";
            headword.textContent = object.hwi;
            headword.textContent = object.hwi.hw;
            synDiv_0.append(functionalLabel, headword);
            (object.def).forEach(defObject => {
                (defObject.sseq).forEach(sense => {
                    sense.forEach(defvis => {
                        defvis.forEach(dtsyn => {
                            const synOL = document.createElement("ol");
                            synOL.className = "syn-ol";   
                            if(typeof(dtsyn) === "object") {                                                      
                                (dtsyn.dt).forEach(dtValue => {                                                              
                                    if(typeof(dtValue[1]) === "string") {
                                        // if(searchType.value !== object.hwi.hw) {
                                        //     alert("there is no synonym list associated with the word you just entered, below is a list of related words and their synonyms")
                                        // }                                    
                                        const definition = document.createElement("li");
                                        definition.className = "def-syn-group";
                                        definition.innerHTML = `<span class="def-syn-group">definition: </span>${dtValue[1]}`;
                                        synDiv_0.appendChild(definition);
                                    }//TypeError:  Cannot read property 'forEach' of undefined
                                    if(Array.isArray(dtValue[1])) {
                                        dtValue[1].forEach(t => {
                                            const vis = document.createElement("p");
                                            vis.className = "syn-vis";
                                            vis.innerHTML= `<span class="syn-vis">verbal illustration: </span>${t.t}`;
                                            synDiv_0.appendChild(vis);
                                        });
                                    }
                                    synOL.appendChild(synDiv_0);
                                    resultPanel.appendChild(synOL);
                                });
                                const synDiv_1 = document.createElement("div");
                                synDiv_1.className = "syn-div-1";
                                if(Array.isArray(dtsyn.syn_list)) {
                                    (dtsyn.syn_list).forEach(synValue => {
                                        const synonymListIntro = document.createElement("ul");
                                        synonymListIntro.className = "syn-list-ul";
                                        synonymListIntro.innerHTML = `<span class="syn-intro">a list of synonyms: </span>`;
                                        synValue.forEach(synObj => {
                                            const synWd = document.createElement("li");
                                            synWd.className = "syn-word";
                                            synWd.textContent = synObj.wd;
                                            synonymListIntro.appendChild(synWd);
                                        });
                                        synDiv_1.appendChild(synonymListIntro);
                                        synDiv_0.appendChild(synDiv_1);
                                        synOL.appendChild(synDiv_0);
                                        resultPanel.appendChild(synOL);
                                    });
                                }
                                if(Array.isArray(dtsyn.near_list)) {
                                    (dtsyn.near_list).forEach(nearAnt => {
                                        const nearAntListIntro = document.createElement("ul");
                                        nearAntListIntro.className = "near-ant-ul";
                                        nearAntListIntro.innerHTML = `<span class="near-ant-intro">a list of near antonyms: </span>`;
                                        nearAnt.forEach(nearAntObj => {
                                            const nearAntWd = document.createElement("li");
                                            nearAntWd.className = "near-ant-word";
                                            nearAntWd.textContent = nearAntObj.wd;
                                            nearAntListIntro.appendChild(nearAntWd);
                                        });
                                        synDiv_1.appendChild(nearAntListIntro);
                                        synDiv_0.appendChild(synDiv_1);
                                        synOL.appendChild(synDiv_0);
                                        resultPanel.appendChild(synOL);
                                    });
                                }
                            }
                        });                    
                    });                
                });
            });
        }
        else {
            const stems = document.createElement("ul");
            stems.className = " stems";
            stems.textContent = object;
            resultPanel.appendChild(stems);
        }   
    });
}
        
function displayShortDef(arrayOfObjects) {
    resultPanel.innerHTML = "";
    arrayOfObjects.forEach(object => {
        if(typeof object !== "string") {
            const shortDefDiv = document.createElement("div");
            shortDefDiv.className = "short-definition-div";
            const functionalLabel = document.createElement("li");
            functionalLabel.className = "fl";
            functionalLabel.textContent = object.fl;
            const unorderedList = document.createElement("ul");
            const headword = document.createElement("h3");
            headword.className = "hwi";
            headword.textContent = object.hwi.hw;
            if(object.hwi.prs) {
                const element = object.hwi.prs;
                    if(element[0].sound) {
                        const baseFileName = element[0].sound.audio;
                        const audio = document.createElement("audio");
                        audio.className = "audio";
                        audio.controls = "controls";
                        const source = document.createElement("source");
                        source.className = "source";
                        let subDirectory = baseFileName.slice(0, 1);
                        console.log(subDirectory);
                        if(Number.isInteger(parseInt(subDirectory))) {
                            subDirectory = "number";
                            source.src = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subDirectory}/${baseFileName}.mp3`;
                        }
                        source.src = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subDirectory}/${baseFileName}.mp3`;
                        audio.appendChild(source);
                        unorderedList.appendChild(headword);
                        unorderedList.appendChild(audio);
                    }
            }
            unorderedList.appendChild(headword);
            const arrOfShortDef = object.shortdef;
            arrOfShortDef.forEach( strings => {
                const para = document.createElement("li");
                para.className = "short-def";
                para.textContent = strings;
                unorderedList.appendChild(para);
            });
            shortDefDiv.appendChild(functionalLabel);
            shortDefDiv.appendChild(unorderedList);
            resultPanel.appendChild(shortDefDiv);
        }
        else {
            const stems = document.createElement("ul");
            stems.className = "stems";
            stems.textContent = object;
            resultPanel.appendChild(stems);
        }
    });
}
        
function displayDef(arrayOfObjects) {
    resultPanel.innerHTML = "";
    arrayOfObjects.forEach(resp => {
        if(typeof(resp) !== "string") {
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
            if(resp.hwi.prs) {
                (resp.hwi.prs).forEach(element => {
                    defDiv.appendChild(headword);
                    if(element.sound) {
                        const baseFileName = element.sound.audio;
                        const subDirectory = baseFileName.slice(0, 1);
                        const audio = document.createElement("audio");
                        audio.className = "audio";
                        audio.controls = "controls";
                        const source = document.createElement("source");
                        source.className = "source";
                        source.src = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subDirectory}/${baseFileName}.mp3`;
                        audio.appendChild(source);                        
                        defDiv.appendChild(audio);
                    }
                })
            }        
            else {
                defDiv.appendChild(headword);
            }        
            const objDef = resp.def;
            if(Array.isArray(objDef)) {
                objDef.forEach(defArray => {
                    const sseq = defArray.sseq;
                    sseq.forEach(sense => {
                        sense.forEach(senseLayer => {
                            senseLayer.forEach(dt => {
                                const t = dt.dt;
                                if(Array.isArray(t)) {
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
                                                if(typeof(vis) !== "string") {                                                
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
        }
        else {
            const stems = document.createElement("ul");
            stems.className = " stems";
            stems.textContent = resp;
            resultPanel.appendChild(stems);
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
        
        if(respObj.hwi.prs) {
            (respObj.hwi.prs).forEach(element => {
                if(element.sound) {
                    const baseFileName = element.sound.audio;
                    const subDirectory = baseFileName.slice(0, 1);
                    const audio = document.createElement("audio");
                    audio.className = "audio";
                    audio.controls = "controls";
                    const source = document.createElement("source");
                    source.className = "source";
                    source.src = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subDirectory}/${baseFileName}.mp3`;
                    audio.appendChild(source);
                    unorderedList.appendChild(headword);
                    drpDiv.appendChild(unorderedList);
                    drpDiv.appendChild(audio);
                }
            })
        }
        else {
            unorderedList.appendChild(headword);
            drpDiv.appendChild(unorderedList);
        }
        resultPanel.appendChild(drpDiv);
        if(respObj.dros) {
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
                if(typeof(sense) === typeof([])) {                                
                    sense.forEach(a => {                  
                        if(typeof(a) === typeof([])) {
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
    if(typeof(a.dt) === typeof([])) {
        const visUL = document. createElement("ul");
        visUL.className = "vis-ul";                                             
        (a.dt).forEach(b => {
            if(typeof(b[1]) === typeof("")) {
                displayPhraseDefinition(b[1], visUL);
            }
            b.forEach(c => {
                if(typeof(c[1]) === typeof("") && c[1].length > 3) {
                    displayPhraseDefinition(c[1], visUL);
                }                                                                                                        
                if(typeof(c) === typeof([])) {
                    c.forEach(d => {
                        if(typeof(d[1]) === typeof("") && d[1].length > 5) {
                            displayPhraseDefinition(d[1], visUL);
                        }                                                                                                                            
                        if(typeof(d.t) === typeof("")) {
                            const dt = d.t;
                            displayVerbalIllustrations(dt, visUL, phraseOL, drpDiv);                            
                        }
                        //error thrown: "d.forEach is not a function"
                        //reason: d is an array-like iterable object but not an array per se
                        //fix: utilize Array.from(arraylike) to convert an array-like object to an array                                                                
                        Array.from(d).forEach(e => {
                            if(typeof(e[1]) === typeof("") && e[1].length > 3) {
                                displayPhraseDefinition(e[1], visUL);
                            }                                                                        
                            if(typeof(e) === typeof([])) {
                                e.forEach(f => {                                                                                
                                    if(typeof(f.t) === typeof("")) {
                                        const ft = f.t;
                                        displayVerbalIllustrations(ft, visUL, phraseOL, drpDiv);                                                                                                                                   
                                    }                                                                                
                                    if(typeof(f) === typeof([])) {
                                        //error thrown: "f.forEach is not a function"
                                        //reason: f is an array-like iterable object but not an array per se
                                        //fix: utilize Array.from(arraylike) to convert an array-like object to an array 
                                        Array.from(f).forEach(g => {                                                                          
                                            if(typeof(g.t) === typeof("")) {
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