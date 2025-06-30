//@typescript-eslint/no-unused-vars
//@typescript-eslint/no-explicit-any
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
import { Spotlight } from "@/components/ui/spotlight-new";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { useRouter } from "next/navigation";
import { FaSearch, FaSync } from "react-icons/fa";
import axios from "axios";
import { Code, Rocket } from "lucide-react";
import Link from "next/link";
import { IStudent } from "@/Models/Student";

export default function LeaderboardPage() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
  
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
    <div className="min-h-screen bg-black text-white">
      <Spotlight />
      <ShootingStars />
      <StarsBackground />

         <header className="bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg text-white">LeetCode Dashboard</span>
          </Link>
          
          <nav className="md:flex  gap-4 fixed bottom-4 left-0 w-full md:w-fit items-center justify-between bg-white z-50  py-4 text-[#10192A] px-6 hidden  shadow-lg md:static md:bg-transparent md:shadow-none md:text-white md:py-0">
            <Link href="/register" className=" font-bold w-full md:w-fit text-center hover:text-black md:hover:text-white transition-colors">
              Add Yourself
            </Link>
           
          </nav>
        </div>
      </header>
      <div className="max-w-6xl mx-auto mt-12 md:mt-6">
        <h1 className="md:text-7xl text-3xl flex w-full justify-center items-center lg:text-9xl font-bold text-center text-white relative z-20">
          Leaderboard
        </h1>
        
<div className="relative md:h-[40vh] h-auto mb-16 w-full rounded-lg p-4 overflow-hidden max-h-[400px]">
  {/* Mobile View - Vertical Stack */}
  <div className="md:hidden flex flex-col items-center space-y-4">
    {topStudents.map((student, index) => (
      <div 
        key={student.username} 
        className={`flex items-center w-full max-w-md p-4 bg-gray-800 rounded-lg border ${
          index === 0 ? 'border-green-500/50' : 
          index === 1 ? 'border-blue-500/50' : 
          'border-purple-500/50'
        }`}
      >
        <div className={`w-12 h-12 rounded-full border-2 p-1 mr-4 ${
          index === 0 ? 'border-green-500/50' : 
          index === 1 ? 'border-blue-500/50' : 
          'border-purple-500/50'
        }`}>
          <Avatar className="w-full h-full">
            <AvatarImage
              src={student?.avatar}
              alt={student?.fullName}
            />
            <AvatarFallback className={`bg-gray-700 ${
              index === 0 ? 'text-green-400' : 
              index === 1 ? 'text-blue-400' : 
              'text-purple-400'
            }`}>
              {getInitials(student?.fullName || "SK")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className={`font-medium truncate ${
            index === 0 ? 'text-green-400' : 
            index === 1 ? 'text-blue-400' : 
            'text-purple-400'
          }`}>
            {student?.username || `Player ${index + 1}`}
          </div>
          <div className="text-white font-medium">
            {student?.rating || "1200"}
          </div>
          <div className="text-gray-400 text-xs">
            RATING
          </div>
        </div>
        {index === 1 && (
          <div className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
            2nd
          </div>
        )}
        {index === 0 && (
          <div className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
            1st
          </div>
        )}
        {index > 1 && (
          <div className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
            {index + 1}th
          </div>
        )}
      </div>
    ))}
  </div>

  {/* Desktop View - Same as original */}
  <div className="hidden md:block absolute inset-0 flex items-end justify-center z-20">
    <div className="flex h-full space-x-8 items-end flex-wrap justify-center">
      {topStudents.map((student, index) => (
        <div 
          key={student.username} 
          className={`flex flex-col items-center w-56 mb-8 transform transition-transform duration-300 hover:scale-105 ${
            index === 1 ? 'mb-16' : ''
          }`}
        >
          <div className="mb-2">
            <div className={`w-14 h-14 rounded-full border-2 p-1 bg-gray-800 ${
              index === 0 ? 'border-green-500/50' : 
              index === 1 ? 'border-blue-500/50' : 
              'border-purple-500/50'
            }`}>
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={student?.avatar}
                  alt={student?.fullName}
                />
                <AvatarFallback className={`bg-gray-700 ${
                  index === 0 ? 'text-green-400' : 
                  index === 1 ? 'text-blue-400' : 
                  'text-purple-400'
                }`}>
                  {getInitials(student?.fullName || "SK")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="bg-gray-800 p-2 border rounded-lg w-full shadow-md border-opacity-20 text-center">
            <div className={`mb-1 font-medium text-sm truncate ${
              index === 0 ? 'text-green-400' : 
              index === 1 ? 'text-blue-400' : 
              'text-purple-400'
            }`}>
              {student?.username || `Player ${index + 1}`}
            </div>
            <div className="text-white font-medium">
              {student?.rating || "1200"}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              RATING
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Desktop Background */}
  <div className="hidden md:block absolute inset-0 pointer-events-none">
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
        <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
          <CardHeader className="p-4 border-b border-gray-800 flex flex-col md:flex-row justify-between items-center z-10 space-y-4 md:space-y-0">
            <CardTitle className="text-gray-300 text-lg">Leaderboard</CardTitle>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full md:w-auto bg-gray-800 text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => refreshData()}
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
                    <TableHead className="text-gray-300 font-semibold w-20 py-4 hidden md:table-cell">
                      RANK
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">
                      PLAYER
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4 hidden md:table-cell">
                      SOLVED
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4 hidden md:table-cell">
                      <div className="flex space-x-2">
                        <span className="text-green-400">E</span>
                        <span className="text-yellow-400">M</span>
                        <span className="text-red-400">H</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4 hidden md:table-cell">
                      SUCCESS RATE
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4 hidden md:table-cell">
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
                        className={`py-3 ${getPositionColor(student.raking)} hidden md:table-cell`}
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
                      <TableCell className="text-gray-300 font-medium hidden md:table-cell">
                        {student.totalQuestions.All}
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
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
                      <TableCell className="text-gray-300 hidden md:table-cell">
                        {getSuccessRate(student)}
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
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
        <div className="fixed bottom-5 right-5 p-3 flex items-center justify-center z-50 text-black rounded-full cursor-pointer bg-white" onClick={() => router.push('/register')}>
          <Rocket strokeWidth={2.25} />
        </div>
      </div>
    </div>
  );
}