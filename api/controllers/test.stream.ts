import { Request, Response } from "express";
import { openai } from "../lib";

export const testStream = async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const messages: any = [
        {
            role: "system",
            content: "You are a helpful assistant. You don't elaborate much but you're not too brief either.",
        },
        {
            role: "user",
            content: "What lead to the fall of the Roman Empire?",
        }
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 100,
        temperature: 0,
        stream: true
    });

    for await (const chunk of response) {
        const [choice] = chunk.choices;
        const { content } = choice.delta;
        if (content) {
            res.write(`${content}`);
        }
    }

    res.end();
}
