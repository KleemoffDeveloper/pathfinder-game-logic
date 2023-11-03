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
        content: `We are playing an adventure game. Give me 3 choices to progress through the story. Make sure to label the title of the story and the main plot of the story. Label each choice with [Choice title] and [Choice plot].`,
      },
      {
        role: "user",
        content: "Start the game.",
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
    model: "gpt-3.5-turbo",
  });

  console.log(initialRequest.choices[0].message.content);

  return;

  while (program) {
    var command = prompt("Enter a response or command: ");
    if (command === "stop") {
      program = false;
    } else {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `We are continuing an adventure game. Give me 3 choices to progress through the story until we reach the end. Choices until end: ${currentChoice}/${maxChoices}`,
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

      console.log(filteredResponse(chatCompletion.choices[0].message.content));
    }
  }
}

main();

// let title = filteredResponse
//   .find((e) => e.substring(0, 5) === "Title")
//   .substring(6)
//   .trim();

// let plot = "";

// Grabs each choice from the filtered response
// let choices = filteredResponse.filter((e) => e.substring(0, 6) === "Choice");

// console.log(title, plot, choices);
