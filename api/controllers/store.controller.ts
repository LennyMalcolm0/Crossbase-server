import { Request, Response } from "express";
import { groq, prisma } from "../lib";

export const getStores = async (req: Request, res: Response) => {
    const { currentUser } = req.body;

    try {
        const stores = await prisma.store.findMany({
            where: { userId: currentUser.uid },
            select: {
                id: true,
                url: true,
                type: true,
                updatedAt: true
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
                url: true,
                type: true,
                updatedAt: true
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
    const { currentUser, type, url } = req.body;
  
    const response = await groq.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant. You don't elaborate, you go straight to the point.",
            },
            {
                role: "user",
                content: "Generate a random domain name in lowercase letters"
            }
        ],
        max_tokens: 2000,
        temperature: 1,
    });

    const data = {
        userId: currentUser.uid,
        type,
        url: response.choices[0].message.content || Math.random().toString() + ".com",
        key: Math.random().toString()
    };

    // if (type === "SHOPIFY") {
    //     const storeSession = await prisma.shopify_Session.findUnique({
    //         where: { shop: url }
    //     })

    //     if (!storeSession) {
    //         return res.status(401).send({ 
    //             error: "Store session was not found. Install/Re-install app on your shopify store"
    //         });
    //     }

    //     data = {
    //         userId: currentUser.uid,
    //         type,
    //         url,
    //         key: storeSession?.accessToken
    //     }
    // }

    try {
        const store = await prisma.store.create({ data });

        delete (store as any).key
        delete (store as any).userId
        delete (store as any).createdAt
    
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
            data: { url: newStoreUrl },
            select: {
                id: true,
                url: true,
                type: true,
                updatedAt: true
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