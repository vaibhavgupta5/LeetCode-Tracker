import Student from "@/Models/Student";
import connectDB from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      username,
    } = body;

    await connectDB();

   
    const existingStudent = await Student.findOne({
      username,
    });

    if (!existingStudent) {
      return NextResponse.json(
        { message: "No student found" },
        { status: 500 }
      );
    } else {
    
      return NextResponse.json(
        { message: "Student found Successfully",
            student: existingStudent
         },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}