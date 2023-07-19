/* eslint-disable  @typescript-eslint/no-explicit-any */
export function parseOptions(options?: Record<string, any>): string {
    return options ? new URLSearchParams(Object.entries(options)).toString() : '';
  }