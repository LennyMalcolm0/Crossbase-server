import { Router } from "express";
import { 
    schemaValidator, 
    createProfileSchema, 
    updateProfileSchema, 
    createStoreSchema, 
    updateStoreUrlSchema,
    promptSchema
} from "./dtos/joi.validators";
import { 
    getProfile, 
    createProfile, 
    updateProfile 
} from "./controllers/profile.controller";
import { 
    getStores, 
    getStore, 
    createStore, 
    updateStoreUrl, 
    deleteStore 
} from "./controllers/store.controller";
import { 
    getInsights, 
    getInsight, 
    pinInsight,
    deleteInsight 
} from "./controllers/insight.controller";
import { generateResponse } from "./controllers/prompt.controller";

/** Express router to manage profile routes */
export const profileRoutes = Router();

profileRoutes.get("/", getProfile);
profileRoutes.post("/", 
    schemaValidator(createProfileSchema), 
    createProfile
);
profileRoutes.patch("/", 
    schemaValidator(updateProfileSchema), 
    updateProfile
);

/** Express router to manage store routes */
export const storeRoutes = Router();

storeRoutes.get("/", getStores);
storeRoutes.get("/:storeId", getStore);
storeRoutes.post("/", 
    schemaValidator(createStoreSchema), 
    createStore
);
storeRoutes.patch("/:storeId", 
    schemaValidator(updateStoreUrlSchema), 
    updateStoreUrl
);
storeRoutes.delete("/:storeId", deleteStore);


/** Express router to manage insight routes */
export const insightRoutes = Router();

insightRoutes.post("/question", 
    schemaValidator(promptSchema), 
    generateResponse
);
insightRoutes.get("/:storeId/all", getInsights);
insightRoutes.get("/:insightId", getInsight);
insightRoutes.get("/pin/:insightId/:value", pinInsight);
insightRoutes.delete("/:insightId", deleteInsight);

