const slider = document.querySelector("#progressSlider");
const fill = document.querySelector("#progressFill");
const knob = document.querySelector("#toyKnob");
const track = document.querySelector("#progressTrack");
const value = document.querySelector("#progressValue");
const toyImage = document.querySelector("#toyImage");
const progressPage = document.querySelector("#progressPage");
const birthdayPage = document.querySelector("#birthdayPage");
const memoriesSection = document.querySelector("#memoriesSection");
const longMessageSection = document.querySelector("#longMessageSection");
const spaceSection = document.querySelector("#spaceSection");
const replayButton = document.querySelector("#replayButton");
const confetti = document.querySelector("#confetti");
const memoryPhoto = document.querySelector("#memoryPhoto");
const memoryNext = document.querySelector("#memoryNext");
const memoryGallery = document.querySelector(".memory-gallery");
const photoModal = document.querySelector("#photoModal");
const photoModalImage = document.querySelector("#photoModalImage");
const photoModalTitle = document.querySelector("#photoModalTitle");
const photoModalClose = document.querySelector("#photoModalClose");
const alienTrio = document.querySelector(".alien-trio");
const aliens = document.querySelectorAll(".alien");
let lastFocusedPhoto;

aliens.forEach((alien) => {
	let isDragging = false;
	let startX, startY, initialLeft, initialTop;

	alien.style.position = "relative";
	alien.style.cursor = "grab";

	alien.addEventListener("pointerdown", (e) => {
		isDragging = true;
		alien.style.cursor = "grabbing";
		alien.style.zIndex = "1000";
		alien.classList.add("is-dragging");
		startX = e.clientX;
		startY = e.clientY;

		const computed = window.getComputedStyle(alien);
		const matrix = new WebKitCSSMatrix(computed.transform);
		initialLeft = matrix.m41 || 0;
		initialTop = matrix.m42 || 0;

		alien.setPointerCapture(e.pointerId);
	});

	alien.addEventListener("pointermove", (e) => {
		if (!isDragging) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		alien.style.transform = `translate(${initialLeft + dx}px, ${initialTop + dy}px)`;
	});

	const stopDrag = (e) => {
		if (!isDragging) return;
		isDragging = false;
		alien.style.cursor = "grab";
		alien.style.zIndex = "";
		alien.classList.remove("is-dragging");
		try {
			alien.releasePointerCapture(e.pointerId);
		} catch (err) {}
	};

	alien.addEventListener("pointerup", stopDrag);
	alien.addEventListener("pointercancel", stopDrag);
});

let revealTimer;
let memoryIndex = 0;
const memoryPhotos = [
	"foto/foto1.jpg",
	"foto/foto2.jpg",
	"foto/foto3.jpg",
	"foto/foto4.jpg",
	"foto/foto5.jpg",
	"foto/foto6.jpg"
];

function showMemoryPhoto(index) {
	if (!memoryPhoto) return;
	memoryPhoto.querySelector("img")?.remove();
	memoryPhoto.classList.remove("has-image");
	const image = new Image();
	image.alt = `Foto kenangan ${index + 1}`;
	image.onload = () => {
		memoryPhoto.classList.add("has-image");
		memoryPhoto.prepend(image);
		requestAnimationFrame(() => image.classList.add("is-loaded"));
	};
	image.onerror = () => memoryPhoto.classList.remove("has-image");
	image.src = memoryPhotos[index];
}

function nextMemoryPhoto() {
	memoryIndex = (memoryIndex + 1) % memoryPhotos.length;
	showMemoryPhoto(memoryIndex);
}

function openPhotoModal(photo) {
	if (!photoModal || !photoModalImage || !photo) return;
	lastFocusedPhoto = photo;
	const image = photo.querySelector("img");
	if (!image) return;
	photoModalImage.src = image.src;
	photoModalImage.alt = image.alt;
	photoModalTitle.textContent = image.alt;
	photoModal.classList.add("is-open");
	photoModal.setAttribute("aria-hidden", "false");
	document.body.classList.add("photo-modal-open");
	photoModalClose?.focus();
}

function closePhotoModal() {
	if (!photoModal?.classList.contains("is-open")) return;
	photoModal.classList.remove("is-open");
	photoModal.setAttribute("aria-hidden", "true");
	document.body.classList.remove("photo-modal-open");
	lastFocusedPhoto?.focus();
}

function setMovingState() {
	knob.classList.add("is-moving");
	toyImage.style.transform = "rotate(90deg)";
}

function updateProgress() {
	const progress = Number(slider.value);
	fill.style.width = `${progress}%`;
	const trackStart = track.offsetLeft;
	const knobCenter = trackStart + (track.offsetWidth * progress) / 100;
	knob.style.left = `${knobCenter}px`;
	value.textContent = `${progress}%`;

	if (progress === 100) {
		clearTimeout(revealTimer);
		revealTimer = setTimeout(showBirthday, 450);
	}
}

function makeConfetti() {
	confetti.replaceChildren();
	for (let index = 0; index < 48; index += 1) {
		const piece = document.createElement("i");
		piece.style.left = `${Math.random() * 100}%`;
		piece.style.animationDelay = `${Math.random() * 1.5}s`;
		piece.style.animationDuration = `${2.6 + Math.random() * 2}s`;
		confetti.append(piece);
	}
}

function showBirthday() {
	progressPage.classList.add("is-leaving");
	setTimeout(() => {
		progressPage.style.display = "none";
		birthdayPage.classList.add("is-visible");
		birthdayPage.setAttribute("aria-hidden", "false");
		memoriesSection.classList.add("is-visible");
		memoriesSection.setAttribute("aria-hidden", "false");
		longMessageSection.classList.add("is-visible");
		longMessageSection.setAttribute("aria-hidden", "false");
		spaceSection.classList.add("is-visible");
		spaceSection.setAttribute("aria-hidden", "false");
		initAlienFloating();
		makeConfetti();
	}, 620);
}

function resetExperience() {
	birthdayPage.classList.remove("is-visible");
	birthdayPage.setAttribute("aria-hidden", "true");
	memoriesSection.classList.remove("is-visible");
	memoriesSection.setAttribute("aria-hidden", "true");
	longMessageSection.classList.remove("is-visible");
	longMessageSection.setAttribute("aria-hidden", "true");
	spaceSection.classList.remove("is-visible");
	spaceSection.setAttribute("aria-hidden", "true");
	stopAlienFloating();
	progressPage.style.display = "";
	requestAnimationFrame(() => progressPage.classList.remove("is-leaving"));
	slider.value = 0;
	toyImage.style.transform = "rotate(0deg)";
	knob.classList.remove("is-moving");
	updateProgress();
}

slider.addEventListener("input", updateProgress);
slider.addEventListener("pointerdown", setMovingState);
slider.addEventListener("keydown", setMovingState);
replayButton.addEventListener("click", resetExperience);
memoryNext?.addEventListener("click", nextMemoryPhoto);
memoryGallery?.querySelectorAll(".memory-photo").forEach((photo) => {
	photo.addEventListener("click", () => openPhotoModal(photo));
	photo.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			openPhotoModal(photo);
		}
	});
});
photoModalClose?.addEventListener("click", closePhotoModal);
photoModal?.addEventListener("click", (event) => {
	if (event.target instanceof HTMLElement && event.target.hasAttribute("data-close-photo-modal")) {
		closePhotoModal();
	}
});
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") closePhotoModal();
});
let alienStates = [];
let alienFloatAnimId = null;

function initAlienFloating() {
	if (!spaceSection) return;
	const container = spaceSection;
	const aliens = container.querySelectorAll(".alien");
	alienStates = [];

	aliens.forEach((alien, i) => {
		const rect = alien.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();

		const alienW = rect.width || 120;
		const alienH = rect.height || 150;

		const maxX = containerRect.width - alienW;
		const maxY = containerRect.height - alienH;

		const startX = Math.random() * maxX;
		const startY = Math.random() * maxY;

		const speed = 0.5 + Math.random() * 0.8;
		const angle = Math.random() * Math.PI * 2;
		const vx = Math.cos(angle) * speed;
		const vy = Math.sin(angle) * speed;

		alien.style.position = "absolute";
		alien.style.left = "0";
		alien.style.top = "0";
		alien.style.willChange = "transform";
		alien.style.transition = "none";
		alien.style.animation = "none";

		alienStates.push({ el: alien, x: startX, y: startY, vx, vy });
	});

	function tick() {
		const containerRect = container.getBoundingClientRect();
		const trioRect = container.querySelector(".alien-trio").getBoundingClientRect();

		alienStates.forEach(s => {
			const alienW = s.el.offsetWidth || 120;
			const alienH = s.el.offsetHeight || 150;

			// Batas relatif terhadap spaceSection
			const minX = - (trioRect.left - containerRect.left);
			const maxX = containerRect.width - (trioRect.left - containerRect.left) - alienW;
			const minY = - (trioRect.top - containerRect.top);
			const maxY = containerRect.height - (trioRect.top - containerRect.top) - alienH;

			s.x += s.vx;
			s.y += s.vy;

			if (s.x <= minX) { s.x = minX; s.vx *= -1; }
			else if (s.x >= maxX) { s.x = maxX; s.vx *= -1; }

			if (s.y <= minY) { s.y = minY; s.vy *= -1; }
			else if (s.y >= maxY) { s.y = maxY; s.vy *= -1; }

			s.el.style.transform = `translate(${s.x}px, ${s.y}px)`;
		});
		alienFloatAnimId = requestAnimationFrame(tick);
	}
	tick();
}

function stopAlienFloating() {
	if (alienFloatAnimId) {
		cancelAnimationFrame(alienFloatAnimId);
		alienFloatAnimId = null;
	}
	alienStates.forEach(s => {
		s.el.style.transform = "";
		s.el.style.position = "";
		s.el.style.willChange = "";
		s.el.style.animation = "float-cute 3s ease-in-out infinite";
	});
	alienStates = [];
}

window.addEventListener("resize", updateProgress);
updateProgress();
showMemoryPhoto(memoryIndex);
