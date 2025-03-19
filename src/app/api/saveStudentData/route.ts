import Student from "@/Models/Student";
import connectDB from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      username,
      fullName,
      totalQuestions,
      raking,
      rating,
      last5Submissions,
      contests,
      badges,
      calender,
      about,
      mainLanguages,
      avatar,
      totalSubmissions,
      socials,
    } = body;

    await connectDB();

    console.log(
      username,
      fullName,
      totalQuestions,
      raking,
      rating,
      last5Submissions,
      contests,
      badges,
      calender,
      about,
      mainLanguages,
      avatar,
      totalSubmissions,
      socials
    );

    if (!username || !fullName) {
      return NextResponse.json(
        { message: "Username and fullName are required" },
        { status: 400 }
      );
    }

    const studentData = {
      username,
      fullName,
      totalQuestions: totalQuestions || {
        All: 0,
        Easy: 0,
        Medium: 0,
        Hard: 0,
      },
      raking: raking || 0,
      rating: rating || 0,
      last5Submissions: last5Submissions || [],
      contests: contests || [],
      badges: badges || [],
      calender: calender || [],
      about: about || "",
      mainLanguages: mainLanguages || [],
      avatar: avatar || "",
      totalSubmissions: totalSubmissions || {
        All: 0,
        Easy: 0,
        Medium: 0,
        Hard: 0,
      },
      socials: socials || {
        github: "",
        linkedin: "",
        twitter: "",
      },
    };

    const existingStudent = await Student.findOne({
      username,
    });

    if (!existingStudent) {
      await Student.create(studentData);
      return NextResponse.json(
        { message: "Student created successfully" },
        { status: 200 }
      );
    } else {
      await Student.findOneAndUpdate({ username }, studentData);
      return NextResponse.json(
        { message: "Student Updated Successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}