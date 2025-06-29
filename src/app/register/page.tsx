//@typescript-eslint/no-unused-vars
//@typescript-eslint/no-explicit-any
"use client";
import axios from "axios";
import React, { useState } from "react";

function Page() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const username = e.target[0].value;
    console.log(username);

    try {
      const [
        userInfo,
        badges,
        contests,
        last5Submissions,
        languages,
        solved,
      ] = await Promise.all([
        axios.get(`https://alfa-leetcode-api.onrender.com/${username}`),
        axios.get(`https://alfa-leetcode-api.onrender.com/${username}/badges`),
        axios.get(`https://alfa-leetcode-api.onrender.com/${username}/calendar`),
        axios.get(`https://alfa-leetcode-api.onrender.com/${username}/contest`),
        axios.get(`https://alfa-leetcode-api.onrender.com/${username}/submission?limit=5`),
        axios.get(`https://alfa-leetcode-api.onrender.com/languageStats?username=${username}`),
        axios.get(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
      ]);

      const data = {
        username: userInfo.data.username,
        fullName: userInfo.data.name,
        totalQuestions: {
          All: solved.data.solvedProblem,
          Easy: solved.data.easySolved,
          Medium: solved.data.mediumSolved,
          Hard: solved.data.hardSolved,
        },
        raking: userInfo.data.ranking,
        rating: 0,
        last5Submissions: last5Submissions.data.submission.map((s) => ({
          title: s.title,
          slug: s.titleSlug,
          timeStamp: s.timestamp,
          status: s.statusDisplay,
          language: s.lang,
        })),
        contests: contests.data.contestParticipation.map((c) => ({
          attended: c.attended,
          title: c.contest.title || "",
          ranking: c.ranking || 0,
          problemsSolved: c.problemsSolved || 0,
          totalQuestions: c.totalProblems || 0,
          rating: c.rating || 0,
          timeStamp: c.contest.startTime || "",
        })),
        badges: badges.data.badges.map((b) => ({
          title: b.displayName,
          timeStamp: b.creationDate,
          icon: b.icon,
        })),
        calender: [],
        about: userInfo.data.about || "User has not provided any information.",
        mainLanguages: languages.data.matchedUser.languageProblemCount.map(
          (lang) => lang.languageName
        ),
        avatar: userInfo.data.avatar,
        socials: {
          github: userInfo.data.gitHub,
          linkedin: userInfo.data.linkedIN,
          twitter: userInfo.data.twitter,
        },
        totalSubmissions: {
          All: solved.data.totalSubmissionNum[0].submissions,
          Easy: solved.data.totalSubmissionNum[1].submissions,
          Medium: solved.data.totalSubmissionNum[2].submissions,
          Hard: solved.data.totalSubmissionNum[3].submissions,
        },
      };

      console.log("Data to be sent:", data);

      saveToDB(data);
    } catch (error) {
      console.error("Error fetching or posting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToDB = async (data) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await axios.post(
        `${baseUrl}/api/saveStudentData`,
        data,
        { withCredentials: true }
      );
      window.location.href = `${baseUrl}/dashboard/${data.username}`;
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-400">
          Enter LeetCode Username
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-500/50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;