console.log("Hi");

const learnerDictionApiKey = "3248df3e-261a-4346-bf3d-e4d8e4480e1e";
const learnerDictionarybaseURL = "https://www.dictionaryapi.com/api/v3/references/learners/json/";
const thesaurusApiKey = "969242a7-379c-400e-8c2b-e07bdc47843c";
const thesaurusBaseURL = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/";
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
    else if(searchType.value === "def") {
        arrOfRespObjects.then(arr => {
            displayDef(arr);
            console.log(arr);
        });
    }
    else if(searchType.value === "dros") {
        arrOfRespObjects.then(arr => {
            displayDRP(arr);
            console.log(arr);            
        });
    }
    else if(searchType.value === "thesaurus") {
        arrOfRespObjects.then(arr => {
            displaySynonyms(arr);
            console.log(arr);
        })
    }
})

function getDictionary(word) {    
    return fetch(learnerDictionarybaseURL+word+"?key="+learnerDictionApiKey)
        .then(resp => resp.json());
}

function getThesaurus(word) {
    return fetch(thesaurusBaseURL+word+"?key="+thesaurusApiKey)
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
        })       
        shortDefDiv.appendChild(functionalLabel);
        shortDefDiv.appendChild(unorderedList);
        resultPanel.appendChild(shortDefDiv);
    });
}

function displaySynonyms(arrOfRespObjects) {
    resultPanel.innerHTML = "";
    
    arrOfRespObjects.forEach(respObj => {
        const flText = respObj.fl;
        const headword = respObj.hwi.hw;
        console.log("fl: " + flText);
        console.log("hw: " + headword);
        const synText = respObj.meta.stems;
        console.log("synonyms: " + synText);
        const sdText = respObj.shortdef;
        console.log("short def: " + sdText);

        const unorderedList = document.createElement("ul");
        const fl = document.createElement("li");
        fl.className = "fl";
        fl.textContent = flText;
        const hw = document.createElement("h3");
        hw.className = "hwi";
        hw.textContent = headword;
        const shortDef = document.createElement("li");
        shortDef.className = "short-def";
        shortDef.innerHTML = `<span class="short-def-span">short definition: </span>${sdText}`;
        const synonyms = document.createElement("li");
        synonyms.className = "synonyms";
        synonyms.innerHTML = `<span class="syn-span">synonyms: </span>${synText}`;

        const thesaurusDiv = document.createElement("div");
        thesaurusDiv.className = "thesaurus-div";
        unorderedList.appendChild(fl);
        unorderedList.appendChild(hw);
        unorderedList.appendChild(shortDef);
        unorderedList.appendChild(synonyms);
        thesaurusDiv.appendChild(unorderedList);
        resultPanel.appendChild(thesaurusDiv);
    })
    
}

function displayDRP(arrOfRespObjs) {
    resultPanel.innerHTML = "";
    arrOfRespObjs.forEach(respObj => {
        const drpDiv = document.createElement("div");
        drpDiv.className = "drp-div";
        const functionalLabel = document.createElement("li");
        functionalLabel.className = "fl";
        functionalLabel.textContent = respObj.fl;
        const functionalLabelConsole = respObj.fl;
        console.log("fl: " + functionalLabelConsole);
        const headword = document.createElement("h3");
        headword.className = "hwi";
        headword.textContent = respObj.hwi.hw;
        const headwordConsole = respObj.hwi.hw;
        console.log("hw:" + headwordConsole);
        const unorderedList = document.createElement("ul");
        unorderedList.appendChild(headword);
        
        //respObj.dros
        if(respObj.dros) {
            const drosLayer = respObj.dros;
            console.log(drosLayer);
            drpDiv.appendChild(functionalLabel);
            drpDiv.appendChild(unorderedList);
            resultPanel.appendChild(drpDiv);
            const phraseOL = document.createElement("ol");
            phraseOL.className = "ordered-list";
            phraseOL.classList.add = "dros";
            //orderedList.textContent = drosLayer;


            drosLayer.forEach(dros => {
                console.log("phrase: " + dros.drp);
                
                const drPhrase = document.createElement("li");
                drPhrase.className = "drp";
                drPhrase.innerHTML = `<span class="phrase">phrase: </span>${dros.drp}`;
                phraseOL.appendChild(drPhrase);
                drpDiv.appendChild(phraseOL);
                resultPanel.appendChild(drpDiv);

                console.log("def: " + dros.def);
                // above logs "def: [object Object]"
                const dros_def = Array.from(dros.def);//an array with an object in it---{sseq: Array(1)}
                console.log("def: " + dros_def);
                //above logs: [{...}]
                console.log(typeof(dros_def));
                //above logs: "object"
                dros_def.forEach(dros_defLayer => {
                    // const drpDefDiv = document.createElement("div");
                    // drpDefDiv.className = "drp-def-div";
                    const visUL = document. createElement("ul");
                    visUL.className = "vis-ul";
                    //visUL.classList.add = "ordered-list";

                    console.log("sseq: " + dros_defLayer.sseq); //an array of object whose key is sseq
                    // logs: "sseq: sense, [object Object]"
                    console.log(typeof(dros_defLayer));
                    // logs: "object"
                    
                    Array.from(dros_defLayer.sseq).forEach(sseq => {
                        console.log("senses: " + sseq); 
                        //logs: "senses: sense, [object Object]" 
                        Array.from(sseq).forEach(sense => {
                            console.log("this is not dt layer yet: " + sense);
                            //the above logs to the console:
                            //"is this dt? sense, [object Object]
                            
                            if(typeof(sense) === "object") {                                
                                sense.forEach(a => {
                                    console.log("this layer is an array, [['sense', [...]], datatype is: " + typeof(a));
                                    console.log("elements inside an array whose key is dt, this key is inside an object: " + a);                   
                                        if(typeof(a) === "object") {
                                            console.log(a.dt);                                            
                                            console.log(typeof(a.dt));                      
                                            if(typeof(a.dt) === "object") {
                                                const adt = a.dt;
                                                console.log("This is dt layer:" + adt);
                                                Array.from(adt).forEach(b => {
                                                    console.log(b);
                                                    Array.from(b).forEach(c => {
                                                        console.log(c);
                                                        console.log(typeof(c));
                                                            if(typeof(c) === "object") {
                                                                Array.from(c).forEach(d => {
                                                                    console.log(d);
                                                                    console.log(typeof(d));
                                                                    console.log(d.t);
                                                                    const firstVis = document.createElement("li");
                                                                    firstVis.className = "vis";
                                                                    if(typeof(d.t) == typeof("")) {
                                                                    firstVis.innerHTML = `<span class="vis">verbal illustration: </span>${d.t}`;
                                                                    }                     
                                                                    visUL.appendChild(firstVis);
                                                                    phraseOL.appendChild(visUL);
                                                                    drpDiv.appendChild(phraseOL);
                                                                    resultPanel.appendChild(drpDiv);
                                                                    Array.from(d).forEach(e => {
                                                                            console.log(e);
                                                                            console.log(typeof(e));
                                                                            console.log(e.t);
                                                                            const et = document.createElement("li");
                                                                            et.className = "vis";
                                                                            if(typeof(e.t) == typeof("")) {
                                                                                et.innerHTML = `<span class="vis">verbal illustration: </span>${e.t}`;
                                                                                }
                                                                            visUL.appendChild(et);
                                                                            phraseOL.appendChild(visUL);
                                                                            drpDiv.appendChild(phraseOL);
                                                                            resultPanel.appendChild(drpDiv);
                                                                            if(typeof(e) === "object") {
                                                                                Array.from(e).forEach(f => {
                                                                                    console.log(f);
                                                                                    console.log(typeof(f));
                                                                                    console.log(f.t);
                                                                                    const ft = document.createElement("li");
                                                                                    ft.className = "vis";
                                                                                    if(typeof(f.t) == typeof("")) {
                                                                                        ft.innerHTML = `<span class="vis>verbal illustration: </span>${f.t}`;
                                                                                        }
                                                                                    visUL.appendChild(ft);
                                                                                    phraseOL.appendChild(visUL);
                                                                                    drpDiv.appendChild(phraseOL);
                                                                                    resultPanel.appendChild(drpDiv);
                                                                                    if(typeof(f) === "object") {
                                                                                        Array.from(f).forEach(g => {
                                                                                            console.log(g);
                                                                                            console.log(typeof(g));                                                                                            
                                                                                                console.log(g.t);
                                                                                                
                                                                                                const gt = document.createElement("li");
                                                                                                gt.className = "vis";
                                                                                                if(typeof(g.t) == typeof("")) {
                                                                                                    gt.innerHTML = `<span class="vis">verbal illustration: </span>${g.t}`;
                                                                                                    }
                                                                                                    visUL.appendChild(gt);
                                                                                                    phraseOL.appendChild(visUL);
                                                                                                    drpDiv.appendChild(phraseOL);
                                                                                                    resultPanel.appendChild(drpDiv);                                                                                            
                                                                                            // if(typeof(g) === "object") {
                                                                                            //     Array.from(g).forEach(h => {
                                                                                            //         console.log(h);
                                                                                            //         console.log(typeof(h));
                                                                                            //         console.log(h.t);
                                                                                            //         const ht = document.createElement("li");
                                                                                            //         ht.className = "vis";
                                                                                            //         if(typeof(h.t) == typeof("")) {
                                                                                            //             ht.innerHTML = `<span class="vis">verbal illustration: </span>${h.t}`;
                                                                                            //             }
                                                                                            //             visUL.appendChild(ht);                                               
                                                                                            //             // drpDefDiv.appendChild(visUL);
                                                                                            //             drpDiv.appendChild(visUL);
                                                                                            //             resultPanel.appendChild(drpDiv);
                                                                                            //             if(typeof(h) === "object") {
                                                                                            //                 Array.from(h).forEach(m => {
                                                                                            //                     console.log(m);
                                                                                            //                     console.log(typeof(m));
                                                                                            //                     console.log(m.t);
                                                                                            //                     const mt = document.createElement("li");
                                                                                            //                     mt.className = "vis";
                                                                                            //                     if(typeof(m.t) == typeof("")) {
                                                                                            //                         mt.innerHTML = `<span class="vis">verbal illustration: </span>${m.t}`;
                                                                                            //                         }
                                                                                            //                         visUL.appendChild(mt);                                               
                                                                                            //                         // drpDefDiv.appendChild(visUL);
                                                                                            //                         drpDiv.appendChild(visUL);
                                                                                            //                         resultPanel.appendChild(drpDiv);
                                                                                            //                     Array.from(m).forEach(n => {
                                                                                            //                         console.log(n.t);
                                                                                            //                         const nt = document.createElement("li");
                                                                                            //                         nt.className = "vis";
                                                                                            //                         if(typeof(n.t) == typeof("")) {
                                                                                            //                             nt.innerHTML = `span class="vis">verbal illustration: </span>${n.t}`;
                                                                                            //                             visUL.appendChild(nt);
                                                                                            //                             drpDiv.appendChild(visUL);
                                                                                            //                             resultPanel.appendChild(drpDiv);
                                                                                            //                         }
                                                                                            //                     })
                                                                                            //                 })                                                                                                        
                                                                                            //             }
                                                                                                    
                                                                                            //     })
                                                                                            // }
                                                                                        })
                                                                                    }
                                                                                                                                                                                                                                            
                                                                            })
                                                                        }
                                                                    }) 
                                                                })                                                    
                                                            }
                                                    })
                                                })
                                            }
                                        }
                                }) 
                            }
                                                                                  
                        })                                        
                    })
                })                        
            })   
        }
    })    
}

function displayDef(arrOfRespObjects) {
    resultPanel.innerHTML = "";
    arrOfRespObjects.forEach(respObj => {
        const defDiv = document.createElement("div");
        defDiv.className = "def-div";
        const functionalLabel = document.createElement("li");
        functionalLabel.className = "fl";
        functionalLabel.textContent = respObj.fl;
        const functionalLabelConsole = respObj.fl;
        console.log("fl: " + functionalLabelConsole);
        const headword = document.createElement("h3");
        headword.className = "hwi";
        headword.textContent = respObj.hwi.hw;
        const headwordConsole = respObj.hwi.hw;
        console.log("hw:" + headwordConsole);
        const unorderedList = document.createElement("ul");
        unorderedList.appendChild(headword);

        if(respObj.def) {
            const defConsole = respObj.def;
            console.log(defConsole);            
            console.log(typeof(defConsole));
            //logs: [{...}],
            //      "object"
            const def = document.createElement("li");
            def.classList.add = "def";
            def.textContent = `def: ${defConsole}`;
            defDiv.appendChild(functionalLabel);
            defDiv.appendChild(unorderedList);
            defDiv.appendChild(def);
            resultPanel.appendChild(defDiv);

            defConsole.forEach(abc => {
                console.log(abc);
                console.log(typeof(abc));
                console.log(abc.sseq);
                console.log(typeof(abc.sseq));
                //logs: {sseq: Array(4)},
                //      "object"                
                //logs: (4) [Array(1), Array(1), Array(1), Array(1)],
                //      "object"
                (abc.sseq).forEach(bcd => {
                    console.log(bcd);
                    console.log(typeof(bcd));
                    //logs: [Array(2)]
                    //      "object"
                    //logs: [Array(2)]
                    //      "object"
                    //logs: [Array(2)]
                    //      "object"
                    //logs: [Array(2)]
                    //      "object"
                    bcd.forEach(cde => {
                        console.log(cde);
                        console.log(typeof(cde));
                        //logs: (2) ["sense", {...}]
                        //      "object"
                        //logs: (2) ["sense", {...}]
                        //      "object"
                        //logs: (2) ["sense", {...}]
                        //      "object"
                        //logs: (2) ["sense", {...}]
                        //      "object"
                        cde.forEach(def => {
                            console.log(def);
                            console.log(typeof(def));
                            //logs: "sense"
                            //      "string"
                            //      {sn: "1", lbs: Array(1), dt: Array(2)}
                            //      "object"
                            //logs the same as above 3 more times
                            //console.log(def.sn);//logs: "undefined"
                            if(typeof(def) === "object") {
                                Array.from(def).forEach(efg => {
                                    console.log(efg.sn);
                                    
                                    console.log(typeof(efg.sn));
                                    //logs: [Array(2)]
                                    //      "object"
                                    //logs: (2) ["sense", {...}]
                                    //      "object"
                                    //if(typeof(efg.dt) === "object") {
                                        Array.from(efg.dt).forEach(fgh => {
                                            console.log(fgh);
                                            console.log(typeof(fgh));
                                            //logs: "sense",
                                            //      "string"
                                            //      {sn: "1", dt: Array(1)}
                                            //      "object"
                                            //logs the same as above 3 more times                                  
                                            // if(typeof(fgh) === "object") {
                                            //     console.log(fgh.sn);
                                            //     Array.from(fgh.dt).forEach(ghi => {
                                            //         console.log(ghi);
                                            //         console.log(typeof(ghi));
                                            //         //logs: 
                                            //     })
                                            // }
                                        })
                                    //}

                                })
                            }
                        })
                    })
                })
            })
 
        }
    })    
}