import type { APIContext, MiddlewareNext } from "astro";
import { workos } from "./lib/workos";

async function withAuth(context: APIContext, next: MiddlewareNext) {
    const {cookies, redirect} = context;

    const session = workos.userManagement.loadSealedSession({
        sessionData: cookies.get('wos-session')?.value as string,
        cookiePassword: import.meta.env.WORKOS_COOKIE_PASSWORD
    })

    const result= await session.authenticate();

    if(result.authenticated) {
        return next();
    }

    if(!result.authenticated && result.reason === "no_session_cookie_provided") {
        return redirect("/login");
    }

    try{
        const result = await session.refresh();

        if(!result.authenticated) {
            return redirect("/login");
        }

        cookies.set('wos-session', result.sealedSession as string, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });

        return redirect(context.url.pathname);
    }catch(e) {
        cookies.delete("wos-session");
        return redirect("/login");
    }
}

export async function onRequest(context: any, next: any) {
    if(context.url.pathname.startsWith("/post/")) {
        return await withAuth(context, next);
    }else {
        return next();
    }
}