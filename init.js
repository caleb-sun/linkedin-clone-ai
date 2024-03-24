import { GoogleGenerativeAI } from "@google/generative-ai";

function initGemini() {
    // Access your API key (see "Set up your API key" above)
    const genAI = new GoogleGenerativeAI("");
    console.log(genAI)
    sessionStorage.clear();

}

document.addEventListener("DOMContentLoaded", function() {
    initGemini();
});