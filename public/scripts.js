import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid@4.0.0/nanoid.js";

const output = document.getElementById("output");

const path = window.location.pathname;

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const size = params.get("size") ? parseInt(params.get("size"), 10) : null;

const toggleBtn = document.getElementById('toggle-btn');

const fetchWordList = async (listNo) => {
	const res = await fetch("assets/word-list-" + listNo + ".json");
	return res.json();
};

const generateRandomString = () => {
	output.textContent = nanoid(size || 20);
};

const generateRandomWords = async () => {
	const wordCount = size || 6;
	const wordsPromise = Array.from({ length: wordCount }, async () => {
		const listNo = Math.floor(Math.random() * 24) + 1;
		const words = await fetchWordList(listNo);

		return words[Math.floor(Math.random() * words.length)];
	});

	Promise.all(wordsPromise).then((words) => {
		output.textContent = words.join(" ");
	}).catch((err) => {
		console.error("Error fetching words:", err);
		output.textContent = "Error fetching words.";
	});
};

function generateOutput() {
	if (path === "/words") {
		generateRandomWords();
	} else {
		generateRandomString();
	}
}

generateOutput();

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
	generateOutput();
});

if (path === '/words') {
	toggleBtn.textContent = 'Characters';
	toggleBtn.addEventListener('click', () => {
		window.location.href = '/';
	});
} else {
	toggleBtn.textContent = 'Words';
	toggleBtn.addEventListener('click', () => {
		window.location.href = '/words';
	});
}
