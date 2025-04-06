import { customAlphabet } from "https://cdn.jsdelivr.net/npm/nanoid@5.1.5/index.browser.min.js";

const RECENTS_KEY = 'recentCopies';

const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SPECIAL_CHARS = "!@#$%^&*()_+";

const path = window.location.pathname;

const output = document.getElementById("output");
const toggleLink = document.getElementById('toggle-link');
const charOptionsDiv = document.getElementById("char-options");
const toggleRecentsBtn = document.getElementById('toggle-recents');
const recentCopiesDiv = document.getElementById('recent-copies');
const sizeSlider = document.getElementById('size-range');
const sizeValueDisplay = document.getElementById('size-value');

function getSize() {
	return parseInt(sizeSlider.value, 10) || 0;
}

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

	return generators[charset](getSize());
};

const generateRandomWords = async () => {
	const wordCount = getSize();
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

// disable checkboxes on /words
if (path === "/words") {
	document.querySelectorAll("#char-options input").forEach(input => input.disabled = true);
	sizeSlider.value = 6;
	sizeSlider.min = 3;
	sizeSlider.max = 12;
} else {
	document.querySelectorAll("#char-options input").forEach(input => {
		input.addEventListener("change", () => {
			updateOutput(); // regenerate on change
		});
	});
	sizeSlider.value = 20;
	sizeSlider.min = 6;
	sizeSlider.max = 50;
}

sizeSlider.disabled = false;
sizeValueDisplay.textContent = sizeSlider.value; // Sync label text

// Initial render
updateOutput();

function isRecentsVisible() {
	return recentCopiesDiv.classList.contains('show');
}

function addToRecents(text) {
	let list = JSON.parse(sessionStorage.getItem(RECENTS_KEY)) || [];
	if (list[0] && list[0].text === text) return; // Don't add if it's already the first item

	list.unshift({ text, time: new Date().toISOString() });
	if (list.length > 5) list = list.slice(0, 5);
	sessionStorage.setItem(RECENTS_KEY, JSON.stringify(list));
}

function toggleRecents() {
	recentCopiesDiv.classList.toggle('show');

	if (isRecentsVisible()) toggleRecentsBtn.textContent = "Hide recents";
	else toggleRecentsBtn.textContent = "Show recents";
}

function updateRecents() {
	const list = JSON.parse(sessionStorage.getItem(RECENTS_KEY)) || [];
	if (list.length === 0) {
		recentCopiesDiv.innerHTML = '<p style="margin:0;">No recent copies</p>';
	} else {
		recentCopiesDiv.innerHTML = `<ul>
			${list.map(item => {
			const date = new Date(item.time);
			const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			return `<li>
					<div class="recent-item">
						<span class="text">${item.text}</span>
						<span class="time">${timeStr}</span>
					</div>
				</li>`;
		}).join('')}
		</ul>`;
	}
}

// Copy to clipboard
document.getElementById('copy-btn').addEventListener('click', () => {
	const text = document.getElementById('output').innerText;
	navigator.clipboard.writeText(text).then(() => {
		const btn = document.getElementById('copy-btn');
		btn.textContent = 'Copied!';
		setTimeout(() => (btn.textContent = 'Copy'), 1500);

		addToRecents(text);
		if (isRecentsVisible()) updateRecents();
	});
});

// Regenerate output
document.getElementById('regen-btn').addEventListener('click', () => {
	updateOutput();
});

toggleRecentsBtn.addEventListener('click', () => {
	if (!isRecentsVisible()) updateRecents();
	toggleRecents();
});

// Update label live
sizeSlider.addEventListener('input', () => {
	sizeValueDisplay.textContent = sizeSlider.value;
	updateOutput();
});

if (path === '/words') {
	toggleLink.textContent = 'Characters';
	toggleLink.href = '/';
} else {
	toggleLink.textContent = 'Words';
	toggleLink.href = '/words';
}
