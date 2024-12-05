/* eslint-disable @typescript-eslint/no-explicit-any */
export class ModelConverter<S> {
    convertedModel: S | null;
    // This static variable is supposed to be changed to rt if using in reactJs
    static platformCode = 'rn';
    //   this will convert the camel case request object to snake case.

    static requestBodyGenerator(obj: any): any {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.requestBodyGenerator(item));
        }

        const result: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const snakeKey = key.replace(/([A-Z])/g, (match, letter) => `_${letter.toLowerCase()}`);
                result[snakeKey] = this.requestBodyGenerator(obj[key]);
            }
        }

        return result;
    }

    //   this will convert the snake case response object to camel case
    static responseParser(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.responseParser(item));
        }

        const result: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
                result[camelKey] = this.responseParser(obj[key]);
            }
        }

        return result;
    }

    static responseBodyParser<T>(obj): T {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.responseBodyParser(item)) as T;
        }

        const result = {} as T;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const camelKey = key == '_id' ? 'id' : key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());

                result[camelKey] = this.responseBodyParser(obj[key]);
            }
        }

        return result as T;
    }
}
