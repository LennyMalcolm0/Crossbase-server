import { Request, Response } from "express";
import { prisma } from "../lib";

export const getStores = async (req: Request, res: Response) => {
    const { currentUser } = req.body;

    try {
        const stores = await prisma.store.findMany({
            where: {
                userId: currentUser.uid
            },
            select: {
                id: true,
                storeUrl: true,
                type: true
            }
        });
        
        res.status(200).send(stores);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getStore = async (req: Request, res: Response) => {
    const { currentUser } = req.body;
    const { storeId } = req.params;

    try {
        const store = await prisma.store.findUnique({
            where: {
                id: storeId,
                userId: currentUser.uid
            },
            select: {
                id: true,
                storeUrl: true,
                type: true
            }
        });
    
        if (!store) {
            return res.status(404).send({ error: "Store not found" });
        }
        
        res.status(200).send(store);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const createStore = async (req: Request, res: Response) => {
    const { currentUser, ...payload } = req.body;

    try {
        const store = await prisma.store.create({
            data: {
                userId: currentUser.uid,
                ...payload
            },
            select: {
                id: true,
                storeUrl: true,
                type: true
            }
        });
    
        res.status(200).send(store);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const updateStoreUrl = async (req: Request, res: Response) => {
    const { currentUser, newStoreUrl } = req.body;
    const { storeId } = req.params;
    
    if (!storeId) {
        return res.status(401).send({ error: "Invalid store id" });
    }

    try {
        const store = await prisma.store.update({
            where: {
                id: storeId,
                userId: currentUser.uid
            },
            data: {
                storeUrl: newStoreUrl
            },
            select: {
                id: true,
                storeUrl: true,
                type: true
            }
           });
    
        res.status(200).send(store);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteStore = async (req: Request, res: Response) => {
    const { currentUser } = req.body;
    const { storeId } = req.params;

    try {
        await prisma.store.delete({
            where: {
                id: storeId,
                userId: currentUser.uid
            }
        });
        
        res.status(200).send("Success");
    } catch (error) {
        res.status(400).send(error);
    }
}