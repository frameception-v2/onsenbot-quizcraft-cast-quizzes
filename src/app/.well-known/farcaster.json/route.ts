export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOiA4ODcyNDYsICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
      payload: "eyJkb21haW4iOiAib25zZW5ib3QtcXVpemNyYWZ0LWNhc3QtcXVpenplcy1mcmFtZWNlcHRpb24tdjIudmVyY2VsLmFwcCJ9",
      signature: "bVUhxEz0-fvMla2KXE0QONAe5_hh93254fxZZHY8kKNHDchSL8kxYuaRRnEvYvCr6E938QvuOkomjVc7ZlLDnxw"
    },
    frame: {
      version: "1",
      name: "Frames v2 Demo",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
