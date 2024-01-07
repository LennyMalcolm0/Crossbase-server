import { Request, Response } from "express";
import { prisma } from "../lib";

export const getThreads = async (req: Request, res: Response) => {
    const { currentUser } = req.body;
    const { storeId } = req.params;

    try {
        const threads = await prisma.thread.findMany({
            where: {
                userId: currentUser.uid,
                storeId
            },
            orderBy: {
                updatedAt: 'desc'
            },
            select: {
                title: true,
                messages: true
            }
        });
        
        res.status(200).send(threads);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getThread = async (req: Request, res: Response) => {
    const { currentUser } = req.body;
    const { threadId } = req.params;

    try {
        const thread = await prisma.thread.findUnique({
            where: {
                id: threadId,
                userId: currentUser.uid
            },
            select: {
                title: true,
                messages: true
            }
        });
    
        if (!thread) {
            return res.status(404).send({ error: "Thread not found" });
        }
        
        res.status(200).send(thread);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const createThread = async (req: Request, payload: any) => {
    const { currentUser } = req.body;

    try {
        const thread = await prisma.thread.create({
            data: {
                userId: currentUser.uid,
                ...payload
            },
            select: {
                title: true,
                messages: true
            }
        });
    
        return thread;
    } catch (error) {
        return error;
    }
}

export const updateThread = async (req: Request, payload: any) => {
    const { currentUser } = req.body;
    const { threadId } = payload;

    delete payload.threadId;

    try {
        const thread = await prisma.thread.update({
            where: {
                id: threadId,
                userId: currentUser.uid
            },
            data: payload,
            select: {
                title: true,
                messages: true
            }
        });
    
        return thread;
    } catch (error) {
        return error;
    }
}

export const deleteThread = async (req: Request, res: Response) => {
    const { currentUser } = req.body;
    const { threadId } = req.params;

    try {
        await prisma.thread.delete({
            where: {
               id: threadId,
               userId: currentUser.uid
            }
        });
        
        res.status(200).send("Success");
    } catch (error) {
        res.status(400).send(error);
    }
}
