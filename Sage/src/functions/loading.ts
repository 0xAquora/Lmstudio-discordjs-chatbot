import { LMStudioClient, LLMSpecificModel } from '@lmstudio/sdk';

export async function LoadSpecificModel() {
    const client = new LMStudioClient();


    // loads an specific model OF YOUR CHOOSING of your choosing + overrides configuration
    const modelLoaded = await client.llm.load("mradermacher/Roleplay-Mistral-7B-i1-GGUF", {
    config: { gpuOffload: "max",
        contextLength: 1048, //response max lenght
    },
    //Friendly wat to identify your model
    identifier: "Sage", 
    //make the service a daemon
    noHup: true,
    //shows progress of the Machine loading into memory
    onProgress: (progress) => {
        console.log(`Progress: ${(progress * 100).toFixed(1)}%`);},
});

//here you get the model with their identifier
const myModel = await client.llm.get({identifier: "Sage"});
return myModel;
}
//IF YOU LOADED THIS PREVIOUSLY, IT WILL GIVE AN ERROR THAT IT IS ALREADY LOADED IN MEMORY, IF THAT HAPPEN
//EITHER COMMENT THE LOADING CODE, OR UNLOAD THE MODEL FROM THE LMS CLIENT