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

export const generateResponse = async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const { prompt, conversation, insightId, storeId } = req.body;
    const newQuestion = { role: "user", content: prompt };

    const messages = [
        {
            role: "system",
            content: "You are a helpful assistant. You don't elaborate much but you're not too brief either.",
        },
        ...conversation,
        newQuestion,
    ];

    let isOpen = true;
    const controller = new AbortController();
    const { signal } = controller;

    req.on('close', () => {
        controller.abort();
        console.log("Aborted");
        isOpen = false;
    });

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 200,
        temperature: 0,
        stream: true
    }, { signal });

    let completeResponse = "";

    for await (const chunk of response) {
        const [choice] = chunk.choices;
        const { content } = choice.delta;
        if (content) {
            completeResponse += `${content}`;
            res.write(`${content}`);
        }
    }

    if (!isOpen) return;
    
    console.log("Code still running");

    messages.push({ role: "assistant", content: completeResponse });

    let payload: Prompt = {
        title: prompt,
        messages: messages.slice(1) 
    };
    const userId = req.body.currentUser.uid;

    if (insightId) {
        payload.insightId = insightId;
        await updateInsight(userId, payload);
        return res.end();
    }

    payload.storeId = storeId
    const newInsight = await createInsight(userId, payload);
    if (newInsight) {
        res.write(`___id: ${(newInsight as any).id}`)
    }

    res.end();
}

// Name all the gods of the Greek Mythology and their roles