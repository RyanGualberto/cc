import axios from "axios";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const sendToLogin = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  const current_pathname = url.pathname;
  url.pathname = "/auth/login";

  const redirect_response = NextResponse.redirect(url);
  redirect_response.cookies.set("callback_pathname", current_pathname, {
    path: "/",
  });
  return {
    response: redirect_response,
    halt: true,
  };
};

const AuthMiddleware = async (request: NextRequest, response: NextResponse) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return sendToLogin(request);

  try {
    console.log("Checking token", token);

    const whoamiRequest = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Whoami request", whoamiRequest.status, whoamiRequest.data);

    if (
      String(whoamiRequest.status).startsWith("4") ||
      String(whoamiRequest.status).startsWith("5")
    ) {
      return sendToLogin(request);
    }

    return {
      response: response,
      halt: false,
    };
  } catch (error) {
    console.log("Erro Tá aqui", error);

    return sendToLogin(request);
  }
};

export default AuthMiddleware;
