import OpenAI from "openai";
import dotenv from "dotenv";
import promptSync from "prompt-sync";

dotenv.config();

const prompt = promptSync();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let program = true;

// Removes the \n
const filteredResponse = (response) => response.split("\n").filter((e) => e);

const game = {
  context: "",
  choice: "",
  currentChoice: 0,
  maxChoices: 3,
};

async function main() {
  console.log("Initializing...");

  const initialRequest = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `We are playing an adventure game. Label the title and the plot. Give me 3 choices to progress through the story. Make each choice a single sentence.`,
      },
      {
        role: "user",
        content: `Start the game.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
    model: "gpt-3.5-turbo",
  });

  const response = filteredResponse(initialRequest.choices[0].message.content);

  // Set our game context
  let title = response
    .find((e) => e.substring(0, 5) === "Title")
    .substring(6)
    .trim();

  let plot = response
    .find((e) => e.substring(0, 4) === "Plot")
    .substring(5)
    .trim();

  let choices = response.filter(
    (e) =>
      e.includes("1.") ||
      e.includes("2.") ||
      e.includes("3.") ||
      e.includes("Choice ") && e.length > 10
  );

  console.log(title, plot, choices);

  return;

  while (program) {
    var command = prompt("Enter a response or command: ");
    if (command === "stop" || game.currentChoice > game.maxChoices) {
      program = false;
    } else {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `We are continuing an adventure game. Give me 3 choices to progress through the story until we reach the end. Label each choice with [Choice title] and [Choice plot]. Choices until end: ${currentChoice}/${maxChoices}`,
          },
          {
            role: "user",
            content: `Context: ${game.context} My Choice: ${game.choice}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
        model: "gpt-3.5-turbo",
      });

      // Set our context and choice here
      game.currentChoice++;

      console.log(filteredResponse(chatCompletion.choices[0].message.content));
    }
  }
}

main();
