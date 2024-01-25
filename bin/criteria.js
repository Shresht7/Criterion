var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/helpers/walkDir.ts
import * as fs from "fs";
import * as path from "path";
function walkDir(dir2, callback) {
  fs.readdirSync(dir2).forEach((f) => {
    const dirPath = path.join(dir2, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir2, f));
  });
}

// src/helpers/ansi.ts
var ESC = "\x1B";
var RESET = `${ESC}[0m`;
function wrap(str, code) {
  return `${code[0]}${str}${code[1]}`;
}
var ansi = {
  /** Wraps the text in ANSI bold codes */
  bold: (str) => wrap(str, [`${ESC}[1m`, `${ESC}[22m`]),
  /** Wraps the text in ANSI inverse codes */
  inverse: (str) => wrap(str, [`${ESC}[7m`, `${ESC}[27m`]),
  /** Returns a curried function that inturn wraps a text in n whitespaces */
  pad: (n = 1) => (str) => wrap(str, [" ".repeat(n), " ".repeat(n)]),
  /** Returns a curried function that inturn wraps a text in n newlines */
  margin: (n = 1) => (str) => wrap(str, ["\n".repeat(n), "\n".repeat(n)]),
  /** Wraps the text in ANSI green codes */
  green: (str) => wrap(str, [`${ESC}[32m`, `${ESC}[39m`]),
  /** Wraps the text in ANSI red codes */
  red: (str) => wrap(str, [`${ESC}[31m`, `${ESC}[39m`])
};

// src/helpers/args.ts
var getArguments = () => process.argv.slice(2);
var parseArguments = (...args2) => {
  if (!args2 || !args2.length) {
    args2 = getArguments();
  }
  if (args2.length === 1 && Array.isArray(args2[0])) {
    args2 = args2[0];
  }
  const result = { arguments: [], flags: {} };
  for (let i = 0; i < args2.length; i++) {
    if (!args2[i].startsWith("-")) {
      result.arguments.push(args2[i]);
    }
    if (args2[i].startsWith("--")) {
      let match = args2[i].substring(2).match(/^([\w\-]+)=?(\w*)$/im);
      if (!match) {
        continue;
      }
      let [, key, value] = match;
      if (!value && args2.length > i + 1 && !args2[i + 1].startsWith("-")) {
        value = args2[i + 1];
        i = i + 1;
      }
      value = value || true;
      result.flags[key] = value;
    } else if (args2[i].startsWith("-")) {
      let match = args2[i].substring(1).match(/([\w\-]{1})=?(\w*)/im);
      if (!match) {
        continue;
      }
      let [, key, value] = match;
      if (!value && args2.length > i + 1 && !args2[i + 1].startsWith("-")) {
        value = args2[i + 1];
        i = i + 1;
      }
      value = value || true;
      result.flags[key] = value;
    }
  }
  return result;
};

// src/cli.ts
import * as path2 from "path";
var fileExtension = /\.(test|spec)\.(js|ts)$/;
var args = parseArguments();
var dir = path2.join(process.cwd(), args.arguments[0] || "tests");
var done = [];
walkDir(dir, (x) => {
  if (fileExtension.test(x)) {
    const fileName = path2.basename(x).replace(fileExtension, "");
    if (!fileName || done.includes(fileName)) {
      return;
    }
    done.push(fileName);
    console.log("loading: " + x.replace(fileName, ansi.bold(fileName)));
    __require(x);
  }
});
//# sourceMappingURL=criteria.js.map
