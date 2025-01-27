const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");

const htmlPath = path.resolve(process.argv[2] || "index.html");

// Check if the path exists
if (!fs.existsSync(htmlPath)) {
  console.error(`Error: The file "${htmlPath}" does not exist.`);
  console.error(`Unable to run tests`);
  process.exit(1); // Exit the script with an error code
}

// Load the HTML file
const html = fs.readFileSync(htmlPath, "utf8");
const $ = cheerio.load(html);

let passedCount = 0;
let FailureCount = 0;
let testsPassed = true;

console.log("Running test cases for Task 1...\n");

const testPassed = () => {
  passedCount++;
};

const testFailed = () => {
  FailureCount++;
  testsPassed = false;
};

// Test 1: Check for DOCTYPE
if (!$("html").length) {
  console.log("Test 1: DOCTYPE is missing or incorrect.");
  testFailed();
} else {
  console.log("Test 1: DOCTYPE is present.");
  testPassed();
}

// Test 2: Check for title in the head
if (!$("head > title").length) {
  console.log("Test 2: <title> is missing in the <head> section.");
  testFailed();
} else {
  console.log("Test 2: <title> is present in the <head> section.");
  testPassed();
}

// Test 3: Check for header with <h1>
if (!$("header > h1").length) {
  console.log("Test 3: <header> with <h1> is missing.");
  testFailed();
} else {
  console.log("Test 3: <header> with <h1> is present.");
  testPassed();
}

// Test 4: Check for navigation links
const navLinks = $("header nav a");
if (navLinks.length !== 3) {
  console.log("Test 4: Navigation should have 3 links.");
  testFailed();
} else {
  const validLinks = ["#about", "#hobbies", "#contact"];
  navLinks.each((i, link) => {
    if ($(link).attr("href") !== validLinks[i]) {
      console.log(`Test 4: Navigation link ${i + 1} is incorrect.`);
      testFailed();
    }
  });
  if (testsPassed) console.log("Test 4: Navigation links are correct.");
  testPassed();
}

// Test 5: Check for About Me section with ID
if (!$("#about").length) {
  console.log('Test 5: About Me section with ID "about" is missing.');
  testFailed();
} else {
  console.log('Test 5: About Me section with ID "about" is present.');
  testPassed();
}

// Test 6: Check for Hobbies section with ID and list
if (!$("#hobbies").length) {
  console.log('Test 6: Hobbies section with ID "hobbies" is missing.');
  testFailed();
} else if (!$("#hobbies ul li").length) {
  console.log("Test 6: Hobbies section is missing a list.");
  testFailed();
} else {
  console.log("Test 6: Hobbies section with list is present.");
  testPassed();
}

// Test 7: Check for Contact section with email
if (!$("#contact").length) {
  console.log("Test 7: Contact section is missing.");
  testFailed();
} else if (!$('#contact a[href^="mailto:"]').length) {
  console.log("Test 7: Contact section is missing an email link.");
  testFailed();
} else {
  console.log("Test 7: Contact section with email is present.");
  testPassed();
}

// Test 8: Check for copyright symbol in footer
if (!$("footer").length && $("footer").html().includes("Â©")) {
  console.log("Test 8: Footer is missing the copyright symbol.");
  testFailed();
} else {
  console.log("Test 8: Footer includes the copyright symbol.");
  testPassed();
}

// Summary
if (testsPassed) {
  console.log("\nTests of task 1 passed! Your HTML structure looks good.");
} else {
  console.log(
    "\nSome test cases of task 1 failed. Please review your HTML structure."
  );
}

console.log("\nNow running test cases for Task 2...\n");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(`file://${htmlPath}`, {
    waitUntil: "load",
  });

  // Test 9: Check if the CSS file is linked correctly
  const cssLink = await page.$('link[rel="stylesheet"][href="styles.css"]');
  if (!cssLink) {
    console.log(
      'Test 9: The CSS file "styles.css" is not linked correctly.'
    );
    testFailed();
  } else {
    console.log('Test 9: The CSS file "styles.css" is linked correctly.');
    testPassed();
  }

  // Test 10: Check if the page has a background color set
  try {
    const bodyBgColor = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor
    );
    if (bodyBgColor && bodyBgColor !== "rgba(0, 0, 0, 0)") {
      console.log("Test 10: Page background color is set.");
      testPassed();
    } else {
      console.log("Test 10: Page background color is not set.");
      testFailed();
    }
  } catch (error) {
    console.log(`Test 10: Failed due to error: ${error.message}`);
    testFailed();
  }

  // Test 11: Check if the header text is centered
  try {
    const headerTextAlign = await page.evaluate(
      () => window.getComputedStyle(document.querySelector("header")).textAlign
    );
    if (headerTextAlign === "center") {
      console.log("Test 11: Header text is centered.");
      testPassed();
    } else {
      console.log(
        `Test 11: Header text is not centered (text-align: ${headerTextAlign}).`
      );
      testFailed();
    }
  } catch (error) {
    console.log(`Test 11: Failed due to error: ${error.message}`);
    testFailed();
  }

  // Test 12: Check if navigation links are styled without underline and have a color
  try {
    const navLinkTextDecoration = await page.evaluate(
      () =>
        window.getComputedStyle(document.querySelector("nav a")).textDecoration
    );
    const navLinkColor = await page.evaluate(
      () => window.getComputedStyle(document.querySelector("nav a")).color
    );
    if (
      navLinkTextDecoration.startsWith("none") &&
      navLinkColor &&
      navLinkColor !== "rgb(0, 0, 0)"
    ) {
      console.log(
        "Test 12: Navigation links are styled correctly (no underline, colored)."
      );
      testPassed();
    } else {
      console.log(
        `Test 12: Navigation link styling is incorrect (text-decoration: ${navLinkTextDecoration}, color: ${navLinkColor}).`
      );
      testFailed();
    }
  } catch (error) {
    console.log(`Test 12: Failed due to error: ${error.message}`);
    testFailed();
  }

  // Test 13: Check if sections have padding and margin
  try {
    const sectionPadding = await page.evaluate(
      () => window.getComputedStyle(document.querySelector("section")).padding
    );
    const sectionMargin = await page.evaluate(
      () => window.getComputedStyle(document.querySelector("section")).margin
    );
    if (sectionPadding !== "0px" && sectionMargin !== "0px") {
      console.log("Test 13: Sections have padding and margin set.");
      testPassed();
    } else {
      console.log(
        `Test 13: Sections are missing padding or margin (padding: ${sectionPadding}, margin: ${sectionMargin}).`
      );
      testFailed();
    }
  } catch (error) {
    console.log(`Test 13: Failed due to error: ${error.message}`);
    testFailed();
  }

  // Test 14: Check if list items in the hobbies section are styled with a font style and background color
  try {
    const listItemFontStyle = await page.evaluate(
      () =>
        window.getComputedStyle(document.querySelector("#hobbies ul li"))
          .fontStyle
    );
    const listItemBgColor = await page.evaluate(
      () =>
        window.getComputedStyle(document.querySelector("#hobbies ul li"))
          .backgroundColor
    );
    if (
      listItemFontStyle &&
      listItemFontStyle !== "normal" &&
      listItemBgColor &&
      listItemBgColor !== "rgba(0, 0, 0, 0)"
    ) {
      console.log(
        "Test 14: List items in hobbies section are styled with font style and background color."
      );
      testPassed();
    } else {
      console.log(
        `Test 14: List item styling is incorrect (font-style: ${listItemFontStyle}, background-color: ${listItemBgColor}).`
      );
      testFailed();
    }
  } catch (error) {
    console.log(`Test 14: Failed due to error: ${error.message}`);
    testFailed();
  }

  // Test 15: Check if inputs have padding and margin
  try {
    const inputPadding = await page.evaluate(
      () => window.getComputedStyle(document.querySelector("input")).padding
    );
    const inputMargin = await page.evaluate(
      () => window.getComputedStyle(document.querySelector("input")).margin
    );
    if (inputPadding !== "0px" && inputMargin !== "0px") {
      console.log("Test 15: Inputs have padding and margin set.");
      testPassed();
    } else {
      console.log(
        `Test 15: Inputs are missing padding or margin (padding: ${inputPadding}, margin: ${inputMargin}).`
      );
      testFailed();
    }
  } catch (error) {
    console.log(`Test 15: Failed due to error: ${error.message}`);
    testFailed();
  }

  // Test 16: Check if footer is centered and styled
  try {
    const footerTextAlign = await page.evaluate(
      () => window.getComputedStyle(document.querySelector("footer")).textAlign
    );
    const footerFontSize = await page.evaluate(
      () => window.getComputedStyle(document.querySelector("footer")).fontSize
    );
    if (footerTextAlign === "center" && footerFontSize) {
      console.log("Test 16: Footer is centered and styled.");
      testPassed();
    } else {
      console.log(
        `Test 16: Footer styling is incorrect (text-align: ${footerTextAlign}, font-size: ${footerFontSize}).`
      );
      testFailed();
    }
  } catch (error) {
    console.log(`Test 16: Failed due to error: ${error.message}`);
    testFailed();
  }

  await browser.close();

  console.log("\nFinal test results:");
  console.log(`${passedCount} tests passed.`);
  console.log(`${FailureCount} tests failed.\n`);

  // Summary
  if (testsPassed) {
    console.log("All tests passed! Your HTML and CSS structure looks good.");
    process.exit(0); // Success
  } else {
    console.log("Some tests failed. Please review your HTML and CSS.");
    process.exit(1); // Failure
  }
})();