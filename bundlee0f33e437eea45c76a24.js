/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/image-track.js":
/*!****************************!*\
  !*** ./src/image-track.js ***!
  \****************************/
/***/ (() => {

// Initialization
var imageTrack = document.getElementById("image-track");
var inactivityDelay = 5000;
var autoScrollActive = true;
var autoScrollInterval;
var inactivityTimeout;
var isMouseDown = false;
var prevPercentage = 0;
var currentPercentage = 0;

// Set initial data
if (imageTrack.dataset.prevPercentage === undefined) {
  imageTrack.dataset.prevPercentage = "0";
}

// Smooth scrolling function
function smoothScroll() {
  if (!isMouseDown && prevPercentage !== currentPercentage) {
    prevPercentage += (currentPercentage - prevPercentage) * 0.1;
    imageTrack.dataset.percentage = prevPercentage;
    animateTrack(prevPercentage);
    if (Math.abs(currentPercentage - prevPercentage) > 0.01) {
      requestAnimationFrame(smoothScroll);
    }
  }
}

// Event handlers
window.onmousedown = function (e) {
  imageTrack.dataset.mouseDownAt = e.clientY;
  imageTrack.dataset.prevPercentage = imageTrack.dataset.percentage || "0";
  autoScrollActive = false;
  resetAutoScroll();
};
window.onmouseup = function () {
  imageTrack.dataset.mouseDownAt = "0";
  imageTrack.dataset.prevPercentage = imageTrack.dataset.percentage;
  resetAutoScroll();
};
window.onmousemove = function (e) {
  if (imageTrack.dataset.mouseDownAt === "0") return;
  var mouseDelta = parseFloat(imageTrack.dataset.mouseDownAt) - e.clientY;
  var maxDelta = window.innerHeight / 2;
  var percentage = mouseDelta / maxDelta * -100;
  var nextPercentage = parseFloat(imageTrack.dataset.prevPercentage) + percentage;
  var maxScrollablePercentage = getMaxScrollablePercentage();
  nextPercentage = Math.min(nextPercentage, 0);
  nextPercentage = Math.max(nextPercentage, maxScrollablePercentage);
  imageTrack.dataset.percentage = nextPercentage;
  animateTrack(nextPercentage);
};
window.addEventListener("wheel", throttle(function (e) {
  autoScrollActive = false;
  clearInterval(autoScrollInterval);
  clearTimeout(inactivityTimeout);
  var delta = e.deltaY;
  var maxDelta = window.innerHeight / 2;
  var percentage = delta / maxDelta * -10;
  var nextPercentage = parseFloat(imageTrack.dataset.percentage || "0") + percentage;
  var maxScrollablePercentage = getMaxScrollablePercentage();
  nextPercentage = Math.min(nextPercentage, 0);
  nextPercentage = Math.max(nextPercentage, maxScrollablePercentage);
  imageTrack.dataset.percentage = nextPercentage;
  imageTrack.dataset.prevPercentage = nextPercentage;
  animateTrack(nextPercentage);
  resetAutoScroll();
}, 50));

// Throttle function
function throttle(fn, wait) {
  var lastTime = 0;
  return function () {
    var now = new Date().getTime();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, arguments);
    }
  };
}

// Animation function
function animateTrack(nextPercentage) {
  var imageColumns = [{
    element: imageColumn1,
    factor: 1.04
  }, {
    element: imageColumn2,
    factor: 0.99
  }, {
    element: imageColumn3,
    factor: 1.05
  }, {
    element: imageColumn4,
    factor: 0.97
  }];
  imageColumns.forEach(function (obj) {
    obj.element.animate({
      transform: "translate(0%, " + nextPercentage * obj.factor + "%)"
    }, {
      duration: 1500,
      fill: "forwards"
    });
  });
}

// Auto scroll functions
function startAutoScroll() {
  if (autoScrollActive) {
    autoScrollInterval = setInterval(function () {
      if (autoScrollActive && imageTrack.dataset.mouseDownAt === "0") {
        var nextPercentage = parseFloat(imageTrack.dataset.percentage || "0") - 0.05;
        var maxScrollablePercentage = getMaxScrollablePercentage();
        nextPercentage = Math.max(nextPercentage, maxScrollablePercentage);
        imageTrack.dataset.percentage = nextPercentage;
        imageTrack.dataset.prevPercentage = nextPercentage;
        requestAnimationFrame(function () {
          animateTrack(nextPercentage);
        });
      }
    }, 100);
  }
}
function resetAutoScroll() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(function () {
    autoScrollActive = true;
    startAutoScroll();
  }, inactivityDelay);
}

// Calculate the maximum scrollable percentage
function getMaxScrollablePercentage() {
  var trackHeight = imageTrack.offsetHeight;
  var windowHeight = window.innerHeight;
  return -((trackHeight - windowHeight) / trackHeight) * 100;
}

// Start auto scroll
startAutoScroll();

/***/ }),

/***/ "./src/nav-menu.js":
/*!*************************!*\
  !*** ./src/nav-menu.js ***!
  \*************************/
/***/ (() => {

document.getElementById("nav-toggle").onclick = function () {
  var body = document.body;
  var isOpen = body.dataset ? body.dataset.open : body.getAttribute("data-open");
  body.dataset ? body.dataset.open = isOpen === "true" ? "false" : "true" : body.setAttribute("data-open", isOpen === "true" ? "false" : "true");
  var isAbout = body.dataset ? body.dataset.about : body.getAttribute("data-about");
  if (isAbout === "true") {
    body.dataset ? body.dataset.about = "false" : body.setAttribute("data-about", "false");
  }
};
document.getElementById("nav-about").onclick = function () {
  if (document.body.dataset) {
    document.body.dataset.about = "true";
  } else {
    document.body.setAttribute("data-about", "true");
  }
};
document.getElementById("nav-work").onclick = function () {
  if (document.body.dataset) {
    document.body.dataset.about = "false";
  } else {
    document.body.setAttribute("data-about", "false");
  }
};

/***/ }),

/***/ "./src/text-track-observer.js":
/*!************************************!*\
  !*** ./src/text-track-observer.js ***!
  \************************************/
/***/ (() => {

// Polyfill for IntersectionObserver
(function () {
  if (!("IntersectionObserver" in window)) {
    // Load the polyfill
    var script = document.createElement("script");
    script.src = "https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver";
    document.head.appendChild(script);
  }
})();

// Check if the polyfill has been loaded
function onIntersectionObserverReady(callback) {
  if ("IntersectionObserver" in window) {
    callback();
  } else {
    var observerReadyInterval = setInterval(function () {
      if ("IntersectionObserver" in window) {
        clearInterval(observerReadyInterval);
        callback();
      }
    }, 100);
  }
}
onIntersectionObserverReady(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      console.log(entry);
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  });
  var hiddenElements = document.querySelectorAll(".hidden");
  Array.prototype.forEach.call(hiddenElements, function (el) {
    observer.observe(el);
  });
});

/***/ }),

/***/ "./src/text-track.js":
/*!***************************!*\
  !*** ./src/text-track.js ***!
  \***************************/
/***/ (() => {

// Initialization
var textTrack = document.getElementById("text-track");
var inactivityDelay = 5000;
var autoScrollActive = true;
var autoScrollInterval;
var inactivityTimeout;
var isMouseDown = false;
var prevPercentage = 0;
var currentPercentage = 0;

// Set initial data
if (textTrack.dataset.prevPercentage === undefined) {
  textTrack.dataset.prevPercentage = "0";
}

// Smooth scrolling function
function smoothScroll() {
  if (!isMouseDown && prevPercentage !== currentPercentage) {
    prevPercentage += (currentPercentage - prevPercentage) * 0.1;
    textTrack.dataset.percentage = prevPercentage;
    animateTrack(prevPercentage);
    if (Math.abs(currentPercentage - prevPercentage) > 0.01) {
      requestAnimationFrame(smoothScroll);
    }
  }
}

// Event handlers
textTrack.addEventListener("mousedown", function (e) {
  textTrack.dataset.mouseDownAt = e.clientY;
  textTrack.dataset.prevPercentage = textTrack.dataset.percentage || "0";
  autoScrollActive = false;
  clearInterval(autoScrollInterval);
  clearTimeout(inactivityTimeout);
  isMouseDown = true;
});
window.addEventListener("mouseup", function () {
  textTrack.dataset.mouseDownAt = "0";
  textTrack.dataset.prevPercentage = textTrack.dataset.percentage;
  resetAutoScroll();
  isMouseDown = false;
});
textTrack.addEventListener("mousemove", function (e) {
  if (!isMouseDown) return;
  var mouseDelta = parseFloat(textTrack.dataset.mouseDownAt) - e.clientY;
  var maxDelta = window.innerHeight / 2;

  // Adjust this divisor to make dragging less sensitive
  var sensitivity = 2; // Increase this number to reduce sensitivity
  var percentage = mouseDelta / (maxDelta * sensitivity) * -100;
  var nextPercentage = parseFloat(textTrack.dataset.prevPercentage) + percentage;
  var maxScrollablePercentage = getMaxScrollablePercentage();
  nextPercentage = Math.min(nextPercentage, 0);
  nextPercentage = Math.max(nextPercentage, maxScrollablePercentage);
  textTrack.dataset.percentage = nextPercentage;
  requestAnimationFrame(function () {
    return animateTrack(nextPercentage);
  });
});
textTrack.addEventListener("wheel", throttle(function (e) {
  autoScrollActive = false;
  clearInterval(autoScrollInterval);
  clearTimeout(inactivityTimeout);
  var delta = e.deltaY;
  var maxDelta = window.innerHeight / 2;
  var percentage = delta / maxDelta * -10;
  var nextPercentage = parseFloat(textTrack.dataset.percentage || "0") + percentage;
  var maxScrollablePercentage = getMaxScrollablePercentage();
  nextPercentage = Math.min(nextPercentage, 0);
  nextPercentage = Math.max(nextPercentage, maxScrollablePercentage);
  textTrack.dataset.percentage = nextPercentage;
  textTrack.dataset.prevPercentage = nextPercentage;
  animateTrack(nextPercentage);
  resetAutoScroll();
}, 50));

// Throttle function
function throttle(fn, wait) {
  var lastTime = 0;
  return function () {
    var now = new Date().getTime();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(void 0, arguments);
    }
  };
}

// Animation function
function animateTrack(nextPercentage) {
  var textColumn = textTrack.querySelector(".text-column");
  textColumn.style.transition = isMouseDown ? "none" : "transform 0.1s ease-out";
  textColumn.style.transform = "translate(0%, ".concat(nextPercentage, "%)");
}

// Auto scroll functions
function startAutoScroll() {
  if (autoScrollActive) {
    autoScrollInterval = setInterval(function () {
      if (autoScrollActive && textTrack.dataset.mouseDownAt === "0") {
        var nextPercentage = parseFloat(textTrack.dataset.percentage || "0") - 0.05;
        var maxScrollablePercentage = getMaxScrollablePercentage();
        nextPercentage = Math.max(nextPercentage, maxScrollablePercentage);
        textTrack.dataset.percentage = nextPercentage;
        textTrack.dataset.prevPercentage = nextPercentage;
        requestAnimationFrame(function () {
          return animateTrack(nextPercentage);
        });
      }
    }, 100);
  }
}
function resetAutoScroll() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(function () {
    autoScrollActive = true;
    startAutoScroll();
  }, inactivityDelay);
}

// Calculate the maximum scrollable percentage
function getMaxScrollablePercentage() {
  var textColumn = textTrack.querySelector(".text-column");
  var contentHeight = textColumn.scrollHeight;
  var visibleHeight = textTrack.offsetHeight;
  var scrollableHeight = contentHeight - visibleHeight;
  return -(scrollableHeight / contentHeight) * 100;
}

// Handle window resize
window.addEventListener("resize", function () {
  var maxScrollablePercentage = getMaxScrollablePercentage();
  var currentPercentage = parseFloat(textTrack.dataset.percentage || "0");
  currentPercentage = Math.max(currentPercentage, maxScrollablePercentage);
  textTrack.dataset.percentage = currentPercentage;
  textTrack.dataset.prevPercentage = currentPercentage;
  animateTrack(currentPercentage);
});

// Start auto scroll
if (document.body.dataset.page === "true") {
  startAutoScroll();
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/index.scss":
/*!************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/index.scss ***!
  \************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body,
main {
  margin: 0px;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font: 200 1.5vmin/1 sans-serif;
  letter-spacing: 3px;
  background-color: #141414;
}

img {
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

main {
  position: relative;
  z-index: 2;
}

body {
  background-color: #f0ebeb;
}

/* Grid Layout */
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 2.5rem;
}

/* Flexbox fallback for older browsers */
@supports not (display: grid) {
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
  }
  .container > * {
    flex: 1 1 calc(25% - 2.5rem);
  }
}
.image-container {
  display: grid;
  grid-template-columns: auto;
  gap: 2.5rem;
}

/* Flexbox fallback for older browsers */
@supports not (display: grid) {
  .image-container {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }
}
.image {
  object-fit: cover;
  object-position: center 10%;
  width: 100%;
  height: 100%;
  opacity: 0.9;
}

/* Polyfill for older browsers */
@supports not (object-fit: cover) {
  .image {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center 10%;
  }
  .image img {
    display: none;
  }
}
.margin-1 {
  margin-top: 2rem;
}

.margin-2 {
  margin-top: 0rem;
}

.margin-3 {
  margin-top: 5rem;
}

.margin-4 {
  margin-top: 1rem;
}

#nav-toggle {
  height: 7vmin;
  width: 7vmin;
  position: fixed;
  z-index: 3;
  left: 50%;
  bottom: 1.5vmin;
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -o-transform: translateX(-50%);
  transform: translateX(-50%);
  background-color: #d60d13;
  border: none;
  border-radius: 5vmin;
  outline: none;
  box-shadow: 0rem 0rem 4vmin rgba(0, 0, 0, 0.35);
  cursor: pointer;
  -webkit-transition: transform 400ms ease, background-color 400ms ease;
  -moz-transition: transform 400ms ease, background-color 400ms ease;
  -o-transition: transform 400ms ease, background-color 400ms ease;
  transition: transform 400ms ease, background-color 400ms ease;
}

#nav-toggle:hover {
  -webkit-transform: translateX(-50%) scale(1.04);
  -moz-transform: translateX(-50%) scale(1.04);
  -o-transform: translateX(-50%) scale(1.04);
  transform: translateX(-50%) scale(1.04);
}

#nav-toggle:active {
  -webkit-transform: translateX(-50%) scale(0.96);
  -moz-transform: translateX(-50%) scale(0.96);
  -o-transform: translateX(-50%) scale(0.96);
  transform: translateX(-50%) scale(0.96);
}

i {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%) scale(0.9);
  -moz-transform: translate(-50%, -50%) scale(0.9);
  -o-transform: translate(-50%, -50%) scale(0.9);
  transform: translate(-50%, -50%) scale(0.9);
  color: #f0ebeb;
  font-size: 1.75vmin;
  opacity: 0;
  -webkit-transition: transform 400ms ease, opacity 400ms ease;
  -moz-transition: transform 400ms ease, opacity 400ms ease;
  -o-transition: transform 400ms ease, opacity 400ms ease;
  transition: transform 400ms ease, opacity 400ms ease;
}

body:not([data-open=true]) #nav-toggle:hover .open {
  opacity: 1;
  -webkit-transform: translate(-50%, -50%) scale(1);
  -moz-transform: translate(-50%, -50%) scale(1);
  -o-transform: translate(-50%, -50%) scale(1);
  transform: translate(-50%, -50%) scale(1);
}

body[data-open=true] #nav-toggle .close {
  opacity: 1;
  -webkit-transform: translate(-50%, -50%) scale(1);
  -moz-transform: translate(-50%, -50%) scale(1);
  -o-transform: translate(-50%, -50%) scale(1);
  transform: translate(-50%, -50%) scale(1);
}

body[data-open=true] #nav {
  -webkit-transform: translateY(0%);
  -moz-transform: translateY(0%);
  -o-transform: translateY(0%);
  transform: translateY(0%);
}

body[data-open=true] main {
  -webkit-transform: translateY(-20%);
  -moz-transform: translateY(-20%);
  -o-transform: translateY(-20%);
  transform: translateY(-20%);
}

body[data-about=true] main {
  -webkit-transform: translateY(-100%);
  -moz-transform: translateY(-100%);
  -o-transform: translateY(-100%);
  transform: translateY(-100%);
}

body[data-about=true] #logo .logo-name-container {
  color: #141414;
}

body[data-about=true] #tiktok i {
  color: #141414;
}

body[data-about=true] #tiktok .logo-name-container {
  color: #141414;
}

body[data-about=true] #instagram i {
  color: #141414;
}

body[data-about=true] #instagram .logo-name-container {
  color: #141414;
}

main {
  -webkit-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  -moz-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  -o-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
}

#nav {
  position: absolute;
  z-index: 1;
  height: 20vh;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  -webkit-transform: translateY(100%);
  -moz-transform: translateY(100%);
  -o-transform: translateY(100%);
  transform: translateY(100%);
  -webkit-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  -moz-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  -o-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
}

#nav-buttons {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  gap: clamp(1rem, 2vw, 2rem);
  margin-top: clamp(2rem, 2vw, 3rem);
  padding: 0 clamp(1rem, 2vw, 2rem);
  -webkit-transform: translateY(70%) scale(0.9);
  -moz-transform: translateY(70%) scale(0.9);
  -o-transform: translateY(70%) scale(0.9);
  transform: translateY(70%) scale(0.9);
  -webkit-transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  -moz-transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  -o-transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);
  justify-content: center;
}

#nav-buttons .nav-button {
  position: relative;
  text-decoration: none;
  border: none;
  background-color: #f0ebeb;
  cursor: pointer;
  -webkit-transition: transform 200ms ease;
  -moz-transition: transform 200ms ease;
  -o-transition: transform 200ms ease;
  transition: transform 200ms ease;
}

#nav-buttons .nav-button .nav-button-label {
  color: #d60d13;
  margin: 0;
  text-transform: uppercase;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font: 400 2vmin/1 sans-serif;
  letter-spacing: 3px;
}

#nav-buttons .nav-button:hover {
  -webkit-transform: scale(1.04);
  -moz-transform: scale(1.04);
  -o-transform: scale(1.04);
  transform: scale(1.04);
}

#nav-buttons .nav-button:active {
  -webkit-transform: scale(0.96);
  -moz-transform: scale(0.96);
  -o-transform: scale(0.96);
  transform: scale(0.96);
}

#text-track {
  position: absolute;
  z-index: 0;
  top: 0;
  opacity: 0;
  -webkit-transform: translateY(-120%);
  -moz-transform: translateY(-120%);
  -o-transform: translateY(-120%);
  transform: translateY(-120%);
  -webkit-transition: all 1500ms;
  -moz-transition: all 1500ms;
  -o-transition: all 1500ms;
  transition: all 1500ms;
  width: 100vw;
  height: 100vh;
}

#text-track .about-text {
  font: 200 1.5vmin/1 sans-serif;
  font-size: 5vmin;
  line-height: 1.2;
  margin-left: 25px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 40%;
}

#text-track .info-text {
  font: 200 1.5vmin/1 sans-serif;
  font-size: 5vmin;
  line-height: 1.2;
  margin-right: 25px;
  font-family: sans-serif;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 40%;
  direction: rtl;
}

#text-track .text-column {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  width: 100vw;
}

body[data-about=true] #text-track {
  opacity: 1;
  -webkit-transform: translateY(0%);
  -moz-transform: translateY(0%);
  -o-transform: translateY(0%);
  transform: translateY(0%);
}

.hidden {
  opacity: 0;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  filter: blur(5px);
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

@media (prefers-reduced-motion) {
  .hidden {
    -webkit-transition: none;
    -moz-transition: none;
    -o-transition: none;
    transition: none;
  }
}
.show {
  opacity: 1;
  -webkit-filter: blur(0);
  -moz-filter: blur(0);
  -o-filter: blur(0);
  filter: blur(0);
}

img {
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.center {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

#logo {
  position: absolute;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0);
  width: 200px;
  top: 25px;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#logo .logo-container {
  width: 25px;
  margin-right: 10px;
}

#logo img {
  width: 100%;
  border: none;
  border-radius: 25px;
}

#logo .logo-name-container {
  font-size: 14px;
  color: #ffffff; /* Assuming \$white is a predefined color */
  font-weight: 300;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#instagram {
  position: absolute;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0);
  width: auto;
  top: 70px;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#instagram .instagram-container i {
  left: -10px;
  color: #ffffff; /* Assuming \$white is a predefined color */
  font-size: 16px;
  opacity: 1;
}

#instagram .logo-name-container {
  font-size: 14px;
  color: #ffffff; /* Assuming \$white is a predefined color */
  font-weight: 300;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#tiktok {
  position: absolute;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0);
  width: auto;
  top: 90px;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#tiktok .tiktok-container i {
  left: -10px;
  color: #ffffff; /* Assuming \$white is a predefined color */
  font-size: 16px;
  opacity: 1;
}

#tiktok .logo-name-container {
  font-size: 14px;
  color: #ffffff; /* Assuming \$white is a predefined color */
  font-weight: 300;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}`, "",{"version":3,"sources":["webpack://./src/styles/_base.scss","webpack://./src/styles/_variables.scss","webpack://./src/styles/index.scss","webpack://./src/styles/components/_image-track.scss","webpack://./src/styles/components/_nav-menu.scss","webpack://./src/styles/components/_about.scss","webpack://./src/styles/components/_logo.scss"],"names":[],"mappings":"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","sourcesContent":["body,\nmain {\n  margin: 0px;\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden;\n  font: 200 1.5vmin/1 sans-serif;\n  // font-family: Arial, Helvetica, sans-serif;\n  letter-spacing: 3px;\n  background-color: $darkgrey;\n}\n\nimg {\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\nmain {\n  position: relative;\n  z-index: 2;\n}\n\nbody {\n  background-color: $white;\n}\n","// colors\n$white: #f0ebeb;\n$grey: #c9c9c9;\n$brown: #4d3e2f;\n$red: #d60d13;\n$darkgrey: #141414;\n\n// variables\n$width: 100vw;\n$height: 100vh;\n$percent: 100%;\n","body,\nmain {\n  margin: 0px;\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden;\n  font: 200 1.5vmin/1 sans-serif;\n  letter-spacing: 3px;\n  background-color: #141414;\n}\n\nimg {\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\nmain {\n  position: relative;\n  z-index: 2;\n}\n\nbody {\n  background-color: #f0ebeb;\n}\n\n/* Grid Layout */\n.container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  gap: 2.5rem;\n}\n\n/* Flexbox fallback for older browsers */\n@supports not (display: grid) {\n  .container {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 2.5rem;\n  }\n  .container > * {\n    flex: 1 1 calc(25% - 2.5rem);\n  }\n}\n.image-container {\n  display: grid;\n  grid-template-columns: auto;\n  gap: 2.5rem;\n}\n\n/* Flexbox fallback for older browsers */\n@supports not (display: grid) {\n  .image-container {\n    display: flex;\n    flex-direction: column;\n    gap: 2.5rem;\n  }\n}\n.image {\n  object-fit: cover;\n  object-position: center 10%;\n  width: 100%;\n  height: 100%;\n  opacity: 0.9;\n}\n\n/* Polyfill for older browsers */\n@supports not (object-fit: cover) {\n  .image {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    background-size: cover;\n    background-position: center 10%;\n  }\n  .image img {\n    display: none;\n  }\n}\n.margin-1 {\n  margin-top: 2rem;\n}\n\n.margin-2 {\n  margin-top: 0rem;\n}\n\n.margin-3 {\n  margin-top: 5rem;\n}\n\n.margin-4 {\n  margin-top: 1rem;\n}\n\n#nav-toggle {\n  height: 7vmin;\n  width: 7vmin;\n  position: fixed;\n  z-index: 3;\n  left: 50%;\n  bottom: 1.5vmin;\n  -webkit-transform: translateX(-50%);\n  -moz-transform: translateX(-50%);\n  -o-transform: translateX(-50%);\n  transform: translateX(-50%);\n  background-color: #d60d13;\n  border: none;\n  border-radius: 5vmin;\n  outline: none;\n  box-shadow: 0rem 0rem 4vmin rgba(0, 0, 0, 0.35);\n  cursor: pointer;\n  -webkit-transition: transform 400ms ease, background-color 400ms ease;\n  -moz-transition: transform 400ms ease, background-color 400ms ease;\n  -o-transition: transform 400ms ease, background-color 400ms ease;\n  transition: transform 400ms ease, background-color 400ms ease;\n}\n\n#nav-toggle:hover {\n  -webkit-transform: translateX(-50%) scale(1.04);\n  -moz-transform: translateX(-50%) scale(1.04);\n  -o-transform: translateX(-50%) scale(1.04);\n  transform: translateX(-50%) scale(1.04);\n}\n\n#nav-toggle:active {\n  -webkit-transform: translateX(-50%) scale(0.96);\n  -moz-transform: translateX(-50%) scale(0.96);\n  -o-transform: translateX(-50%) scale(0.96);\n  transform: translateX(-50%) scale(0.96);\n}\n\ni {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%) scale(0.9);\n  -moz-transform: translate(-50%, -50%) scale(0.9);\n  -o-transform: translate(-50%, -50%) scale(0.9);\n  transform: translate(-50%, -50%) scale(0.9);\n  color: #f0ebeb;\n  font-size: 1.75vmin;\n  opacity: 0;\n  -webkit-transition: transform 400ms ease, opacity 400ms ease;\n  -moz-transition: transform 400ms ease, opacity 400ms ease;\n  -o-transition: transform 400ms ease, opacity 400ms ease;\n  transition: transform 400ms ease, opacity 400ms ease;\n}\n\nbody:not([data-open=true]) #nav-toggle:hover .open {\n  opacity: 1;\n  -webkit-transform: translate(-50%, -50%) scale(1);\n  -moz-transform: translate(-50%, -50%) scale(1);\n  -o-transform: translate(-50%, -50%) scale(1);\n  transform: translate(-50%, -50%) scale(1);\n}\n\nbody[data-open=true] #nav-toggle .close {\n  opacity: 1;\n  -webkit-transform: translate(-50%, -50%) scale(1);\n  -moz-transform: translate(-50%, -50%) scale(1);\n  -o-transform: translate(-50%, -50%) scale(1);\n  transform: translate(-50%, -50%) scale(1);\n}\n\nbody[data-open=true] #nav {\n  -webkit-transform: translateY(0%);\n  -moz-transform: translateY(0%);\n  -o-transform: translateY(0%);\n  transform: translateY(0%);\n}\n\nbody[data-open=true] main {\n  -webkit-transform: translateY(-20%);\n  -moz-transform: translateY(-20%);\n  -o-transform: translateY(-20%);\n  transform: translateY(-20%);\n}\n\nbody[data-about=true] main {\n  -webkit-transform: translateY(-100%);\n  -moz-transform: translateY(-100%);\n  -o-transform: translateY(-100%);\n  transform: translateY(-100%);\n}\n\nbody[data-about=true] #logo .logo-name-container {\n  color: #141414;\n}\n\nbody[data-about=true] #tiktok i {\n  color: #141414;\n}\n\nbody[data-about=true] #tiktok .logo-name-container {\n  color: #141414;\n}\n\nbody[data-about=true] #instagram i {\n  color: #141414;\n}\n\nbody[data-about=true] #instagram .logo-name-container {\n  color: #141414;\n}\n\nmain {\n  -webkit-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -moz-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -o-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n}\n\n#nav {\n  position: absolute;\n  z-index: 1;\n  height: 20vh;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 0, 0);\n  -webkit-transform: translateY(100%);\n  -moz-transform: translateY(100%);\n  -o-transform: translateY(100%);\n  transform: translateY(100%);\n  -webkit-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -moz-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -o-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n}\n\n#nav-buttons {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  gap: clamp(1rem, 2vw, 2rem);\n  margin-top: clamp(2rem, 2vw, 3rem);\n  padding: 0 clamp(1rem, 2vw, 2rem);\n  -webkit-transform: translateY(70%) scale(0.9);\n  -moz-transform: translateY(70%) scale(0.9);\n  -o-transform: translateY(70%) scale(0.9);\n  transform: translateY(70%) scale(0.9);\n  -webkit-transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -moz-transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -o-transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  justify-content: center;\n}\n\n#nav-buttons .nav-button {\n  position: relative;\n  text-decoration: none;\n  border: none;\n  background-color: #f0ebeb;\n  cursor: pointer;\n  -webkit-transition: transform 200ms ease;\n  -moz-transition: transform 200ms ease;\n  -o-transition: transform 200ms ease;\n  transition: transform 200ms ease;\n}\n\n#nav-buttons .nav-button .nav-button-label {\n  color: #d60d13;\n  margin: 0;\n  text-transform: uppercase;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  font: 400 2vmin/1 sans-serif;\n  letter-spacing: 3px;\n}\n\n#nav-buttons .nav-button:hover {\n  -webkit-transform: scale(1.04);\n  -moz-transform: scale(1.04);\n  -o-transform: scale(1.04);\n  transform: scale(1.04);\n}\n\n#nav-buttons .nav-button:active {\n  -webkit-transform: scale(0.96);\n  -moz-transform: scale(0.96);\n  -o-transform: scale(0.96);\n  transform: scale(0.96);\n}\n\n#text-track {\n  position: absolute;\n  z-index: 0;\n  top: 0;\n  opacity: 0;\n  -webkit-transform: translateY(-120%);\n  -moz-transform: translateY(-120%);\n  -o-transform: translateY(-120%);\n  transform: translateY(-120%);\n  -webkit-transition: all 1500ms;\n  -moz-transition: all 1500ms;\n  -o-transition: all 1500ms;\n  transition: all 1500ms;\n  width: 100vw;\n  height: 100vh;\n}\n\n#text-track .about-text {\n  font: 200 1.5vmin/1 sans-serif;\n  font-size: 5vmin;\n  line-height: 1.2;\n  margin-left: 25px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  width: 40%;\n}\n\n#text-track .info-text {\n  font: 200 1.5vmin/1 sans-serif;\n  font-size: 5vmin;\n  line-height: 1.2;\n  margin-right: 25px;\n  font-family: sans-serif;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  width: 40%;\n  direction: rtl;\n}\n\n#text-track .text-column {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  justify-content: space-between;\n  width: 100vw;\n}\n\nbody[data-about=true] #text-track {\n  opacity: 1;\n  -webkit-transform: translateY(0%);\n  -moz-transform: translateY(0%);\n  -o-transform: translateY(0%);\n  transform: translateY(0%);\n}\n\n.hidden {\n  opacity: 0;\n  -webkit-filter: blur(5px);\n  -moz-filter: blur(5px);\n  -o-filter: blur(5px);\n  filter: blur(5px);\n  -webkit-transition: all 0.5s;\n  -moz-transition: all 0.5s;\n  -o-transition: all 0.5s;\n  transition: all 0.5s;\n}\n\n@media (prefers-reduced-motion) {\n  .hidden {\n    -webkit-transition: none;\n    -moz-transition: none;\n    -o-transition: none;\n    transition: none;\n  }\n}\n.show {\n  opacity: 1;\n  -webkit-filter: blur(0);\n  -moz-filter: blur(0);\n  -o-filter: blur(0);\n  filter: blur(0);\n}\n\nimg {\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.center {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  width: 100%;\n  justify-content: center;\n  align-items: center;\n}\n\n#logo {\n  position: absolute;\n  z-index: 3;\n  background-color: rgba(0, 0, 0, 0);\n  width: 200px;\n  top: 25px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\n#logo .logo-container {\n  width: 25px;\n  margin-right: 10px;\n}\n\n#logo img {\n  width: 100%;\n  border: none;\n  border-radius: 25px;\n}\n\n#logo .logo-name-container {\n  font-size: 14px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-weight: 300;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n#instagram {\n  position: absolute;\n  z-index: 3;\n  background-color: rgba(0, 0, 0, 0);\n  width: auto;\n  top: 70px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\n#instagram .instagram-container i {\n  left: -10px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-size: 16px;\n  opacity: 1;\n}\n\n#instagram .logo-name-container {\n  font-size: 14px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-weight: 300;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n#tiktok {\n  position: absolute;\n  z-index: 3;\n  background-color: rgba(0, 0, 0, 0);\n  width: auto;\n  top: 90px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\n#tiktok .tiktok-container i {\n  left: -10px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-size: 16px;\n  opacity: 1;\n}\n\n#tiktok .logo-name-container {\n  font-size: 14px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-weight: 300;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}","/* Grid Layout */\n.container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  gap: 2.5rem;\n}\n\n/* Flexbox fallback for older browsers */\n@supports not (display: grid) {\n  .container {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 2.5rem;\n  }\n  .container > * {\n    flex: 1 1 calc(25% - 2.5rem);\n  }\n}\n\n.image-container {\n  display: grid;\n  grid-template-columns: auto;\n  gap: 2.5rem;\n}\n\n/* Flexbox fallback for older browsers */\n@supports not (display: grid) {\n  .image-container {\n    display: flex;\n    flex-direction: column;\n    gap: 2.5rem;\n  }\n}\n\n.image {\n  object-fit: cover;\n  object-position: center 10%;\n  width: 100%;\n  height: 100%;\n  opacity: 0.9;\n}\n\n/* Polyfill for older browsers */\n@supports not (object-fit: cover) {\n  .image {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    background-size: cover;\n    background-position: center 10%;\n  }\n  .image img {\n    display: none;\n  }\n}\n\n.margin-1 {\n  margin-top: 2rem;\n}\n\n.margin-2 {\n  margin-top: 0rem;\n}\n\n.margin-3 {\n  margin-top: 5rem;\n}\n\n.margin-4 {\n  margin-top: 1rem;\n}\n","#nav-toggle {\n  height: 7vmin;\n  width: 7vmin;\n  position: fixed;\n  z-index: 3;\n  left: 50%;\n  bottom: 1.5vmin;\n  -webkit-transform: translateX(-50%);\n  -moz-transform: translateX(-50%);\n  -o-transform: translateX(-50%);\n  transform: translateX(-50%);\n  background-color: $red;\n  border: none;\n  border-radius: 5vmin;\n  outline: none;\n  box-shadow: 0rem 0rem 4vmin rgba(0, 0, 0, 0.35);\n  cursor: pointer;\n  -webkit-transition: transform 400ms ease, background-color 400ms ease;\n  -moz-transition: transform 400ms ease, background-color 400ms ease;\n  -o-transition: transform 400ms ease, background-color 400ms ease;\n  transition: transform 400ms ease, background-color 400ms ease;\n}\n\n#nav-toggle:hover {\n  -webkit-transform: translateX(-50%) scale(1.04);\n  -moz-transform: translateX(-50%) scale(1.04);\n  -o-transform: translateX(-50%) scale(1.04);\n  transform: translateX(-50%) scale(1.04);\n}\n\n#nav-toggle:active {\n  -webkit-transform: translateX(-50%) scale(0.96);\n  -moz-transform: translateX(-50%) scale(0.96);\n  -o-transform: translateX(-50%) scale(0.96);\n  transform: translateX(-50%) scale(0.96);\n}\n\ni {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%) scale(0.9);\n  -moz-transform: translate(-50%, -50%) scale(0.9);\n  -o-transform: translate(-50%, -50%) scale(0.9);\n  transform: translate(-50%, -50%) scale(0.9);\n  color: $white;\n  font-size: 1.75vmin;\n  opacity: 0;\n  -webkit-transition: transform 400ms ease, opacity 400ms ease;\n  -moz-transition: transform 400ms ease, opacity 400ms ease;\n  -o-transition: transform 400ms ease, opacity 400ms ease;\n  transition: transform 400ms ease, opacity 400ms ease;\n}\n\nbody:not([data-open=\"true\"]) #nav-toggle:hover .open {\n  opacity: 1;\n  -webkit-transform: translate(-50%, -50%) scale(1);\n  -moz-transform: translate(-50%, -50%) scale(1);\n  -o-transform: translate(-50%, -50%) scale(1);\n  transform: translate(-50%, -50%) scale(1);\n}\n\nbody[data-open=\"true\"] #nav-toggle .close {\n  opacity: 1;\n  -webkit-transform: translate(-50%, -50%) scale(1);\n  -moz-transform: translate(-50%, -50%) scale(1);\n  -o-transform: translate(-50%, -50%) scale(1);\n  transform: translate(-50%, -50%) scale(1);\n}\n\nbody[data-open=\"true\"] #nav {\n  -webkit-transform: translateY(0%);\n  -moz-transform: translateY(0%);\n  -o-transform: translateY(0%);\n  transform: translateY(0%);\n}\n\nbody[data-open=\"true\"] main {\n  -webkit-transform: translateY(-20%);\n  -moz-transform: translateY(-20%);\n  -o-transform: translateY(-20%);\n  transform: translateY(-20%);\n}\n\nbody[data-about=\"true\"] main {\n  -webkit-transform: translateY(-100%);\n  -moz-transform: translateY(-100%);\n  -o-transform: translateY(-100%);\n  transform: translateY(-100%);\n}\n\nbody[data-about=\"true\"] #logo .logo-name-container {\n  color: $darkgrey;\n}\n\nbody[data-about=\"true\"] #tiktok i {\n  color: $darkgrey;\n}\n\nbody[data-about=\"true\"] #tiktok .logo-name-container {\n  color: $darkgrey;\n}\n\nbody[data-about=\"true\"] #instagram i {\n  color: $darkgrey;\n}\n\nbody[data-about=\"true\"] #instagram .logo-name-container {\n  color: $darkgrey;\n}\n\nmain {\n  -webkit-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -moz-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -o-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n}\n\n#nav {\n  position: absolute;\n  z-index: 1;\n  height: 20vh;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 0, 0);\n  -webkit-transform: translateY(100%);\n  -moz-transform: translateY(100%);\n  -o-transform: translateY(100%);\n  transform: translateY(100%);\n  -webkit-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -moz-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -o-transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  transition: transform 1200ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n}\n\n#nav-buttons {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  gap: clamp(1rem, 2vw, 2rem);\n  margin-top: clamp(2rem, 2vw, 3rem);\n  padding: 0 clamp(1rem, 2vw, 2rem);\n  -webkit-transform: translateY(70%) scale(0.9);\n  -moz-transform: translateY(70%) scale(0.9);\n  -o-transform: translateY(70%) scale(0.9);\n  transform: translateY(70%) scale(0.9);\n  -webkit-transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -moz-transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  -o-transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  transition: transform 400ms cubic-bezier(0.13, 0.53, 0.38, 0.97);\n  justify-content: center;\n}\n\n#nav-buttons .nav-button {\n  position: relative;\n  text-decoration: none;\n  border: none;\n  background-color: $white;\n  cursor: pointer;\n  -webkit-transition: transform 200ms ease;\n  -moz-transition: transform 200ms ease;\n  -o-transition: transform 200ms ease;\n  transition: transform 200ms ease;\n}\n\n#nav-buttons .nav-button .nav-button-label {\n  color: $red;\n  margin: 0;\n  text-transform: uppercase;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  font: 400 2vmin/1 sans-serif;\n  letter-spacing: 3px;\n}\n\n#nav-buttons .nav-button:hover {\n  -webkit-transform: scale(1.04);\n  -moz-transform: scale(1.04);\n  -o-transform: scale(1.04);\n  transform: scale(1.04);\n}\n\n#nav-buttons .nav-button:active {\n  -webkit-transform: scale(0.96);\n  -moz-transform: scale(0.96);\n  -o-transform: scale(0.96);\n  transform: scale(0.96);\n}\n","#text-track {\n  position: absolute;\n  z-index: 0;\n  top: 0;\n  opacity: 0;\n  -webkit-transform: translateY(-120%);\n  -moz-transform: translateY(-120%);\n  -o-transform: translateY(-120%);\n  transform: translateY(-120%);\n  -webkit-transition: all 1500ms;\n  -moz-transition: all 1500ms;\n  -o-transition: all 1500ms;\n  transition: all 1500ms;\n  width: 100vw;\n  height: 100vh;\n}\n\n#text-track .about-text {\n  font: 200 1.5vmin/1 sans-serif;\n\n  font-size: 5vmin;\n  line-height: 1.2;\n  margin-left: 25px;\n\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  width: 40%;\n}\n\n#text-track .info-text {\n  font: 200 1.5vmin/1 sans-serif;\n\n  font-size: 5vmin;\n  line-height: 1.2;\n  margin-right: 25px;\n  font-family: sans-serif;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  width: 40%;\n  direction: rtl;\n}\n\n#text-track .text-column {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  justify-content: space-between;\n  width: 100vw;\n}\n\nbody[data-about=\"true\"] #text-track {\n  opacity: 1;\n  -webkit-transform: translateY(0%);\n  -moz-transform: translateY(0%);\n  -o-transform: translateY(0%);\n  transform: translateY(0%);\n}\n\n.hidden {\n  opacity: 0;\n  -webkit-filter: blur(5px);\n  -moz-filter: blur(5px);\n  -o-filter: blur(5px);\n  filter: blur(5px);\n  -webkit-transition: all 0.5s;\n  -moz-transition: all 0.5s;\n  -o-transition: all 0.5s;\n  transition: all 0.5s;\n}\n\n@media (prefers-reduced-motion) {\n  .hidden {\n    -webkit-transition: none;\n    -moz-transition: none;\n    -o-transition: none;\n    transition: none;\n  }\n}\n\n.show {\n  opacity: 1;\n  -webkit-filter: blur(0);\n  -moz-filter: blur(0);\n  -o-filter: blur(0);\n  filter: blur(0);\n}\n\nimg {\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n",".center {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  width: 100%;\n  justify-content: center;\n  align-items: center;\n}\n\n#logo {\n  position: absolute;\n  z-index: 3;\n  background-color: rgba(0, 0, 0, 0);\n  width: 200px;\n  top: 25px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\n#logo .logo-container {\n  width: 25px;\n  margin-right: 10px;\n}\n\n#logo img {\n  width: 100%;\n  border: none;\n  border-radius: 25px;\n}\n\n#logo .logo-name-container {\n  font-size: 14px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-weight: 300;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n#instagram {\n  position: absolute;\n  z-index: 3;\n  background-color: rgba(0, 0, 0, 0);\n  width: auto;\n  top: 70px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\n#instagram .instagram-container i {\n  left: -10px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-size: 16px;\n  opacity: 1;\n}\n\n#instagram .logo-name-container {\n  font-size: 14px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-weight: 300;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n#tiktok {\n  position: absolute;\n  z-index: 3;\n  background-color: rgba(0, 0, 0, 0);\n  width: auto;\n  top: 90px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\n#tiktok .tiktok-container i {\n  left: -10px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-size: 16px;\n  opacity: 1;\n}\n\n#tiktok .logo-name-container {\n  font-size: 14px;\n  color: #ffffff; /* Assuming $white is a predefined color */\n  font-weight: 300;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./index.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/index.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/assets/contactImage.jpeg":
/*!**************************************!*\
  !*** ./src/assets/contactImage.jpeg ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "contactImage.jpeg";

/***/ }),

/***/ "./src/assets/image00001.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00001.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00001.jpeg";

/***/ }),

/***/ "./src/assets/image00002.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00002.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00002.jpeg";

/***/ }),

/***/ "./src/assets/image00003.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00003.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00003.jpeg";

/***/ }),

/***/ "./src/assets/image00004.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00004.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00004.jpeg";

/***/ }),

/***/ "./src/assets/image00005.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00005.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00005.jpeg";

/***/ }),

/***/ "./src/assets/image00006.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00006.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00006.jpeg";

/***/ }),

/***/ "./src/assets/image00007.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00007.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00007.jpeg";

/***/ }),

/***/ "./src/assets/image00008.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00008.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00008.jpeg";

/***/ }),

/***/ "./src/assets/image00009.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00009.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00009.jpeg";

/***/ }),

/***/ "./src/assets/image00010.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00010.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00010.jpeg";

/***/ }),

/***/ "./src/assets/image00011.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00011.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00011.jpeg";

/***/ }),

/***/ "./src/assets/image00012.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00012.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00012.jpeg";

/***/ }),

/***/ "./src/assets/image00013.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00013.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00013.jpeg";

/***/ }),

/***/ "./src/assets/image00014.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00014.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00014.jpeg";

/***/ }),

/***/ "./src/assets/image00015.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00015.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00015.jpeg";

/***/ }),

/***/ "./src/assets/image00016.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00016.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00016.jpeg";

/***/ }),

/***/ "./src/assets/image00017.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00017.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00017.jpeg";

/***/ }),

/***/ "./src/assets/image00018.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00018.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00018.jpeg";

/***/ }),

/***/ "./src/assets/image00019.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00019.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00019.jpeg";

/***/ }),

/***/ "./src/assets/image00020.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00020.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00020.jpeg";

/***/ }),

/***/ "./src/assets/image00021.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00021.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00021.jpeg";

/***/ }),

/***/ "./src/assets/image00022.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00022.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00022.jpeg";

/***/ }),

/***/ "./src/assets/image00023.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00023.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00023.jpeg";

/***/ }),

/***/ "./src/assets/image00024.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00024.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00024.jpeg";

/***/ }),

/***/ "./src/assets/image00025.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00025.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00025.jpeg";

/***/ }),

/***/ "./src/assets/image00026.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00026.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00026.jpeg";

/***/ }),

/***/ "./src/assets/image00027.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00027.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00027.jpeg";

/***/ }),

/***/ "./src/assets/image00028.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00028.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00028.jpeg";

/***/ }),

/***/ "./src/assets/image00029.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00029.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00029.jpeg";

/***/ }),

/***/ "./src/assets/image00030.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00030.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00030.jpeg";

/***/ }),

/***/ "./src/assets/image00031.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00031.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00031.jpeg";

/***/ }),

/***/ "./src/assets/image00032.jpeg":
/*!************************************!*\
  !*** ./src/assets/image00032.jpeg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "image00032.jpeg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_image00001_jpeg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/image00001.jpeg */ "./src/assets/image00001.jpeg");
/* harmony import */ var _assets_image00002_jpeg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/image00002.jpeg */ "./src/assets/image00002.jpeg");
/* harmony import */ var _assets_image00003_jpeg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/image00003.jpeg */ "./src/assets/image00003.jpeg");
/* harmony import */ var _assets_image00004_jpeg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./assets/image00004.jpeg */ "./src/assets/image00004.jpeg");
/* harmony import */ var _assets_image00005_jpeg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./assets/image00005.jpeg */ "./src/assets/image00005.jpeg");
/* harmony import */ var _assets_image00006_jpeg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./assets/image00006.jpeg */ "./src/assets/image00006.jpeg");
/* harmony import */ var _assets_image00007_jpeg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./assets/image00007.jpeg */ "./src/assets/image00007.jpeg");
/* harmony import */ var _assets_image00008_jpeg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./assets/image00008.jpeg */ "./src/assets/image00008.jpeg");
/* harmony import */ var _assets_image00009_jpeg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./assets/image00009.jpeg */ "./src/assets/image00009.jpeg");
/* harmony import */ var _assets_image00010_jpeg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./assets/image00010.jpeg */ "./src/assets/image00010.jpeg");
/* harmony import */ var _assets_image00011_jpeg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./assets/image00011.jpeg */ "./src/assets/image00011.jpeg");
/* harmony import */ var _assets_image00012_jpeg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./assets/image00012.jpeg */ "./src/assets/image00012.jpeg");
/* harmony import */ var _assets_image00013_jpeg__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./assets/image00013.jpeg */ "./src/assets/image00013.jpeg");
/* harmony import */ var _assets_image00014_jpeg__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./assets/image00014.jpeg */ "./src/assets/image00014.jpeg");
/* harmony import */ var _assets_image00015_jpeg__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./assets/image00015.jpeg */ "./src/assets/image00015.jpeg");
/* harmony import */ var _assets_image00016_jpeg__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./assets/image00016.jpeg */ "./src/assets/image00016.jpeg");
/* harmony import */ var _assets_image00017_jpeg__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./assets/image00017.jpeg */ "./src/assets/image00017.jpeg");
/* harmony import */ var _assets_image00018_jpeg__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./assets/image00018.jpeg */ "./src/assets/image00018.jpeg");
/* harmony import */ var _assets_image00019_jpeg__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./assets/image00019.jpeg */ "./src/assets/image00019.jpeg");
/* harmony import */ var _assets_image00020_jpeg__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./assets/image00020.jpeg */ "./src/assets/image00020.jpeg");
/* harmony import */ var _assets_image00021_jpeg__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./assets/image00021.jpeg */ "./src/assets/image00021.jpeg");
/* harmony import */ var _assets_image00022_jpeg__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./assets/image00022.jpeg */ "./src/assets/image00022.jpeg");
/* harmony import */ var _assets_image00023_jpeg__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./assets/image00023.jpeg */ "./src/assets/image00023.jpeg");
/* harmony import */ var _assets_image00024_jpeg__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./assets/image00024.jpeg */ "./src/assets/image00024.jpeg");
/* harmony import */ var _assets_image00025_jpeg__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./assets/image00025.jpeg */ "./src/assets/image00025.jpeg");
/* harmony import */ var _assets_image00026_jpeg__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./assets/image00026.jpeg */ "./src/assets/image00026.jpeg");
/* harmony import */ var _assets_image00027_jpeg__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./assets/image00027.jpeg */ "./src/assets/image00027.jpeg");
/* harmony import */ var _assets_image00028_jpeg__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./assets/image00028.jpeg */ "./src/assets/image00028.jpeg");
/* harmony import */ var _assets_image00029_jpeg__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./assets/image00029.jpeg */ "./src/assets/image00029.jpeg");
/* harmony import */ var _assets_image00030_jpeg__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./assets/image00030.jpeg */ "./src/assets/image00030.jpeg");
/* harmony import */ var _assets_image00031_jpeg__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./assets/image00031.jpeg */ "./src/assets/image00031.jpeg");
/* harmony import */ var _assets_image00032_jpeg__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./assets/image00032.jpeg */ "./src/assets/image00032.jpeg");
/* harmony import */ var _assets_contactImage_jpeg__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./assets/contactImage.jpeg */ "./src/assets/contactImage.jpeg");
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
/* harmony import */ var _image_track_js__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./image-track.js */ "./src/image-track.js");
/* harmony import */ var _image_track_js__WEBPACK_IMPORTED_MODULE_34___default = /*#__PURE__*/__webpack_require__.n(_image_track_js__WEBPACK_IMPORTED_MODULE_34__);
/* harmony import */ var _nav_menu_js__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./nav-menu.js */ "./src/nav-menu.js");
/* harmony import */ var _nav_menu_js__WEBPACK_IMPORTED_MODULE_35___default = /*#__PURE__*/__webpack_require__.n(_nav_menu_js__WEBPACK_IMPORTED_MODULE_35__);
/* harmony import */ var _text_track_js__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./text-track.js */ "./src/text-track.js");
/* harmony import */ var _text_track_js__WEBPACK_IMPORTED_MODULE_36___default = /*#__PURE__*/__webpack_require__.n(_text_track_js__WEBPACK_IMPORTED_MODULE_36__);
/* harmony import */ var _text_track_observer_js__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./text-track-observer.js */ "./src/text-track-observer.js");
/* harmony import */ var _text_track_observer_js__WEBPACK_IMPORTED_MODULE_37___default = /*#__PURE__*/__webpack_require__.n(_text_track_observer_js__WEBPACK_IMPORTED_MODULE_37__);
































// import image33 from "./assets/image00033.jpeg";

var trackImage1 = document.getElementById("image1");
trackImage1.src = _assets_image00001_jpeg__WEBPACK_IMPORTED_MODULE_0__;
var trackImage2 = document.getElementById("image2");
trackImage2.src = _assets_image00002_jpeg__WEBPACK_IMPORTED_MODULE_1__;
var trackImage3 = document.getElementById("image3");
trackImage3.src = _assets_image00003_jpeg__WEBPACK_IMPORTED_MODULE_2__;
var trackImage4 = document.getElementById("image4");
trackImage4.src = _assets_image00004_jpeg__WEBPACK_IMPORTED_MODULE_3__;
var trackImage5 = document.getElementById("image5");
trackImage5.src = _assets_image00005_jpeg__WEBPACK_IMPORTED_MODULE_4__;
var trackImage6 = document.getElementById("image6");
trackImage6.src = _assets_image00006_jpeg__WEBPACK_IMPORTED_MODULE_5__;
var trackImage7 = document.getElementById("image7");
trackImage7.src = _assets_image00007_jpeg__WEBPACK_IMPORTED_MODULE_6__;
var trackImage8 = document.getElementById("image8");
trackImage8.src = _assets_image00008_jpeg__WEBPACK_IMPORTED_MODULE_7__;
var trackImage9 = document.getElementById("image9");
trackImage9.src = _assets_image00009_jpeg__WEBPACK_IMPORTED_MODULE_8__;
var trackImage10 = document.getElementById("image10");
trackImage10.src = _assets_image00010_jpeg__WEBPACK_IMPORTED_MODULE_9__;
var trackImage11 = document.getElementById("image11");
trackImage11.src = _assets_image00011_jpeg__WEBPACK_IMPORTED_MODULE_10__;
var trackImage12 = document.getElementById("image12");
trackImage12.src = _assets_image00012_jpeg__WEBPACK_IMPORTED_MODULE_11__;
var trackImage13 = document.getElementById("image13");
trackImage13.src = _assets_image00013_jpeg__WEBPACK_IMPORTED_MODULE_12__;
var trackImage14 = document.getElementById("image14");
trackImage14.src = _assets_image00014_jpeg__WEBPACK_IMPORTED_MODULE_13__;
var trackImage15 = document.getElementById("image15");
trackImage15.src = _assets_image00015_jpeg__WEBPACK_IMPORTED_MODULE_14__;
var trackImage16 = document.getElementById("image16");
trackImage16.src = _assets_image00016_jpeg__WEBPACK_IMPORTED_MODULE_15__;
var trackImage17 = document.getElementById("image17");
trackImage17.src = _assets_image00017_jpeg__WEBPACK_IMPORTED_MODULE_16__;
var trackImage18 = document.getElementById("image18");
trackImage18.src = _assets_image00018_jpeg__WEBPACK_IMPORTED_MODULE_17__;
var trackImage19 = document.getElementById("image19");
trackImage19.src = _assets_image00019_jpeg__WEBPACK_IMPORTED_MODULE_18__;
var trackImage20 = document.getElementById("image20");
trackImage20.src = _assets_image00020_jpeg__WEBPACK_IMPORTED_MODULE_19__;
var trackImage21 = document.getElementById("image21");
trackImage21.src = _assets_image00021_jpeg__WEBPACK_IMPORTED_MODULE_20__;
var trackImage22 = document.getElementById("image22");
trackImage22.src = _assets_image00022_jpeg__WEBPACK_IMPORTED_MODULE_21__;
var trackImage23 = document.getElementById("image23");
trackImage23.src = _assets_image00023_jpeg__WEBPACK_IMPORTED_MODULE_22__;
var trackImage24 = document.getElementById("image24");
trackImage24.src = _assets_image00024_jpeg__WEBPACK_IMPORTED_MODULE_23__;
var trackImage25 = document.getElementById("image25");
trackImage25.src = _assets_image00025_jpeg__WEBPACK_IMPORTED_MODULE_24__;
var trackImage26 = document.getElementById("image26");
trackImage26.src = _assets_image00026_jpeg__WEBPACK_IMPORTED_MODULE_25__;
var trackImage27 = document.getElementById("image27");
trackImage27.src = _assets_image00027_jpeg__WEBPACK_IMPORTED_MODULE_26__;
var trackImage28 = document.getElementById("image28");
trackImage28.src = _assets_image00028_jpeg__WEBPACK_IMPORTED_MODULE_27__;
var trackImage29 = document.getElementById("image29");
trackImage29.src = _assets_image00029_jpeg__WEBPACK_IMPORTED_MODULE_28__;
var trackImage30 = document.getElementById("image30");
trackImage30.src = _assets_image00030_jpeg__WEBPACK_IMPORTED_MODULE_29__;
var trackImage31 = document.getElementById("image31");
trackImage31.src = _assets_image00031_jpeg__WEBPACK_IMPORTED_MODULE_30__;
var trackImage32 = document.getElementById("image32");
trackImage32.src = _assets_image00032_jpeg__WEBPACK_IMPORTED_MODULE_31__;
// const trackImage33 = document.getElementById("image33");
// trackImage33.src = image33;
var profileImage34 = document.getElementById("image34");
profileImage34.src = _assets_contactImage_jpeg__WEBPACK_IMPORTED_MODULE_32__;





})();

/******/ })()
;
//# sourceMappingURL=bundlee0f33e437eea45c76a24.js.map