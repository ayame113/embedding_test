import { Configuration, OpenAIApi } from "npm:openai";
import "https://deno.land/std@0.186.0/dotenv/load.ts";

const OPENAI_SECRET = Deno.env.get("OPENAI_SECRET");

const configuration = new Configuration({
  apiKey: OPENAI_SECRET,
});
const openai = new OpenAIApi(configuration);

const filePath = Deno.args[0];
console.log(filePath);

if (!filePath) {
  throw new Error(`Please give the path as an argument.

example: deno run ./mod.ts "C:\\Users\\ayame\\work\\deno\\ts-serve\\README.md"
`);
}

const readme = await Deno.readTextFile(filePath);

const message1 = `
以下はライブラリのREADMEです。

${readme}

`;

const message2 = `
以下の手順をstep-by-stepで実行してください。

1. このライブラリの特徴を教えてください。
2. それらを表す図形をいくつか考えてください。
3. それらの図形を組み合わせ、svg形式のテキストで出力してください。
`;

const response = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "user", content: message1 },
    { role: "user", content: message2 },
  ],
});

console.log(response.data);
const answer = response.data.choices[0].message?.content;
console.log(answer);
