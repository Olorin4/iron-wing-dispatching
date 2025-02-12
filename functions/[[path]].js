export async function onRequest(context) {
    const url = new URL(context.request.url);

    // Check if request is for sitemap.xml
    if (url.pathname === "/sitemap.xml") {
        return new Response(await fetch(`${context.env.ASSETS}/sitemap.xml`), {
            headers: {
                "Content-Type": "application/xml",
            },
        });
    }

    // Default behavior (continue normal routing)
    return context.next();
}
