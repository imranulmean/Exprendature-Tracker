import React, { useEffect, useRef, useState } from "react";
import HeaderPublic from "./HeaderPublic";
import { ALLAH_NAMES } from "./names";
import { Card, TextInput, Button } from "flowbite-react";

export default function StartPractice() {

  const [inputName, setInputName]=useState('');
  const [names, setNames]= useState([]);
  const [missingNames, setMissingNames]= useState([]);


  const normalize = (str) => {
    return str
      .toLowerCase()
      // Remove prefixes like Al-, Ar-, As-, etc.
      .replace(/^(al-|ar-|as-|at-|an-|ash-|az-|ad-|dhul-)/g, '')
      // Remove special characters/accents (ḥ, ā, ḍ, etc.)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      // Remove non-alphanumeric characters (apostrophes, hyphens)
      .replace(/[^a-z0-9]/g, '');
  };  

const handleSubmit= (e) => {
  e.preventDefault();
  setNames((prev)=>[...prev, inputName]);
  setInputName('');
}
 

  const compare = () => {

    const missing = ALLAH_NAMES.filter(allahuName => {
      const target = normalize(allahuName.english);
      
      // Check if any of the user's inputs match this specific Name
      const found = names.some(userInput => {
        const input = normalize(userInput);
        // Returns true if exact match or if user input is a significant part of the name
        return input === target || (target.includes(input) && input.length > 3);
      });

      return !found;
    });

    setMissingNames(missing);
  };

  return (
      <>
        <HeaderPublic/>
        <div className="flex flex-col justyfy-center items-center gap-2 p-4">
          <form className="flex max-w-md gap-4" onSubmit={handleSubmit}>
              <div>
                <TextInput value={inputName}
                onChange={(e)=>setInputName(e.target.value)} type="text" placeholder="Enter" required />
              </div>
              <button type="submit" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 text-center text-sm font-medium text-gray-100 hover:bg-cyan-900">Submit</button>
              <button type="button" onClick={compare}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-green-900 px-4 py-2 text-center text-sm font-medium text-gray-100 hover:bg-cyan-900">Compare</button>
          </form>
          <div className="flex gap-2">
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
                    missingNames.map((d, index)=>{ 
                        return(
                            <li className="pb-0 pt-3 sm:pt-4">
                              <div className="flex items-center space-x-4">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {index+1}.{' '}{d.english}
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
          </div>      
        
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
