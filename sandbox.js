const thesaurusAPIkey = "969242a7-379c-400e-8c2b-e07bdc47843c";
const thesaurusBaseURL = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/";
fetch(`${thesaurusBaseURL}${word}?key=${thesaurusAPIkey}`)
        .then(resp => resp.json());