import { AuthorizationKey } from "../../function/auth";

export const yagiHeaders = { Authorization: `Bearer ${AuthorizationKey()}` };
