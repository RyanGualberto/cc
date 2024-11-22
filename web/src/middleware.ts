import { type NextRequest, NextResponse } from "next/server";
import AuthMiddleware from "~/middlewares/auth-middleware";

const middlewareSelector = (path: string) => {
  if (["/auth/login", "/auth/register"].includes(path)) {
    return [];
  }
  return [AuthMiddleware];
};

type CustomMiddlewareResponse = {
  response: NextResponse;
  halt: boolean;
};

export default async function middleware(request: NextRequest) {
  const middlewares = middlewareSelector(request.nextUrl.pathname);
  let response = NextResponse.next();

  if (middlewares) {
    for (const customMiddleware of middlewares) {
      const custom_response = (await customMiddleware(
        request,
        response,
      )) as CustomMiddlewareResponse;
      response = custom_response?.response;
      if (custom_response?.halt) {
        break;
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|\\.well-known/acme-challenge/).*)",
  ],
};
