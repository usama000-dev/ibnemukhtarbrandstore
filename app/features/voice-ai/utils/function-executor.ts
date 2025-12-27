// Function Executor - Executes voice-controlled functions with safety checks

import { AIFunction, findFunctionByKeywords, extractFunctionParameters } from '../config/function-registry';

export interface ExecutionContext {
    isLoggedIn: boolean;
    confirmed: boolean;
    currentProductId?: string;
    lastOrderId?: string;
    userEmail?: string;
}

export interface ExecutionResult {
    success: boolean;
    message: string;
    requiresConfirmation?: boolean;
    data?: any;
}

export class FunctionExecutor {
    // Find function from transcript
    static findFunction(transcript: string): AIFunction | null {
        return findFunctionByKeywords(transcript);
    }

    // Extract parameters from transcript
    static extractParameters(transcript: string, func: AIFunction): any {
        return extractFunctionParameters(transcript, func);
    }

    // Execute function with safety checks
    static async execute(
        func: AIFunction,
        params: any,
        context: ExecutionContext
    ): Promise<ExecutionResult> {

        // 1. Check authentication
        if (func.requiresAuth && !context.isLoggedIn) {
            return {
                success: false,
                message: 'Pehle login karna zaroori hai. Login page par jayein'
            };
        }

        // 2. Check confirmation for destructive actions
        if (func.requiresConfirmation && !context.confirmed) {
            return {
                success: false,
                message: `Kya aap sure hain ke ${func.description} karna chahte hain? "Yes confirm" kahein`,
                requiresConfirmation: true
            };
        }

        // 3. Validate required parameters
        for (const param of func.parameters) {
            if (param.required && !params[param.name]) {
                return {
                    success: false,
                    message: `${param.description} zaroori hai`
                };
            }
        }

        // 4. Execute function
        try {
            const result = await func.execute(params, context);
            return {
                success: result.success,
                message: result.message || 'Function execute ho gaya',
                data: result
            };
        } catch (error: any) {
            console.error('Function execution error:', error);
            return {
                success: false,
                message: `Error: ${error.message}`
            };
        }
    }

    // Check if transcript is a function call
    static isFunctionCall(transcript: string): boolean {
        return findFunctionByKeywords(transcript) !== null;
    }
}
