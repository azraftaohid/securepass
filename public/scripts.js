import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid@4.0.0/nanoid.js";

const output = document.getElementById("output");

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const size = params.get("size") ? parseInt(params.get("size"), 10) : null;

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

// Route Handling
if (window.location.pathname === "/words") {
	generateRandomWords();
} else {
	generateRandomString();
}
