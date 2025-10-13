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

  if (!token) {
    return sendToLogin(request);
  }

  try {
    const whoamiRequest = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/me`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(whoamiRequest.status);
    

    if (String(whoamiRequest.status) !== "200") {
      console.log(await whoamiRequest.json());

      return sendToLogin(request);
    }

    return {
      response: response,
      halt: false,
    };
  } catch (error) {
    console.log(error);

    return sendToLogin(request);
  }
};

export default AuthMiddleware;
