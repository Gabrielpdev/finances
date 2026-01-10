import { IData, IUpdateData } from "@/types/data";
import { revalidateTag } from "next/cache";

export async function PUT(request: Request) {
  const token = request.headers.get("authorization");
  const jsonBody: IUpdateData = await request.json();

  const host = request.url.split("/api/update")[0];

  try {
    revalidateTag("list");
    const dataListRes = await fetch(`${host}/api/list`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    const { data: dataList }: { data: IData[] } = await dataListRes.json();

    const updatedData = JSON.stringify(dataList);

    const response = await fetch(
      `${process.env.DATABASE_URL}/list.json?auth=${token}`,
      {
        method: "PUT",
        body: JSON.stringify({
          data: updatedData,
        }),
      }
    );

    const { data } = await response.json();

    const parsedData = JSON.parse(data || "[]");

    return Response.json({
      data: parsedData,
    });
  } catch (error) {
    console.error(error);
    return;
  }
}
