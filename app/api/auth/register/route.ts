import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }
    await connectToDb();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already registered",
        },
        {
          status: 400,
        }
      );
    }

    // create user
    await User.create({
      email,
      password,
    });
    return NextResponse.json(
      {
        message: "User registered successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error, "registration error");
    return NextResponse.json(
      {
        error: "Failed to register user",
      },
      {
        status: 400,
      }
    );
  }
}
