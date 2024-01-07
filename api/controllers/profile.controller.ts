import { Request, Response } from "express";
import { prisma } from "../lib";

export const getProfile = async (req: Request, res: Response) => {
    const { currentUser } = req.body;

    try {
        const profile = await prisma.profile.findFirst({
            where: {
                userId: currentUser.uid
            }
        })
    
        if (!profile) {
            return res.status(404).send({ error: "Profile not found" });
        }
        
        res.status(200).send(profile);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const createProfile = async (req: Request, res: Response) => {
    const { currentUser, ...payload } = req.body;

    try {
        const profile = await prisma.profile.create({
            data: {
                userId: currentUser.uid,
                ...payload
            }
        });
    
        res.status(200).send(profile);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    const { currentUser, ...payload } = req.body;
    
    if (!payload || Object.keys(payload).length === 0) {
        return res.status(401).send({ error: "Invalid payload" });
    }

    try {
        const profile = await prisma.profile.update({
            where: {
                userId: currentUser.uid,
            },
            data: { ...payload }
        })
    
        if (!profile) {
            return res.status(404).send({ error: "Profile not found" });
        }
    
        res.status(200).send(profile);
    } catch (error) {
        res.status(400).send(error);
    }
}