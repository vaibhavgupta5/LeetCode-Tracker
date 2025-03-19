'use client'
import axios from "axios";
import { useEffect } from "react";

export default function Home() {

  const getData = async () => {
    const user = await axios.get("http://localhost:3000/pratyush-who")
    console.log(user)
  }

  useEffect(() => {
    getData()
  }, [])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <button className="cursor-pointer" onClick={getData} >Click</button>
    </div>
  );
}
