import Student from "@/Models/Student";
import connectDB from "@/utils/connectDB";
import axios from "axios";

export async function GET() {
  try {
    await connectDB();

    // Fetch all students' usernames from the database
    const students = await Student.find({}, "username");
    const usernames = students.map((student) => student.username);

    // Fetch details for each student concurrently
    const updates = usernames.map(async (username) => {
      try {
        const [
          userInfoRes,
          badgesRes,
          calendarRes,
          contestsRes,
          last5SubmissionsRes,
          languagesRes,
          solvedRes,
        ] = await Promise.all([
          axios.get(`http://alfa-leetcode-api.onrender.com/${username}`),
          axios.get(`http://alfa-leetcode-api.onrender.com/${username}/badges`),
          axios.get(`http://alfa-leetcode-api.onrender.com/${username}/calendar`),
          axios.get(`http://alfa-leetcode-api.onrender.com/${username}/contest`),
          axios.get(`http://alfa-leetcode-api.onrender.com/${username}/submission?limit=5`),
          axios.get(`http://alfa-leetcode-api.onrender.com/languageStats?username=${username}`),
          axios.get(`http://alfa-leetcode-api.onrender.com/${username}/solved`),
        ]);

        const userInfo = userInfoRes.data;
        const badges = badgesRes.data.badges || [];
        const calendar = calendarRes.data || [];
        const contests = contestsRes.data.contestParticipation || [];
        const last5Submissions = last5SubmissionsRes.data.submission || [];
        const languages = languagesRes.data.matchedUser.languageProblemCount || [];
        const solved = solvedRes.data;
        const totalSubmissions = solved.totalSubmissionNum || [];

        const totalSolved = solved.solvedProblem || 0;
        const contestPerformance =
          contests.length > 0
            ? contests.reduce((sum, c) => sum + (c.ranking || 0), 0) / contests.length
            : 0;
        const recentActivity = last5Submissions.filter((sub) => sub.status === "Accepted").length || 0;
        const badgesEarned = badges.length || 0;
        const submissionQuality =
          totalSubmissions.length > 0 && totalSubmissions[0].submissions > 0
            ? (recentActivity / totalSubmissions[0].submissions) * 100
            : 0;

        const rankingScore =
          0.4 * totalSolved +
          0.3 * contestPerformance +
          0.1 * recentActivity +
          0.1 * badgesEarned +
          0.1 * submissionQuality;

        const data = {
          username: userInfo.username,
          fullName: userInfo.name,
          totalQuestions: {
            All: totalSolved,
            Easy: solved.easySolved || 0,
            Medium: solved.mediumSolved || 0,
            Hard: solved.hardSolved || 0,
          },
          ranking: userInfo.ranking || 0,
          rating: Math.round(rankingScore),
          last5Submissions: last5Submissions.map((s) => ({
            title: s.title,
            slug: s.titleSlug,
            timeStamp: s.timestamp,
            status: s.statusDisplay,
            language: s.lang,
          })),
          contests: contests.map((c) => ({
            attended: c.attended,
            title: c.contest?.title || "",
            ranking: c.ranking || 0,
            problemsSolved: c.problemsSolved || 0,
            totalQuestions: c.totalProblems || 0,
            rating: Math.round(rankingScore) || 0,
            timeStamp: c.contest?.startTime || "",
          })),
          badges: badges.map((b) => ({
            title: b.displayName,
            timeStamp: b.creationDate,
            icon: b.icon,
          })),
          calendar,
          about: userInfo.about || "User has not provided any information.",
          mainLanguages: languages.map((lang) => lang.languageName),
          avatar: userInfo.avatar,
          socials: {
            github: userInfo.gitHub || "",
            linkedin: userInfo.linkedIN || "",
            twitter: userInfo.twitter || "",
          },
          totalSubmissions: {
            All: totalSubmissions[0]?.submissions || 0,
            Easy: totalSubmissions[1]?.submissions || 0,
            Medium: totalSubmissions[2]?.submissions || 0,
            Hard: totalSubmissions[3]?.submissions || 0,
          },
        };

        // Update or create the student record
        await Student.findOneAndUpdate({ username }, data, { upsert: true, new: true });
      } catch (error:any) {
        console.error(`Error updating student ${username}:`, error.message);
      }
    });

    await Promise.all(updates);

    return new Response(
      JSON.stringify({ message: "Students updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error:any) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
