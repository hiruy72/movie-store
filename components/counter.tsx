'use client'

import {useState} from "react";

export default function Counter(){
    console.log('i am client component')
    const [count, setCount]= useState(0 )


    return(
        <div>
            <h1>
                Counter  {count}
            </h1>
            <button onClick={()=> setCount(p=>p+1)}>
                 count
            </button>
        </div>
    )
}