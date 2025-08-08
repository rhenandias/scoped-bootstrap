const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const scopePrefix = config.scopePrefix;
const inputDir = config.inputDir;
const outputDir = config.outputDir;
const sourcePath = config.sourcePath;

const inputPath = path.join(inputDir, "bootstrap.css");
const outputPath = path.join(outputDir, "bootstrap.css");

function main() {
  try {
    console.log("Starting Bootstrap scoping script");

    // 1 - Ensure input and output directories exist
    fs.mkdirSync(inputDir, { recursive: true });
    fs.mkdirSync(outputDir, { recursive: true });

    // 2 - Copy bootstrap.css to input directory
    fs.copyFileSync(sourcePath, inputPath);

    // 3 - Read the copied CSS file content
    const cssContent = fs.readFileSync(inputPath, "utf8");

    // 4 - Apply regex replacement to scope selectors
    const scopedCss = cssContent.replace(
      /((,|\{|\}|\*\/)[\s\r\n]*)((:root)|((\.|#|::|:)[a-zA-Z0-9_-]+|[a-zA-Z]+|\*|\[[^\]]*\]))(?=[^\}\{]*\{)/g,
      (match, p1, p2, p3, p4, p5) => {
        if (p5 === "from" || p5 === "to") {
          return match;
        }

        return `${p1}.${scopePrefix} ${p5 ?? ""}`;
      }
    );

    // 5 - Save the new content to the output directory
    fs.writeFileSync(outputPath, scopedCss, "utf8");

    console.log("Bootstrap scoping completed successfully");
  } catch (error) {
    console.error("\nAn error occurred during script execution:", error);
  }
}

main();
