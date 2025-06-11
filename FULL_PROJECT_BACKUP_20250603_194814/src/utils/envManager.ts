/**
 * Environment Variable Manager
 * 
 * This utility provides a centralized way to access environment variables
 * with type safety, validation, and fallbacks. It helps prevent the use of
 * hardcoded secrets in the application code.
 */

type EnvVarType = 'string' | 'number' | 'boolean' | 'json';

interface EnvVarConfig {
  key: string;
  defaultValue?: any;
  required?: boolean;
  type?: EnvVarType;
  isSecret?: boolean;
  validationFn?: (value: any) => boolean;
}

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private cache: Map<string, any> = new Map();
  private secretKeys: Set<string> = new Set();
  
  private constructor() {}
  
  /**
   * Get the singleton instance of EnvironmentManager
   */
  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }
  
  /**
   * Get an environment variable with type conversion and validation
   */
  public get<T>(config: EnvVarConfig): T {
    const { 
      key, 
      defaultValue = undefined, 
      required = false,
      type = 'string',
      isSecret = false,
      validationFn = undefined
    } = config;
    
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    // Track secret keys
    if (isSecret) {
      this.secretKeys.add(key);
    }
    
    // Get from environment
    let value: any = import.meta.env[key];
    
    // Handle required variables
    if (value === undefined && required) {
      const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
      
      if (isProduction) {
        throw new Error(`Required environment variable ${key} is not defined`);
      } else {
        console.warn(`⚠️ WARNING: Required environment variable ${key} is not defined`);
        value = defaultValue;
      }
    } else if (value === undefined) {
      value = defaultValue;
    }
    
    // Type conversion
    value = this.convertType(value, type);
    
    // Validation
    if (validationFn && value !== undefined && !validationFn(value)) {
      const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
      
      if (isProduction) {
        throw new Error(`Environment variable ${key} failed validation`);
      } else {
        console.warn(`⚠️ WARNING: Environment variable ${key} failed validation`);
      }
    }
    
    // Cache for future use
    this.cache.set(key, value);
    
    return value as T;
  }
  
  /**
   * Get a string environment variable
   */
  public getString(key: string, defaultValue?: string, required = false): string {
    return this.get({
      key,
      defaultValue,
      required,
      type: 'string'
    });
  }
  
  /**
   * Get a number environment variable
   */
  public getNumber(key: string, defaultValue?: number, required = false): number {
    return this.get({
      key,
      defaultValue,
      required,
      type: 'number'
    });
  }
  
  /**
   * Get a boolean environment variable
   */
  public getBoolean(key: string, defaultValue?: boolean, required = false): boolean {
    return this.get({
      key,
      defaultValue,
      required,
      type: 'boolean'
    });
  }
  
  /**
   * Get a JSON environment variable
   */
  public getJSON<T>(key: string, defaultValue?: T, required = false): T {
    return this.get({
      key,
      defaultValue,
      required,
      type: 'json'
    });
  }
  
  /**
   * Get an API key or other secret
   */
  public getSecret(key: string, defaultValue?: string, required = false): string {
    return this.get({
      key,
      defaultValue,
      required,
      type: 'string',
      isSecret: true
    });
  }
  
  /**
   * Check if all required environment variables are defined
   */
  public validateRequiredVariables(requiredVars: string[]): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    
    for (const key of requiredVars) {
      if (import.meta.env[key] === undefined) {
        missing.push(key);
      }
    }
    
    return {
      valid: missing.length === 0,
      missing
    };
  }
  
  /**
   * Convert a value to the specified type
   */
  private convertType(value: any, type: EnvVarType): any {
    if (value === undefined) {
      return undefined;
    }
    
    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        // Convert string 'true'/'false' to boolean
        if (value === 'true') return true;
        if (value === 'false') return false;
        return Boolean(value);
      case 'json':
        try {
          return typeof value === 'string' ? JSON.parse(value) : value;
        } catch (e) {
          console.error(`Failed to parse JSON for environment variable: ${e}`);
          return undefined;
        }
      case 'string':
      default:
        return String(value);
    }
  }
}

// Export singleton instance
export const env = EnvironmentManager.getInstance();

// Export convenience functions
export const getEnv = (key: string, defaultValue?: string, required = false): string => 
  env.getString(key, defaultValue, required);

export const getEnvNumber = (key: string, defaultValue?: number, required = false): number => 
  env.getNumber(key, defaultValue, required);

export const getEnvBoolean = (key: string, defaultValue?: boolean, required = false): boolean => 
  env.getBoolean(key, defaultValue, required);

export const getEnvJSON = <T>(key: string, defaultValue?: T, required = false): T => 
  env.getJSON(key, defaultValue, required);

export const getSecret = (key: string, defaultValue?: string, required = false): string => 
  env.getSecret(key, defaultValue, required);

export default env;
