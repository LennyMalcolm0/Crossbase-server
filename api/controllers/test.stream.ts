import { Request, Response } from "express";
import { openai } from "../lib";

export const testStream = async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const { prompt } = req.body;

    const messages: any = [
        {
            role: "system",
            content: "You are a helpful assistant. You don't elaborate much but you're not too brief either.",
        },
        {
            role: "user",
            content: prompt,
        }
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 200,
        temperature: 0,
        stream: true,
    });

    for await (const chunk of response) {
        const [choice] = chunk.choices;
        const { content } = choice.delta;
        // console.log(content)
        if (content) {
            res.write(`${content}`);
        }
    }

    res.end();
}

// Name all the gods of the Greek Mythology and their roles
