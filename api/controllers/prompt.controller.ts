import { Request, Response } from "express";
import { openai } from "../lib";
import { updateInsight, createInsight } from "./insight.controller";

type Prompt = {
    title: any;
    messages: {
        user: string;
        assistant: string;
    }[];
    insightId?: string;
    storeId?: string;
}

const generateResponse = async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const { question, conversation, insightId, storeId } = req.body;
    const newQuestion = { role: "user", content: question };

    const messages = [
        {
            role: "system",
            content: "You are a helpful assistant. You don't elaborate much but you're not too brief either.",
        },
        {
            role: "user",
            content: "What lead to the fall of the Roman Empire?"
        },
        ...conversation,
        newQuestion,
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 100,
        temperature: 0,
        stream: true
    });

    let completeResponse = "";

    for await (const chunk of response) {
        const [choice] = chunk.choices;
        const { content } = choice.delta;
        if (content) {
            completeResponse += `${content}`;
            res.write(`${content}`);
        }
    }
    res.end();

    messages.push({ role: "assistant", content: completeResponse });

    let payload: Prompt = { 
        title: question,
        messages: messages.slice(2) 
    };

    if (insightId) {
        payload.insightId = insightId;
        await updateInsight(req, payload);
    }

    payload.storeId = storeId
    await createInsight(req, payload);
}

module.exports = { generateResponse }