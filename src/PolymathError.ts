import { ErrorCode } from './types';

export class PolymathError extends Error {
  public code: ErrorCode;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor({ message, code }: { message?: string; code: ErrorCode }) {
    super(message || `Unknown error, code: ${code}`);
    this.code = code;
  }
}
