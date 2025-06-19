import { AutumnError } from "../../../sdk";
import { Result } from "../../../sdk/response";

export const toBackendRes = ({ res }: { res: Result<any, AutumnError> }) => {
  let statusCode = res.statusCode ? res.statusCode : res.error ? 500 : 200;

  return {
    body: res.data ? res.data : res.error,
    statusCode,
  };
};

export const toBackendError = ({
  path,
  message,
  code,
  statusCode = 500,
}: {
  path: string;
  message: string;
  code?: string;
  statusCode?: number;
}) => {
  console.error(
    `Autumn middleware error: ${message} (code: ${code}) | path: ${path}`
  );

  return {
    statusCode,
    body: new AutumnError({
      message: message || "Internal server error",
      code: code || "internal_server_error",
    }),
  };
};
