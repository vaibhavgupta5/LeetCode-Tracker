// app/dashboard/[username]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Skeleton className="w-20 h-20 rounded-full" />
        
        <div className="flex-1">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
        
        <Skeleton className="w-24 h-20 rounded-lg" />
        <Skeleton className="w-24 h-20 rounded-lg" />
      </div>
      
      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle and Right Column */}
        <div className="space-y-6 md:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <Skeleton className="h-6 w-48 mb-6" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-2 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-2 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-10 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-1/2 rounded-md" />
            </div>
            
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <Skeleton className="h-5 w-48 mb-2" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-64 mb-6" />
            
            <div className="flex gap-2 flex-wrap">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}