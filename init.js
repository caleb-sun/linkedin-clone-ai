import { GoogleGenerativeAI } from "@google/generative-ai";

function initGemini() {
console.log("hi")
    // Access your API key (see "Set up your API key" above)
    const genAI = new GoogleGenerativeAI("");
    console.log(genAI)
    console.log("hi")

}

document.addEventListener("DOMContentLoaded", function() {
    initGemini();
});