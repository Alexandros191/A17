// script.cjs
const { JSDOM } = require("jsdom");

// Create a basic DOM environment
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);

// Access the global 'document' object from the created DOM
const document = dom.window.document;

// Simulate setting the input value (replace this with your actual value)
document.getElementById("email").value = "your_sentinel_address_here";

// Get the value of the input field
const sentinelAddress = document.getElementById("email").value;

console.log("Sentinel Address:", sentinelAddress);

