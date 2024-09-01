import { Request, Response } from "express";
import { groq } from "../lib";
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
  
    const response = await groq.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: messages,
        max_tokens: 5000,
        temperature: 0,
        stream: true
    });
  
    let completeResponse = "";
  
    for await (const chunk of response) {
      if (chunk.choices[0].delta.content) {
        completeResponse += `${chunk.choices[0].delta.content}`;
        res.write(`${chunk.choices[0].delta.content}`);
      }
    }
  
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
  
    payload.storeId = storeId || userId;

    const newInsight = await createInsight(userId, payload);

    if (newInsight) {
        res.write(`___id: ${(newInsight as any).id}`)
    }
  
    res.end();
}