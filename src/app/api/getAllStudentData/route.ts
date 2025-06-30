import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import StudentModel, { IStudent } from "@/Models/Student";
import { Model } from "mongoose";

const Student = StudentModel as Model<IStudent>;

export async function GET() {
  try {
    await connectDB();

    const existingStudent = await Student.find({}).lean();

    return NextResponse.json(
      { message: "Students found Successfully", student: existingStudent },
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
