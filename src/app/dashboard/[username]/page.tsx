//@typescript-eslint/no-unused-vars
//@typescript-eslint/no-explicit-any

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Github, Linkedin, Twitter } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spotlight } from '@/components/ui/spotlight-new';

// This would be your actual data fetching function
async function getStudentData(username: string) {

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

    console.log(username)
    const res = await fetch(`${baseUrl}/api/getStudentData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
        cache: "no-store", // Ensure fresh data in Next.js server components
      });
    
      
    
      const data = await res.json();
      console.log(data.student);

  return data.student;
}

function formatDate(dateString: string | number) {
    // Convert numeric timestamp to milliseconds (if necessary)
    const timestamp = typeof dateString === 'number' ? dateString * 1000 : dateString;
  
    // Create a Date object
    const date = new Date(timestamp);

  console.log(date)
    const datex = new Date(Number(timestamp) * 1000); // Convert seconds to milliseconds

const formattedDate = datex.toLocaleDateString("en-GB"); // "en-GB" format gives dd/mm/yyyy

// console.log(formattedDate)
return formattedDate;
    // Check if the date is valid
    // if (isNaN(date.getTime())) {
    //   console.error("Invalid date value:", dateString);
    //   return "Invalid Date";
    // }
  
    // Format the date

  }

function StatusBadge({ status }: { status: string }) {
  let color = "";
  switch(status) {
    case "Accepted":
      color = "bg-green-500";
      break;
    case "Wrong Answer":
      color = "bg-red-500";
      break;
    case "Time Limit Exceeded":
      color = "bg-yellow-500";
      break;
    default:
      color = "bg-gray-500";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${color}`}>
      {status}
    </span>
  );
}

export default async function UserDashboard({ params }: { params: { username: string } }) {
  const { username } = params;
  
  try {
    const studentData = await getStudentData(username);
    
    if (!studentData) {
      notFound();
    }
    
    const totalSolved = studentData.totalQuestions.All;
    const easyPercentage = (studentData.totalQuestions.Easy / totalSolved) * 100;
    const mediumPercentage = (studentData.totalQuestions.Medium / totalSolved) * 100;
    const hardPercentage = (studentData.totalQuestions.Hard / totalSolved) * 100;
    
    console.log(easyPercentage, mediumPercentage, hardPercentage);
  
      
    return (
      <div className="container antialiased mx-auto p-4 space-y-6 bg-black text-white">
              <Spotlight />

        {/* Header with basic info */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-gray-900 p-6 rounded-lg shadow">
          <Avatar className="w-20 h-20">
            <AvatarImage src={studentData.avatar} alt={studentData.fullName} />
            <AvatarFallback>{studentData.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{studentData.fullName}</h1>
            <p className="text-gray-400">@{studentData.username}</p>
            
            <div className="flex gap-2 mt-2">
              {studentData.socials.github && (
                <a href={`https://github.com/${studentData.socials.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <Github size={20} />
                </a>
              )}
              {studentData.socials.linkedin && (
                <a href={`https://linkedin.com/in/${studentData.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <Linkedin size={20} />
                </a>
              )}
              {studentData.socials.twitter && (
                <a href={`https://twitter.com/${studentData.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg">
            <span className="text-xl font-bold text-white">{studentData.rating}</span>
            <span className="text-sm text-gray-400">Rating</span>
          </div>
          
          <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg">
            <span className="text-xl font-bold text-white">#{studentData.raking}</span>
            <span className="text-sm text-gray-400">Ranking</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6 md:col-span-1">
            {/* About */}
            <Card className="bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{studentData.about}</p>
              </CardContent>
            </Card>
            
            {/* Languages */}
            <Card className="bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Main Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {studentData.mainLanguages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-white border-gray-700">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Badges */}
            <Card className="bg-gray-900">
  <CardHeader>
    <CardTitle className="text-white">Badges</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4">
      {studentData.badges.map((badge) => (
        <div
          key={badge.title}
          className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          {/* Badge Image */}
          <div className="relative flex flex-col w-12 h-12">
            <Image
              src={`https://assets.leetcode.com/static_assets/others/lg2550.png`} // Replace with your image path
              alt={badge.title}
              fill
              className="object-cover rounded-full"
            />
          </div>

          {/* Badge Details */}
          <div>
            <p className="font-medium text-white">{badge.title}</p>
            <p className="text-sm text-gray-400">{formatDate(badge.timeStamp)}</p>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
          </div>
          
          {/* Middle and Right Column */}
          <div className="space-y-6 md:col-span-2">
            {/* Problem Solving Stats */}
            <Card className="bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Problem Solving Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{studentData.totalQuestions.All}</p>
                    <p className="text-sm text-gray-400">Total Solved</p>
                  </div>
                  <div className="bg-green-900 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{studentData.totalQuestions.Easy}</p>
                    <p className="text-sm text-green-400">Easy</p>
                  </div>
                  <div className="bg-yellow-900 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{studentData.totalQuestions.Medium}</p>
                    <p className="text-sm text-yellow-400">Medium</p>
                  </div>
                  <div className="bg-red-900 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{studentData.totalQuestions.Hard}</p>
                    <p className="text-sm text-red-400">Hard</p>
                  </div>
                </div>
                
                {/* <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Easy</span>
                    <span className="text-green-400">{easyPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={easyPercentage} className="h-2 bg-gray-800" />
                  
                  <div className="flex justify-between text-sm mb-1 mt-3">
                    <span className="text-gray-400">Medium</span>
                    <span className="text-yellow-400">{mediumPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={mediumPercentage} className="h-2 bg-gray-800" indicatorClassName="bg-yellow-500" />
                  
                  <div className="flex justify-between text-sm mb-1 mt-3">
                    <span className="text-gray-400">Hard</span>
                    <span className="text-red-400">{hardPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={hardPercentage} className="h-2 bg-gray-800" indicatorClassName="bg-red-500" />
                </div> */}
              </CardContent>
            </Card>
            
            {/* Recent Submissions and Contests */}
            <Tabs defaultValue="submissions">
              <TabsList className="grid  grid-cols-2 bg-gray-800">
                <TabsTrigger value="submissions"     className="text-gray-400 cursor-pointer data-[state=active]:text-black data-[state=active]:bg-white"
                >Recent Submissions</TabsTrigger>
                <TabsTrigger value="contests"     className="text-gray-400 cursor-pointer data-[state=active]:text-black data-[state=active]:bg-white"
                >Contests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="submissions" className="mt-4">
                <Card className="bg-gray-900">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {studentData.last5Submissions.map((submission, index) => (
                        <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-white">{submission.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusBadge status={submission.status} />
                                <span className="text-xs text-gray-400">{submission.language}</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-400">{formatDate(submission.timeStamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contests" className="mt-4">
                <Card className="bg-gray-900">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {studentData.contests.map((contest, index) => (
                        <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-white">{contest.title}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                <span className="text-sm text-gray-400">Rank: <strong className="text-white">#{contest.ranking}</strong></span>
                                <span className="text-sm text-gray-400">Solved: <strong className="text-white">{contest.problemsSolved}/{contest.totalQuestions}</strong></span>
                                <span className="text-sm text-gray-400">Rating: <strong className="text-white">{contest.rating}</strong></span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-400">{formatDate(contest.timeStamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Submission Calendar */}
            {/* <Card className="bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Questions solved in the last few days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {studentData.calender.map((day) => (
                    <div 
                      key={day.date} 
                      className={`w-10 h-10 flex items-center justify-center rounded-md 
                        ${day.questions === 0 ? 'bg-gray-800' : 
                          day.questions <= 1 ? 'bg-green-900' : 
                          day.questions <= 3 ? 'bg-green-700' : 
                          'bg-green-500'}`}
                      title={`${day.questions} questions on ${formatDate(day.date)}`}
                    >
                      {day.questions}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching student data:", error);
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Error</h1>
          <p className="text-gray-400">Failed to load user data. Please try again later.</p>
        </div>
      </div>
    );
  }
}