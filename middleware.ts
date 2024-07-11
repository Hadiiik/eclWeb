import { NextRequest, NextResponse } from "next/server";

const middleware = (req:NextRequest)=>{
    if(req.nextUrl.pathname == '/')
        return NextResponse.next();
    const cookie = req.cookies.get('user-data')
    if(!cookie)
        return NextResponse.rewrite(new URL('/sign-up', req.url));
    if(req.nextUrl.pathname=='/dashboard/files'){
        const s_token = req.cookies.get('sToken')
        if(!s_token)
            return NextResponse.rewrite(new URL('/sign-up', req.url));
        

        if(s_token.value!=process.env.S_TOKEN)
            return NextResponse.rewrite(new URL('/sign-up', req.url)); 
        else return NextResponse.next();
    }

    return NextResponse.next();
}
export default middleware;
export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }