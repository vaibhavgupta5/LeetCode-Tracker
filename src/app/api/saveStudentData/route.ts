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

    const totalSolved = totalQuestions?.All || 0;
    const contestPerformance = contests?.reduce((sum, c) => sum + c.rating, 0) / (contests?.length || 1);
    const recentActivity = last5Submissions?.filter((sub) => sub.status === "Accepted").length || 0;
    const badgesEarned = badges?.length || 0;
    const submissionQuality = (totalSubmissions?.All > 0) ? (recentActivity / totalSubmissions.All) * 100 : 0;

    const rankingScore = (0.4 * totalSolved) + (0.3 * contestPerformance) + (0.1 * recentActivity) + (0.1 * badgesEarned) + (0.1 * submissionQuality);

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
      rating: Math.round(rankingScore) || 0,
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
  } catch (error:any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}