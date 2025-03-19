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
        calendar,
        contests,
        last5Submissions,
        languages,
        solved,
      ] = await Promise.all([
        axios.get(`http://localhost:3000/${username}`),
        axios.get(`http://localhost:3000/${username}/badges`),
        axios.get(`http://localhost:3000/${username}/calendar`),
        axios.get(`http://localhost:3000/${username}/contest`),
        axios.get(`http://localhost:3000/${username}/submission?limit=5`),
        axios.get(`http://localhost:3000/languageStats?username=${username}`),
        axios.get(`http://localhost:3000/${username}/solved`),
      ]);

    //   console.log(contests.data.contestParticipation[0]);

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
        calender:[],
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
        totalSubmissions: { All: solved.data.totalSubmissionNum[0].submissions, Easy: solved.data.totalSubmissionNum[1].submissions, Medium: solved.data.totalSubmissionNum[2].submissions, Hard: solved.data.totalSubmissionNum[3].submissions },
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

        const response = await axios.post('http://localhost:3001/api/saveStudentData', data, { withCredentials: true });
        console.log(response.data);
        
    } catch (error) {
        console.log(error.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="bg-black text-white p-4"
          type="text"
          placeholder="Enter Username"
        />
        <button disabled={loading} className="bg-red-300 p-4 ml-4">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Page;
