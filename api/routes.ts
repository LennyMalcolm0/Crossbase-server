import { Router } from "express";
import { 
    schemaValidator, 
    createProfileSchema, 
    updateProfileSchema, 
    createStoreSchema, 
    updateStoreUrlSchema 
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
    getThreads, 
    getThread, 
    deleteThread 
} from "./controllers/thread.controller";

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


/** Express router to manage thread routes */
export const threadRoutes = Router();

threadRoutes.get("/", getThreads);
threadRoutes.get("/:threadId", getThread);
threadRoutes.delete("/:threadId", deleteThread);

