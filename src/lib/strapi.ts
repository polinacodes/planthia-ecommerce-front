export async function getStrapiData(path: string, pageSize: number = 100) {
    const separator = path.includes('?') ? '&' : '?';
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api${path}${separator}pagination[pageSize]=${pageSize}&populate=*`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 0 },
    });

    if (!res.ok) {
        throw new Error(`Error en el fetch: ${res.statusText}`);
    }

    return await res.json();
}