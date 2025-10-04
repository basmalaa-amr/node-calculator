const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let history = [];
const historyFile = "history.txt";

if (fs.existsSync(historyFile)) {
  const fileData = fs.readFileSync(historyFile, "utf-8");
  history = fileData.split("\n").filter((line) => line.trim() !== "");
}

const wordToSymbol = {
  add: "+",
  plus: "+",
  minus: "-",
  subtract: "-",
  times: "*",
  multiply: "*",
  divide: "/",
};

function replaceWords(expression) {
  return expression
    .split(" ")
    .map((word) => wordToSymbol[word.toLowerCase()] || word)
    .join(" ");
}

function historyHandling(calculation) {
  if (history.length >= 10) {
    history.shift();
  }
  history.push(calculation);

  fs.writeFileSync(historyFile, history.join("\n"), "utf-8");
}

function inputs() {
  rl.question("Symbols or expressions? ", (SE) => {
    let mode = SE.trim().toLowerCase();

    if (mode === "expression") {
      rl.question("Enter your calculation: ", (expression) => {
        const replaced = replaceWords(expression);
        console.log("Converted:", replaced);

        try {
          const result = eval(replaced);
          console.log("Result:", result);
          historyHandling(`${replaced} = ${result}`);
        } catch (err) {
          console.log("Invalid expression.");
        }
        more();
      });
    } else {
      rl.question("Enter the first number: ", (answer) => {
        let num1 = Number(answer.trim());

        rl.question("Enter the second number: ", (answer2) => {
          let num2 = Number(answer2.trim());

          rl.question("Enter the operator (+ - * /): ", (op) => {
            op = op.trim();

            if (num2 === 0 && op === "/") {
              console.log("You cannot divide by zero.");
              rl.question("Please re-enter the second number: ", (answer4) => {
                num2 = Number(answer4.trim());
                calc(num1, num2, op);
                more();
              });
            } else {
              calc(num1, num2, op);
              more();
            }
          });
        });
      });
    }
  });
}

function calc(a, b, op) {
  let result;

  switch (op) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
    default:
      console.log("Invalid operator.");
      return;
  }

  console.log(`${a} ${op} ${b} = ${result}`);
  historyHandling(`${a} ${op} ${b} = ${result}`);
}

function more() {
  rl.question(
    "Another operation, see history, or clear history? (another / history / clear / exit): ",
    (choice) => {
      choice = choice.trim().toLowerCase();

      if (choice === "another") {
        inputs();
      } else if (choice === "history") {
        if (history.length === 0) {
          console.log("No history yet.");
        } else {
          console.log("\nHistory:");
          history.forEach((item, index) => {
            console.log(`${index + 1}: ${item}`);
          });
        }
        more();
      } else if (choice === "clear") {
        history = [];
        fs.writeFileSync(historyFile, "", "utf-8"); // empty file
        console.log("History cleared.");
        more();
      } else {
        console.log("Goodbye!");
        rl.close();
      }
    }
  );
}

inputs();
