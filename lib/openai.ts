import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

export default async function generateSummaryFromOpenAI(pdfText:string){
try{
    const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content:SUMMARY_SYSTEM_PROMPT
            },
            {
                role: "user",
                content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,

            },
        ],
        temperature: 0.7,
        max_tokens: 1000,
    }); 

    return completion.choices[0].message.content

}catch(error:any){
    if(error?.status===429){
        throw new Error("Rate limit exceeded");
    }
    throw error
}
   
}

