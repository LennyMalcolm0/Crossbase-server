import Joi from "joi";
import { Request, Response, NextFunction } from 'express';

/** Validates the request body of an API route */
export function schemaValidator(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            const errors = error.details
            return res.status(400).send({ error: errors });
        } else {
            req.body = value;
            next();
        }
    };
}

// Profile schemas
export const createProfileSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
});
export const updateProfileSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
});

// Store schemas
export const createStoreSchema = Joi.object({
    type: Joi.string()
        .valid('SHOPIFY', 'AMAZON', 'WOO_COMMERCE', 'GUMROAD')
        .required(),
    storeUrl: Joi.string().required(),
    key: Joi.string().required(),
});
export const updateStoreUrlSchema = Joi.object({
    newStoreUrl: Joi.string().required(),
});

// Insight schemas
export const messageSchema = Joi.object({
    role: Joi.string().required(),
    content: Joi.string().required()
});
export const promptSchema = Joi.object({
    storeId: Joi.string().required(),
    insightId: Joi.string().optional(),
    title: Joi.string().required(),
    conversation: Joi.array()
        .items(messageSchema)
        .min(0)
        .required(),
});