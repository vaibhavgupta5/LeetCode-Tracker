'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight-new';

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/getAllStudentData', {
          cache: 'no-store',
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch students');
        }
        
        const data = await res.json();
        // Assuming the response contains an array of students
        // If not, adjust accordingly based on your actual API response structure
        const studentsData = Array.isArray(data.students) ? data.students : [data.student];
        
        setStudents(studentsData);
        setFilteredStudents(studentsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        student => 
          student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="container w-full p-4 flex item-center flex-col space-y-6 bg-black text-white min-h-screen">
      <Spotlight />
      
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Coding Champions Leaderboard
        </motion.h1>
        <motion.p 
          className="text-gray-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Top problem solvers ranked by performance
        </motion.p>
      </div>
      
      {/* Search Bar */}
      <motion.div 
        className="relative max-w-md mx-auto mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="text" 
            placeholder="Search by name or username..." 
            className="pl-10 bg-gray-900 border-gray-700 text-white"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </motion.div>
      
      {/* Leaderboard */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <motion.div 
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Leaderboard Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800 rounded-lg font-medium text-sm">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5 md:col-span-4">User</div>
            <div className="col-span-2 text-center">Rating</div>
            <div className="col-span-2 text-center hidden md:block">Solved</div>
            <div className="col-span-2 text-center">Languages</div>
            <div className="col-span-2 md:col-span-1 text-center hidden md:block">Profile</div>
          </div>
          
          {/* Leaderboard Items */}
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <motion.div 
                key={student._id || index}
                variants={itemVariants}
                className={`grid grid-cols-12 gap-4 p-4 rounded-lg items-center ${
                  index < 3 ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gray-900'
                } hover:bg-gray-800 transition-colors duration-200`}
              >
                {/* Rank */}
                <div className="col-span-1 text-center">
                  {index < 3 ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                      {index + 1}
                    </div>
                  ) : (
                    <span className="text-gray-400">#{index + 1}</span>
                  )}
                </div>
                
                {/* User */}
                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-gray-700">
                    <AvatarImage src={student.avatar} alt={student.fullName} />
                    <AvatarFallback className="bg-gray-800">{student.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white truncate">{student.fullName}</p>
                    <p className="text-xs text-gray-400">@{student.username}</p>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="col-span-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{student.rating}</span>
                    <span className="text-xs text-gray-400">#{student.raking}</span>
                  </div>
                </div>
                
                {/* Problems Solved */}
                <div className="col-span-2 text-center hidden md:block">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{student.totalQuestions?.All || 0}</span>
                    <div className="flex gap-1 text-xs">
                      <span className="text-green-400">{student.totalQuestions?.Easy || 0}</span>
                      <span className="text-yellow-400">{student.totalQuestions?.Medium || 0}</span>
                      <span className="text-red-400">{student.totalQuestions?.Hard || 0}</span>
                    </div>
                  </div>
                </div>
                
                {/* Languages */}
                <div className="col-span-2 text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {student.mainLanguages && student.mainLanguages.slice(0, 2).map((lang, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-gray-700">
                        {lang}
                      </Badge>
                    ))}
                    {student.mainLanguages && student.mainLanguages.length > 2 && (
                      <Badge variant="outline" className="text-xs border-gray-700">
                        +{student.mainLanguages.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* View Profile */}
                <div className="col-span-2 md:col-span-1 text-center hidden md:block">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-700 hover:bg-gray-700 text-xs"
                    onClick={() => window.location.href = `/dashboard/${student.username}`}
                  >
                    View
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <Card className="bg-gray-900">
              <CardContent className="flex flex-col items-center py-10">
                <p className="text-gray-400 mb-4">No students found matching your search.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="border-gray-700"
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}