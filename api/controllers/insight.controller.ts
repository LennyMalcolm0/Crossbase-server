import { Request, Response } from "express";
import { prisma } from "../lib";

export const getInsights = async (req: Request, res: Response) => {
    const { currentUser } = req.body;
    const { storeId } = req.params;

    try {
        const insights = await prisma.insight.findMany({
            where: {
                userId: currentUser.uid,
                storeId
            },
            orderBy: { updatedAt: 'desc' },
            select: { 
                title: true,
                updatedAt: true
            }
        });
        
        res.status(200).send(insights);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getInsight = async (req: Request, res: Response) => {
    const { currentUser } = req.body;
    const { insightId } = req.params;

    try {
        const insight = await prisma.insight.findUnique({
            where: {
                id: insightId,
                userId: currentUser.uid
            },
            select: {
                title: true,
                messages: true
            }
        });
    
        if (!insight) {
            return res.status(404).send({ error: "Insight not found" });
        }
        
        res.status(200).send(insight);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const createInsight = async (req: Request, payload: any) => {
    const { currentUser } = req.body;

    try {
        const insight = await prisma.insight.create({
            data: {
                userId: currentUser.uid,
                ...payload
            },
            select: {
                title: true,
                messages: true
            }
        });
    
        return insight;
    } catch (error) {
        return error;
    }
}

export const updateInsight = async (req: Request, payload: any) => {
    const { currentUser } = req.body;
    const { insightId } = payload;

    delete payload.insightId;

    try {
        const insight = await prisma.insight.update({
            where: {
                id: insightId,
                userId: currentUser.uid
            },
            data: payload,
            select: {
                title: true,
                messages: true
            }
        });
    
        return insight;
    } catch (error) {
        return error;
    }
}

export const pinInsight = async (req: Request, res: Response) => {
    const { currentUser } = req.body;
    const { insightId, value } = req.params;

    const pinned = value === "true" ? true : false;

    try {
        await prisma.insight.update({
            where: {
               id: insightId,
               userId: currentUser.uid
            },
            data: { pinned }
        });
        
        res.status(200).send("Success");
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteInsight = async (req: Request, res: Response) => {
    const { currentUser } = req.body;
    const { insightId } = req.params;

    try {
        await prisma.insight.delete({
            where: {
               id: insightId,
               userId: currentUser.uid
            }
        });
        
        res.status(200).send("Success");
    } catch (error) {
        res.status(400).send(error);
    }
}
