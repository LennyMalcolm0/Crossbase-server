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
                id: true,
                title: true,
                pinned: true,
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
                messages: true,
                pinned: true,
                updatedAt: true
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

export const createInsight = async (userId: string, payload: any) => {
    const { storeId, ...otherValues } = payload;

    try {
        const insight = await prisma.insight.create({
            data: {
                userId,
                ...otherValues,
                pinned: false,
                store: {
                    connect: {
                        id: storeId
                    }
                }
            }
        });
    
        return insight;
    } catch (error) {
        return error;
    }
}

export const updateInsight = async (userId: string, payload: any) => {
    const { insightId, ...otherValues } = payload;

    try {
        const insight = await prisma.insight.update({
            where: { id: insightId, userId },
            data: otherValues,
            select: {
                id: true,
                title: true,
                updatedAt: true
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
            data: { pinned },
            select: { id: true }
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
