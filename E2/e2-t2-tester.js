const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const htmlPath = path.resolve(process.argv[2] || "index.html");

// Check if the path exists
if (!fs.existsSync(htmlPath)) {
  console.error(`Error: The file "${htmlPath}" does not exist.`);
  console.error(`Unable to run tests`);
  process.exit(1); // Exit the script with an error code
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const filePath = `file://${htmlPath}`; // Path to your HTML file
  await page.goto(filePath);

  const result = await page.evaluate(() => {
    let passed = 0;
    let failed = 0;
    const logs = [];

    function logMessage(message) {
      logs.push(message);
    }

    function assertEquals(description, actual, expected) {
      if (JSON.stringify(actual) === JSON.stringify(expected)) {
        logMessage(`âœ… ${description}: PASS`);
        passed++;
      } else {
        logMessage(
          `âŒ ${description}: FAIL - Expected: ${JSON.stringify(
            expected
          )}, but got: ${JSON.stringify(actual)}`
        );
        failed++;
      }
    }

    // Test group 1: Add and append list ttem
    function testAddListItem() {
      console.log("Testing Add and Append List Item...");
      const input = document.getElementById("itemInput");
      const button = document.getElementById("addItemButton");
      const list = document.getElementById("itemList");

      // Clear previous items
      list.innerHTML = "";

      // Test adding a valid item
      input.value = "Test Item 1";
      button.click();
      assertEquals(
        'Adding "Test Item 1" to the list',
        list.children[0]?.textContent,
        "Test Item 1"
      );

      // Test adding another valid item
      input.value = "Test Item 2";
      button.click();
      assertEquals(
        'Adding "Test Item 2" to the list',
        list.children[1]?.textContent,
        "Test Item 2"
      );

      // Test not adding an empty item
      input.value = "";
      button.click();
      assertEquals(
        "Not adding an empty item to the list",
        list.children.length,
        2
      ); // Should still have 2 items
    }

    // Test group 2: Form validation
    function testValidateForm() {
      console.log("Testing Form Validation...");
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const repeatPassword = document.getElementById("repeatPassword");
      const submitButton = document.getElementById("submitButton");

      // Clear previous values
      name.value = "";
      email.value = "";
      password.value = "";
      repeatPassword.value = "";
      document.getElementById("successMessage").textContent = "";

      // Test empty form submission
      submitButton.click();
      assertEquals(
        "Submitting empty form",
        document.getElementById("successMessage")?.textContent,
        ""
      );

      // Fill in valid data
      name.value = "John Doe";
      email.value = "john.doe@example.com";
      password.value = "Password@123";
      repeatPassword.value = "Password@123";
      submitButton.click();
      assertEquals(
        "Submitting valid form",
        document.getElementById("successMessage")?.textContent?.length > 0,
        true
      );

      // Test invalid email
      email.value = "invalid-email";
      submitButton.click();
      assertEquals(
        "Submitting form with invalid email",
        document.getElementById("emailError")?.textContent?.length > 0,
        true
      );

      // Test invalid password (no uppercase letter)
      email.value = "john.doe@example.com"; // Reset to valid email
      password.value = "password@123"; // No uppercase letter
      submitButton.click();
      assertEquals(
        "Submitting form with invalid password (no uppercase)",
        document.getElementById("passwordError")?.textContent?.length > 0,
        true
      );

      // Test password mismatch
      password.value = "Password@123";
      repeatPassword.value = "Password@124"; // Different password
      submitButton.click();
      assertEquals(
        "Submitting form with password mismatch",
        document.getElementById("repeatPasswordError")?.textContent?.length > 0,
        true
      );
    }

    // Test group 3: Simple to-do list application
    function testTodoApp() {
      console.log("Testing Simple To-Do List Application...");
      const input = document.getElementById("newTodo");
      const button = document.getElementById("addTodoButton");
      const list = document.getElementById("todoList");

      // Clear previous items
      list.innerHTML = "";

      // Add a task
      input.value = "Task 1";
      button.click();
      assertEquals(
        'Adding "Task 1" to the to-do list',
        list.children[0]?.textContent?.includes("Task 1"),
        true
      );

      // Mark the task as completed
      const checkbox = list.children[0]?.querySelector(
        'input[type="checkbox"]'
      );
      try {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change")); // Manually trigger the change event
      } catch {
        // do nothing
      }
      assertEquals(
        'Marking "Task 1" as completed',
        list.children[0]?.style.textDecoration,
        "line-through"
      );

      // Remove the task
      const removeButton = list.children[0]?.querySelector("button");
      removeButton?.click();
      assertEquals(
        'Removing "Task 1" from the to-do list',
        list.children.length,
        0
      ); // List should be empty
    }

    // Run all tests
    testAddListItem();
    testValidateForm();
    testTodoApp();

    return { passed, failed, logs };
  });

  // Print the test results in Node.js
  result.logs.forEach((log) => console.log(log));
  console.log(`\nTotal tests passed: ${result.passed}`);
  console.log(`Total tests failed: ${result.failed}`);

  await browser.close();
})();