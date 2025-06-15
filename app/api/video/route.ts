import authOptions from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDb();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(
      {
        videos,
      },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json(
      {
        error: "Failed to fetch videos",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 501 }
      );
    }
    await connectToDb();
    const reqBody: IVideo = await req.json();
    if (
      !reqBody.title ||
      !reqBody.description ||
      !reqBody.videoUrl ||
      !reqBody.thumbnailUrl
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }
    const videoData = {
      ...reqBody,
      controls: reqBody?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: reqBody.transformation?.quality ?? 100,
      },
    };
    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create to video",
      },
      {
        status: 500,
      }
    );
  }
}
