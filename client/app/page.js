"use client"
import React, { useEffect, useState } from 'react';

const Page = () => {
  useEffect(()=>{
    columns();
  },[])
  const columns=async()=>{
    const response=await fetch('http://127.0.0.1:5000/columns');
    const data=await response.json();
    console.log(data);
    setLocations(data.columns)
    setLocations((prev) => prev.slice(3));
  }
  const [location,setLocation]=useState("1st Block Jayanagar");
  const [sqft,setSqft]=useState(100);
  const[bath,setBath]=useState(1);
  const[bhk,setBhk]=useState(1);
  const [locations,setLocations] =useState( ["1st Block Jayanagar", "Whitefield", "Indiranagar"]);
  const [output,setOutput]=useState(null);
const submit=async (e)=>{
  e.preventDefault();
  const requestData = {
    location,
    sqft: Number(sqft),
    bhk: Number(bhk),
    bath: Number(bath),
  };
  const response = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  const data = await response.json();
  setOutput(data.predicted_price)
    console.log("Predicted Price:", data.predicted_price);
  //  console.log(location,sqft,bath,bhk)
}
  return (
    <div className="bg-white h-screen  text-black flex justify-center items-center">
      <form className="border-2 border-gray w-[500px] h-[500px] p-6 rounded-lg shadow-md">
                <div className="mb-4">
          <label className="block text-lg mb-2">Select Location</label>
          <select className="w-full border p-2 rounded" value={location} onChange={(e)=>{setLocation(e.target.value)}}>
            {locations.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>
                <div className="mb-4">
          <label className="block text-lg mb-2">Square ft</label>
            <input type="text" placeholder='Enter in square feet' className='border-2 border-gray rounded-e-md p-2 w-[450px]' value={sqft} onChange={(e)=>{setSqft(e.target.value)}} />
        </div>

                <div className="mb-4">
          <label className="block text-lg mb-2">Bathrooms</label>
          <select className="w-full border p-2 rounded"  value={bath} onChange={(e)=>{setBath(e.target.value)}} > 
            {[1,2,3,4,5].map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>
                <div className="mb-4">
          <label className="block text-lg mb-2">Bedrooms</label>
          <select className="w-full border p-2 rounded"  value={bhk} onChange={(e)=>{setBhk(e.target.value)}}>
            {[1,2,3,4,5].map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>

        </div>
          <button className='bg-green-700 p-2 rounded mx-auto flex ' onClick={(e)=>{submit(e)}}>Submit</button>
      {output?<div className='font-bold flex justify-center mt-3'>Predicted :{output}</div>:""}
      </form>
    </div>
  );
}

export default Page;
