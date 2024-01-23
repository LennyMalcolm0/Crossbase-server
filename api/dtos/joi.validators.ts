import Joi from "joi";
import { Request, Response, NextFunction } from 'express';

/** Validates the request body of an API route */
export function schemaValidator(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { currentUser, ...payload } = req.body;

        const { error, value } = schema.validate(payload, {
            abortEarly: false,
        });

        if (error) {
            const errors = error.details
            return res.status(400).send({ error: errors });
        } else {
            req.body = { currentUser, ...value };
            next();
        }
    };
}

// Profile schemas
export const createProfileSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().optional(),
});
export const updateProfileSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
});

// Store schemas
export const createStoreSchema = Joi.object({
    type: Joi.string()
        .valid('SHOPIFY', 'AMAZON', 'WOO_COMMERCE', 'GUMROAD')
        .required(),
    url: Joi.string().required(),
});
export const updateStoreUrlSchema = Joi.object({
    newStoreUrl: Joi.string().required(),
});

// Insight schemas
export const messageSchema = Joi.object({
    role: Joi.string().valid("user", "assistant").required(),
    content: Joi.string().required()
});
export const promptSchema = Joi.object({
    prompt: Joi.string().required(),
    conversation: Joi.array()
        .items(messageSchema)
        .min(0)
        .required(),
    storeId: Joi.string().required(),
    insightId: Joi.string().optional(),
});