import { useState } from "react";

export default function App() {

const [steps,setSteps] = useState([])

const agents = [

{
name:"Militarny",
system:"Jesteś wojskowym instruktorem. Pisz rozkazującym stylem."
},

{
name:"Cywilny",
system:"Jesteś domowym kucharzem. Pisz spokojnie."
},

{
name:"Morski",
system:"Jesteś kucharzem na statku."
},

{
name:"Lądowy",
system:"Jesteś kucharzem polowym."
},

{
name:"Wywiad",
system:"Jesteś analitykiem wywiadu opisującym operację."
},

{
name:"Neutralny",
system:"Jesteś neutralnym asystentem kuchennym."
}

]

async function runAgents(){

let outputs = []

for(let i=0;i<agents.length;i++){

let prompt = `Napisz tylko jeden krok przepisu na ciasto orzechowe.
To jest krok numer ${i+1} z 6.`

const response = await fetch("http://localhost:11434/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

model:"SpeakLeash/bielik-7b-instruct-v0.1-gguf:Q6_K",

messages:[
{role:"system",content:agents[i].system},
{role:"user",content:prompt}
]

})

})

const data = await response.json()

outputs.push(data.message.content)

}

setSteps(outputs)

}

return(

<div style={{padding:"40px"}}>

<h1>System Multi-Agent AI</h1>

<button onClick={runAgents}>
Uruchom agentów
</button>

{steps.map((step,i)=>(
<div key={i} style={{marginTop:"20px"}}>

<h3>Krok {i+1}</h3>
<p>{step}</p>

</div>
))}

</div>

)

}