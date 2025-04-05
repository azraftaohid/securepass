import { customAlphabet } from "https://cdn.jsdelivr.net/npm/nanoid@5.1.5/index.browser.min.js";

const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SPECIAL_CHARS = "!@#$%^&*()_+";

const CHARACTERS = UPPERCASE_CHARS + LOWERCASE_CHARS + DIGITS + SPECIAL_CHARS;

const output = document.getElementById("output");

const path = window.location.pathname;

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const size = params.get("size") ? parseInt(params.get("size"), 10) : null;

const toggleLink = document.getElementById('toggle-link');

const fetchWordList = async (listNo) => {
	const res = await fetch("assets/word-list-" + listNo + ".json");
	return res.json();
};

let strGenerator;
const generateRandomString = () => {
	if (!strGenerator) strGenerator = customAlphabet(CHARACTERS);
	return strGenerator(size || 20);
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
