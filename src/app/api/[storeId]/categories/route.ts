import prismadb from "@/lib/prismadb";
import { getAdminUserId } from "@/lib/auth/require-admin";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const userId = await getAdminUserId();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("Billboard Id is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("Store Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });
    // Here you can save the billboard to your database
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("Store Id is required", { status: 400 });

    // Fetch categories with related images and billboard (use select for explicit types)
    const categories = await prismadb.category.findMany({
      where: { storeId: params.storeId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        billboardId: true,
        storeId: true,
        createdAt: true,
        updatedAt: true,
        billboard: {
          select: { id: true, label: true, imageUrl: true },
        },
        images: {
          select: { id: true, url: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    }) as Array<{
      id: string;
      name: string;
      imageUrl: string | null;
      billboardId: string;
      storeId: string;
      createdAt: Date;
      updatedAt: Date;
      billboard: { id: string; label: string; imageUrl: string | null };
      images: { id: string; url: string; order: number }[];
    }>;

    return NextResponse.json(categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      imageUrl: cat.imageUrl,
      billboard: {
        id: cat.billboardId,
        label: cat.billboard?.label || "",
        imageUrl: cat.billboard?.imageUrl || "",
      },
      images: (cat.images || []).map((img) => ({
        id: img.id,
        url: img.url,
        order: img.order,
      })),
      billboardId: cat.billboardId,
      storeId: cat.storeId,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    })));
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
