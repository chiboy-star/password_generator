
const CHAR_SETS = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-={}[];<>:"
};


const UI = {
    display: document.getElementById("password-display"),
    copyBtn: document.getElementById("copy-btn"),
    generateBtn: document.getElementById("generate-btn"),
    lengthSlider: document.getElementById("length-slider"),
    lengthValue: document.getElementById("length-val"),
    checkboxes: {
        lowercase: document.getElementById("lowercase-cb"),
        uppercase: document.getElementById("uppercase-cb"),
        numbers: document.getElementById("numbers-cb"),
        symbols: document.getElementById("symbols-cb")
    }
};

/**
 * Generates a cryptographically secure random number between 0 and max (exclusive).
 * Uses window.crypto instead of Math.random() for actual security.
 * @param {number} max 
 * @returns {number}
 */
function getSecureRandomInt(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

/**
 * Core logic to build the password string based on selected criteria.
 */
function generatePassword() {
    let availableChars = "";
    const length = parseInt(UI.lengthSlider.value, 10);

    // Construct the pool of available characters dynamically
    for (const [key, checkbox] of Object.entries(UI.checkboxes)) {
        if (checkbox.checked) {
            availableChars += CHAR_SETS[key];
        }
    }

    // Edge Case: User unchecked all boxes
    if (availableChars.length === 0) {
        UI.display.value = "Select an option!";
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = getSecureRandomInt(availableChars.length);
        password += availableChars[randomIndex];
    }

    UI.display.value = password;
}

/**
 * Handles the copy to clipboard functionality with visual feedback.
 */
async function copyToClipboard() {
    const currentPassword = UI.display.value;
    
    // Prevent copying empty strings or the error message
    if (!currentPassword || currentPassword === "Select an option!") return;

    try {
        await navigator.clipboard.writeText(currentPassword);
        
        // Visual feedback
        const originalText = UI.copyBtn.textContent;
        UI.copyBtn.textContent = "Copied!";
        UI.copyBtn.style.backgroundColor = "#059669"; // Darker green success state
        
        setTimeout(() => {
            UI.copyBtn.textContent = originalText;
            UI.copyBtn.style.backgroundColor = ""; // Reset to default
        }, 1500);
    } catch (err) {
        console.error("Failed to copy password: ", err);
        UI.copyBtn.textContent = "Error";
    }
}

// Event Listeners
// Live update the number display when dragging the slider
UI.lengthSlider.addEventListener("input", (e) => {
    UI.lengthValue.textContent = e.target.value;
    generatePassword(); // Generate a new password on drag for instant feedback
});

UI.generateBtn.addEventListener("click", generatePassword);
UI.copyBtn.addEventListener("click", copyToClipboard);

// Regenerate password automatically when any checkbox is toggled
Object.values(UI.checkboxes).forEach(checkbox => {
    checkbox.addEventListener("change", generatePassword);
});

// 
// Run once on load so the input isn't empty initially
generatePassword();