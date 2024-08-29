import type { Request } from "express";
import error from "../utils/error";
import { isValidObjectId } from "../utils/validators";

export function createCommunicationValidation(request: Request): {
    message?: string;
    type: "CALL" | "MESSAGE";
    businessId: string;
    } {
    const body = request.body;
    
    if (!body.message) throw error("Message is required", 400);
    
    if (!body.businessId) throw error("Receiver ID is required", 400);

    if (!body.type) throw error("Type is required", 400);

    if (typeof body.type !== "string")
        throw error("Type should be a string", 400);

    if (body.type !== "CALL" && body.type !== "MESSAGE")
        throw error("Type should be either CALL or MESSAGE", 400);

    if(typeof body.businessId !== "string")
        throw error("Receiver ID should be a string", 400);
    
    if (!isValidObjectId(body.businessId))
        throw error("Receiver ID is not valid", 400);
    
    if (typeof body.message !== "string")
        throw error("Message should be a string", 400);
    
    if (body.message.trim().length === 0)
        throw error("Message should not be empty", 400);

    if(body.type==="MESSAGE" && !body.message)
        throw error("Message is required", 400);
    
    return {
        message: body.message.trim(),
        type: body.type,
        businessId: body.businessId,
    };
    }