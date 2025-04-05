import { customAlphabet } from "https://cdn.jsdelivr.net/npm/nanoid@5.1.5/index.browser.min.js";

const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SPECIAL_CHARS = "!@#$%^&*()_+";

const path = window.location.pathname;

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const size = params.get("size") ? parseInt(params.get("size"), 10) : null;

const output = document.getElementById("output");
const toggleLink = document.getElementById('toggle-link');
const charOptionsDiv = document.getElementById("char-options");

const getCurrentCharset = () => {
	let chars = "";
	if (document.getElementById("opt-lower")?.checked) chars += LOWERCASE_CHARS;
	if (document.getElementById("opt-upper")?.checked) chars += UPPERCASE_CHARS;
	if (document.getElementById("opt-digits")?.checked) chars += DIGITS;
	if (document.getElementById("opt-special")?.checked) chars += SPECIAL_CHARS;
	return chars || LOWERCASE_CHARS; // fallback to lowercase
};

const fetchWordList = async (listNo) => {
	const res = await fetch("assets/word-list-" + listNo + ".json");
	return res.json();
};

const generators = {};
const generateRandomString = () => {
	const charset = getCurrentCharset();
	if (!generators[charset]) generators[charset] = customAlphabet(charset);

	return generators[charset](size || 20);
};

const generateRandomWords = async () => {
	const wordCount = size || 6;
	const wordsPromise = Array.from({ length: wordCount }, async () => {
		const listNo = Math.floor(Math.random() * 24) + 1;
		const words = await fetchWordList(listNo);

		return words[Math.floor(Math.random() * words.length)];
	});

	const words = await Promise.all(wordsPromise);
	return words.join("-");
};

function generateOutput() {
	if (path === "/words") {
		return generateRandomWords();
	} else {
		return generateRandomString();
	}
}

async function updateOutput() {
	try {
		output.textContent = await generateOutput();
	} catch (error) {
		console.error("Error updating output:", error);
		output.textContent = "Error generating output.";
		return;
	}
}

// Initial render
updateOutput();

// disable checkboxes on /words
if (path === "/words") {
	document.querySelectorAll("#char-options input").forEach(input => input.disabled = true);
} else {
	document.querySelectorAll("#char-options input").forEach(input => {
		input.addEventListener("change", () => {
			updateOutput(); // regenerate on change
		});
	});
}

// Copy to clipboard
document.getElementById('copy-btn').addEventListener('click', () => {
	const text = document.getElementById('output').innerText;
	navigator.clipboard.writeText(text).then(() => {
		const btn = document.getElementById('copy-btn');
		btn.textContent = 'Copied!';
		setTimeout(() => (btn.textContent = 'Copy'), 1500);
	});
});

// Regenerate output
document.getElementById('regen-btn').addEventListener('click', () => {
	updateOutput();
});

if (path === '/words') {
	toggleLink.textContent = 'Characters';
	toggleLink.href = '/';
} else {
	toggleLink.textContent = 'Words';
	toggleLink.href = '/words';
}
