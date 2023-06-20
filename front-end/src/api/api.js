// const apiUrl = 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions';

//  export const sendMessage = async (message) => {
//   try {
//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer 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',
//       },
//       body: JSON.stringify({
//         prompt: message,
//         max_tokens: 100,
//         temperature: 0.6,
//         top_p: 10,
//         n: 1,
//         stop: ['\n'],
//       }),
//     });

//     const data = await response.json();
//     console.log(message)
//     console.log(data)
//     const generatedText = data.choices[0].text.trim();
//     // Process the generatedText as needed
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };
