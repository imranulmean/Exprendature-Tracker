import React, { useEffect, useRef, useState } from "react";
import HeaderPublic from "./HeaderPublic";
import { ALLAH_NAMES } from "./names";
import { Card, TextInput, Button } from "flowbite-react";

export default function StartPractice() {

  const [inputName, setInputName]=useState('');
  const [names, setNames]= useState([]);
  useEffect(() => {
  }, []);

  const handleSubmit= (e) => {
    e.preventDefault();
    setNames((prev)=>[...prev, inputName]);
  }

  return (
      <>
        <div className="flex flex-col justyfy-center items-center gap-2 p-4">
          <form className="flex max-w-md gap-4" onSubmit={handleSubmit}>
              <div>
                <TextInput onChange={(e)=>setInputName(e.target.value)} type="text" placeholder="Enter" required />
              </div>
              <button type="submit" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 text-center text-sm font-medium text-gray-100 hover:bg-cyan-900">Submit</button>            
          </form>      
          <Card>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {
                  names.map((d, index)=>{ 
                      return(
                          <li className="pb-0 pt-3 sm:pt-4">
                            <div className="flex items-center space-x-4">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {index+1}.{' '}{d}
                                </p>
                              </div>
                            </div>
                          </li>
                      )                                            
                  })
                }            

              </ul>
            </div>
          </Card>          
          <Card>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {
                  ALLAH_NAMES.map((d, index)=>{ 
                      return(
                          <li className="pb-0 pt-3 sm:pt-4">
                            <div className="flex items-center space-x-4">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {index+1}.{' '}{d.english}
                                </p>
                              </div>
                              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                {d.arabic}
                              </div>
                            </div>
                          </li>
                      )                                            
                  })
                }            

              </ul>
            </div>
          </Card> 
        </div>
      
      </>

  );
}
