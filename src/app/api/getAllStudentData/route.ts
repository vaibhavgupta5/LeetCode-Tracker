import Student from "@/Models/Student";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const existingStudent = await Student.find();

    return NextResponse.json(
      { message: "Students found Successfully", student: existingStudent },
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
