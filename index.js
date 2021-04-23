console.log("Hi");

const learnerDictionApiKey = "3248df3e-261a-4346-bf3d-e4d8e4480e1e";
const learnerDictionarybaseURL = "https://www.dictionaryapi.com/api/v3/references/learners/json/";
// const thesaurusApiKey = "969242a7-379c-400e-8c2b-e07bdc47843c";
// const thesaurusBaseURL = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/";
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
        });
    }
})

function getDictionary(word) {    
    return fetch(learnerDictionarybaseURL+word+"?key="+learnerDictionApiKey)
        .then(resp => resp.json());
}

// function getThesaurus(word) {
//     return fetch(thesaurusBaseURL+word+"?key="+thesaurusApiKey)
//         .then(resp => resp.json());
// }

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
                drpdef.forEach(sseq => {                    
                    const visUL = document. createElement("ul");
                    visUL.className = "vis-ul";
                    (sseq.sseq).forEach(array1 => {                                          
                        array1.forEach(sense => {
                            if(typeof(sense) === "object") {                                
                                sense.forEach(a => {                  
                                    if(typeof(a) === "object") {                                      
                                        if(typeof(a.dt) === "object") {
                                            const adt = a.dt;
                                            adt.forEach(b => {
                                                if(typeof(b[1]) == typeof("")) {                                                                                                   
                                                    const phraseDefinition = document.createElement("li");
                                                    phraseDefinition.className = "phrase-def";
                                                    phraseDefinition.innerHTML = `<span class="phrase-def">phrase definition: </span>${b[1]}`;
                                                    visUL.appendChild(phraseDefinition);
                                                }
                                                Array.from(b).forEach(c => {
                                                    if(typeof(c[1]) == typeof("") && c[1].length > 3) {                                                        
                                                        const phraseDefinition_1 = document.createElement("li");
                                                        phraseDefinition_1.className = "phrase-def";
                                                        phraseDefinition_1.innerHTML = `<span class="phrase-def"> phrase definition: </span>${c[1]}`;
                                                        visUL.appendChild(phraseDefinition_1);
                                                    }                                                                                                        
                                                    if(typeof(c) === "object") {
                                                        Array.from(c).forEach(d => {
                                                            if(typeof(d[1]) == typeof("") && d[1].length > 5) {
                                                                const phraseDefinition_0 = document.createElement("li");
                                                                phraseDefinition_0.className = "phrase-def";
                                                                phraseDefinition_0.innerHTML = `<span class="phrase-def"> phrase definition: </span>${d[1]}`;
                                                                visUL.appendChild(phraseDefinition_0);
                                                            }
                                                                const firstVis = document.createElement("li");
                                                                firstVis.className = "vis";
                                                                if(typeof(d.t) == typeof("")) {                                                                    
                                                                    firstVis.innerHTML = `<span class="vis">verbal illustration: </span>${d.t}`;
                                                                    visUL.appendChild(firstVis);
                                                                    phraseOL.appendChild(visUL);
                                                                    drpDiv.appendChild(phraseOL);
                                                                    resultPanel.appendChild(drpDiv);
                                                                }
                                                                Array.from(d).forEach(e => {
                                                                    if(typeof(e[1]) == typeof("") && e[1].length > 3) {                                                                                                                                                  
                                                                        const phraseDefinition_2 = document.createElement("li");
                                                                        phraseDefinition_2.className = "phrase-def";
                                                                        phraseDefinition_2.innerHTML = `<span class="phrase-def"> phrase definition: </span>${e[1]}`;                                                                            visUL.appendChild(phraseDefinition_2);
                                                                        }                                                                        
                                                                    if(typeof(e) === "object") {
                                                                        Array.from(e).forEach(f => {                                                                                
                                                                            if(typeof(f.t) == typeof("")) {
                                                                                const ft = document.createElement("li");
                                                                                ft.className = "vis";
                                                                                ft.innerHTML = `<span class="vis">verbal illustration: </span>${f.t}`;
                                                                                visUL.appendChild(ft);
                                                                                phraseOL.appendChild(visUL);
                                                                                drpDiv.appendChild(phraseOL);
                                                                                resultPanel.appendChild(drpDiv);                                                                           
                                                                            }                                                                                
                                                                            if(typeof(f) === "object") {
                                                                                Array.from(f).forEach(g => {                                                                                        
                                                                                    const gt = document.createElement("li");
                                                                                    gt.className = "vis";
                                                                                    if(typeof(g.t) == typeof("")) {
                                                                                        gt.innerHTML = `<span class="vis">verbal illustration: </span>${g.t}`;
                                                                                        visUL.appendChild(gt);                                                                                            phraseOL.appendChild(visUL);
                                                                                        drpDiv.appendChild(phraseOL);
                                                                                        resultPanel.appendChild(drpDiv);    
                                                                                    }                                                                                  
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

