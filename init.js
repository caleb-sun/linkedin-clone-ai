import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

function initGemini() {
    // Access your API key (see "Set up your API key" above)
    // node --version # Should be >= 18
    // npm install @google/generative-ai

    sessionStorage.clear();

}

document.addEventListener("DOMContentLoaded", function() {
    initGemini();

});