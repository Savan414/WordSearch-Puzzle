// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"mwQg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grid = void 0;

class Grid {
  constructor() {
    this.wordSelectMode = false;
    this.selectedItems = [];
    this.firstSelectedItem;
    this.gridArea = null;
    this.words = [];
    this.foundWords = [];
  }

  getCellsInRange(firstLetter, currentLetter) {
    let cellsInRange = [];

    if (firstLetter.x > currentLetter.x || firstLetter.y > currentLetter.y) {
      [currentLetter, firstLetter] = [firstLetter, currentLetter];
    }

    if (firstLetter.y === currentLetter.y) {
      for (let i = firstLetter.x; i <= currentLetter.x; i++) {
        cellsInRange.push(this.gridArea.querySelector(`td[data-x="${i}"][data-y="${currentLetter.y}"]`));
      }
    } else if (firstLetter.x === currentLetter.x) {
      for (let i = firstLetter.y; i <= currentLetter.y; i++) {
        cellsInRange.push(this.gridArea.querySelector(`td[data-x="${currentLetter.x}"][data-y="${i}"]`));
      }
    } else if (currentLetter.y - firstLetter.y === currentLetter.x - firstLetter.x) {
      let delta = currentLetter.y - firstLetter.y;

      for (let i = 0; i <= delta; i++) {
        cellsInRange.push(this.gridArea.querySelector(`td[data-x="${firstLetter.x + i}"][data-y="${firstLetter.y + i}"]`));
      }
    }

    return cellsInRange;
  }

  renderGrid(gridSize, wordGrid) {
    var gridArea = document.getElementsByClassName("grid-area")[0];

    if (gridArea.lastChild) {
      gridArea.removeChild(gridArea.lastChild);
    }

    this.gridArea = gridArea;
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");
    let index = 0;

    for (var i = 0; i < gridSize; i++) {
      var row = document.createElement("tr");

      for (var j = 0; j < gridSize; j++) {
        var cell = document.createElement("td");
        let letter = wordGrid[index++];
        var cellText = document.createTextNode(letter);
        cell.appendChild(cellText);
        cell.setAttribute("data-x", i);
        cell.setAttribute("data-y", j);
        cell.setAttribute("data-letter", letter);
        row.appendChild(cell);
      }

      tblBody.appendChild(row);
    }

    tbl.appendChild(tblBody);
    gridArea.appendChild(tbl); // Click Handlers

    tbl.addEventListener("mousedown", event => {
      this.wordSelectMode = true;
      const cell = event.target;
      let x = +cell.getAttribute("data-x");
      let y = +cell.getAttribute("data-y");
      let letter = cell.getAttribute("data-letter");
      this.firstSelectedItem = {
        x,
        y
      };
    });
    tbl.addEventListener("mousemove", event => {
      if (this.wordSelectMode) {
        const cell = event.target;
        let x = +cell.getAttribute("data-x");
        let y = +cell.getAttribute("data-y");
        let letter = cell.getAttribute("data-letter");
        this.selectedItems.forEach(cell => cell.classList.remove("selected"));
        this.selectedItems = this.getCellsInRange(this.firstSelectedItem, {
          x,
          y
        });
        this.selectedItems.forEach(cell => cell.classList.add("selected"));
      }
    });
    tbl.addEventListener("mouseup", event => {
      this.wordSelectMode = false;
      const selectedWord = this.selectedItems.reduce((word, cell) => word += cell.getAttribute("data-letter"), '');
      const reversedSelectedWord = selectedWord.split("").reverse().join("");

      if (this.words.indexOf(selectedWord) !== -1) {
        this.foundWords.push(selectedWord);
      } else if (this.words.indexOf(reversedSelectedWord) !== -1) {
        this.foundWords.push(reversedSelectedWord);
      } else {
        this.selectedItems.forEach(item => item.classList.remove("selected"));
      }

      this.selectedItems = [];
    });
  }

}

exports.Grid = Grid;
},{}],"QvaY":[function(require,module,exports) {
"use strict";

var _grid = require("./grid");

const submitWordBtn = document.querySelector(".submit-word");
submitWordBtn.addEventListener("click", async () => {
  const grid = new _grid.Grid();
  const commaSeperatedWords = document.querySelector("#add-word").value;
  const gridSize = document.querySelector("#grid-size").value;
  let result = await fetchGridInfo(gridSize, commaSeperatedWords);
  grid.words = commaSeperatedWords.split(",");
  grid.renderGrid(gridSize, result);
  let wordListNode = document.createTextNode(grid.words);
  let wordListSection = document.querySelector(".word-list");

  if (wordListSection.lastChild) {
    wordListSection.removeChild(wordListSection.lastChild);
  }

  wordListSection.appendChild(wordListNode);
});

async function fetchGridInfo(gridSize, commaSeperatedWords) {
  let response = await fetch(`./wordgrid?gridSize=${gridSize}&wordList=${commaSeperatedWords}`);
  let result = await response.text();
  return result.split(" ");
}
},{"./grid":"mwQg"}]},{},["QvaY"], null)
//# sourceMappingURL=/js.ebb17e42.js.map