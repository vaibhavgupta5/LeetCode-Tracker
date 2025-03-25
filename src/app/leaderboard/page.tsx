"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/Models/Student";
import { Spotlight } from "@/components/ui/spotlight-new";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { SparklesCore } from "@/components/ui/sparkles";
import { useRouter } from "next/navigation";
import { FaSearch, FaSync } from "react-icons/fa"; // Import icons
import axios from "axios";

export default function LeaderboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
  
      const response = await fetch("/api/getAllStudentData", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const student = data.student;
      student.sort((a, b) => a.raking - b.raking);
  
      setStudents(student);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const router = useRouter();
  const redirectToProfile = (username: string) => {
    router.push(`/dashboard/${username}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return "text-green-400";
    if (position === 2) return "text-blue-400";
    if (position === 3) return "text-purple-400";
    return "text-gray-400";
  };

  const refreshData = async () => {
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await axios.get(`${baseUrl}/api/updateAllStudentDataAtOnce`);

    if (response.status === 200) {
      fetchStudents();
    } else {
      console.error("Error refreshing data:", response.statusText);
      setLoading(false);
    }
  }

  const getSuccessRate = (student: Student) => {
    if (student.totalSubmissions.All === 0) return "0.00%";
    const rate =
      (student.totalQuestions.All / student.totalSubmissions.All) * 100;
    return `${rate.toFixed(2)}%`;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-green-400 text-xl">Loading leaderboard...</div>
      </div>
    );
  }

  const topStudents = students.slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Spotlight />
      <ShootingStars />
      <StarsBackground />

      <div className="max-w-6xl mx-auto">
        <h1 className="md:text-7xl text-3xl flex w-full justify-center items-center lg:text-9xl font-bold text-center text-white relative z-20">
          Leaderboard
        </h1>
      

        <div className="relative h-[40vh] mb-16 w-full rounded-lg p-4 overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-center z-20">
            <div className="flex flex-col items-center w-56 mx-4 mb-8 transform transition-transform duration-300 hover:scale-105">
              <div className="mb-2">
                <div className="w-14 h-14 rounded-full border-2 border-blue-500/50 p-1 bg-gray-800">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={topStudents[1]?.avatar}
                      alt={topStudents[1]?.fullName}
                    />
                    <AvatarFallback className="bg-gray-700 text-blue-400">
                      {getInitials(topStudents[1]?.fullName || "SK")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="bg-gray-800 p-2 border border-blue-500/20 rounded-lg w-full shadow-md">
                <div className="text-blue-400 mb-1 font-medium text-sm text-center truncate">
                  {topStudents[1]?.username || "Player 2"}
                </div>
                <div className="text-white text-center font-medium">
                  {topStudents[1]?.rating || "1200"}
                </div>
                <div className="text-gray-400 text-xs text-center mt-1">
                  RATING
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center w-56 mx-4 mb-16 transform transition-transform duration-300 hover:scale-105">
              <div className="mb-2">
                <div className="w-14 h-14 rounded-full border-2 border-green-500/50 p-1 bg-gray-800">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={topStudents[0]?.avatar}
                      alt={topStudents[0]?.fullName}
                    />
                    <AvatarFallback className="bg-gray-700 text-green-400">
                      {getInitials(topStudents[0]?.fullName || "MS")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="bg-gray-800 p-2 border border-green-500/20 rounded-lg w-full shadow-md">
                <div className="text-green-400 mb-1 font-medium text-sm text-center truncate">
                  {topStudents[0]?.username || "Player 1"}
                </div>
                <div className="text-white text-center font-medium">
                  {topStudents[0]?.rating || "1500"}
                </div>
                <div className="text-gray-400 text-xs text-center mt-1">
                  RATING
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center w-56 mx-4 mb-4 transform transition-transform duration-300 hover:scale-105">
              <div className="mb-2">
                <div className="w-14 h-14 rounded-full border-2 border-purple-500/50 p-1 bg-gray-800">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={topStudents[2]?.avatar}
                      alt={topStudents[2]?.fullName}
                    />
                    <AvatarFallback className="bg-gray-700 text-purple-400">
                      {getInitials(topStudents[2]?.fullName || "BM")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="bg-gray-800 p-2 border border-purple-500/20 rounded-lg w-full shadow-md">
                <div className="text-purple-400 mb-1 font-medium text-sm text-center truncate">
                  {topStudents[2]?.username || "Player 3"}
                </div>
                <div className="text-white text-center font-medium">
                  {topStudents[2]?.rating || "1000"}
                </div>
                <div className="text-gray-400 text-xs text-center mt-1">
                  RATING
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="gridGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{
                      stopColor: "rgba(255, 255, 255, 0.05)",
                      stopOpacity: 1,
                    }}
                  />
                  <stop
                    offset="100%"
                    style={{
                      stopColor: "rgba(255, 255, 255, 0.01)",
                      stopOpacity: 1,
                    }}
                  />
                </linearGradient>
              </defs>
              <g stroke="url(#gridGradient)" strokeWidth="1">
                <line x1="150" y1="300" x2="500" y2="250" />
                <line x1="500" y1="250" x2="850" y2="300" />
                <line x1="150" y1="300" x2="150" y2="350" />
                <line x1="500" y1="250" x2="500" y2="350" />
                <line x1="850" y1="300" x2="850" y2="350" />
                <line x1="150" y1="350" x2="500" y2="350" />
                <line x1="500" y1="350" x2="850" y2="350" />
              </g>
            </svg>
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden pl-4 pr-4">
          <CardHeader className="p-4 border-b border-gray-800 flex justify-between items-center z-10">
            <CardTitle className="text-gray-300 text-lg">Leaderboard</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="bg-gray-800 text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <button
                onClick={()=> refreshData()}
                className="p-2 bg-gray-800 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaSync className="text-gray-400 cursor-pointer" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-300 font-semibold w-20 py-4">
                      RANK
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      PLAYER
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      SOLVED
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      <div className="flex space-x-2">
                        <span className="text-green-400">E</span>
                        <span className="text-yellow-400">M</span>
                        <span className="text-red-400">H</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      SUCCESS RATE
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      LANGUAGES
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold text-right py-4">
                      RATING
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow
                      key={index}
                      className="border-gray-700/50 cursor-pointer hover:bg-gray-800/30 transition-colors"
                      onClick={() => redirectToProfile(student.username)}
                    >
                      <TableCell
                        className={`py-3 ${getPositionColor(student.raking)}`}
                      >
                        {student.raking === 1 && "🥇 "}
                        {student.raking === 2 && "🥈 "}
                        {student.raking === 3 && "🥉 "}
                        {student.raking}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 ring-1 ring-gray-700">
                            <AvatarImage src={student.avatar} />
                          </Avatar>
                          <div className="text-gray-200 font-medium">
                            {student.username}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 font-medium">
                        {student.totalQuestions.All}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex space-x-3">
                          <span className="text-green-400">
                            {student.totalQuestions.Easy}
                          </span>
                          <span className="text-yellow-400">
                            {student.totalQuestions.Medium}
                          </span>
                          <span className="text-red-400">
                            {student.totalQuestions.Hard}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {getSuccessRate(student)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 flex-wrap">
                          {student.mainLanguages.map((lang, i) => (
                            <Badge
                              key={i}
                              className="bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors text-xs border-0"
                            >
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-gray-300 font-medium">
                        {student.rating}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}