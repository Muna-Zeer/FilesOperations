//Import important modules
const wordCount = require("word-count");//Module to count words
const fs = require("fs");//for file system
const error=require('errorhandler')//for error handling


//function to read files aync and count the words
const countWordOfFiles = (filePath) => {
    //check if the file exists
    if (!fs.existsSync(filePath)) {
        return Promise.reject(`${filePath} does not exist in the current directory`);
    }

    // return a promise for asynchronous reading of the file
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            // if an error occurs while reading the file, reject the promise
            if (err) {
                reject(err.message);
            } else {
                // check if the file is empty
                if (data.trim() === '') {
                    // resolve the promise with a custom message for empty files
                    resolve({ file: filePath, wordCount: 0, message: "Your file is empty" });
                }
                
                else {
                 // Remove symbols from the file content using a regular expression
                 const cleanData = removeSymbols(data);
                 // Count the words in the cleaned data
                 const countAllWords = wordCount(cleanData);
                 resolve({ file: filePath, wordCount: countAllWords });
                }
            }
        });
    });
};

// Function to remove symbols from the word count
const removeSymbols = (text) => {
    // This regex removes all non-word characters and whitespace
      const regex = /[^\w\s]/gi; 
      return text.replace(regex, '');
  };
  

//function to read files from config.json file

const readConfigFiles = () => {
    try {
        //read the content of config.json sync way
      const configData = fs.readFileSync("config.json", "utf8");
      //parse the json content to extract the path
      const dataParsing = JSON.parse(configData);
      //return the path to the config.json file
      return dataParsing.files;

    } 
    //handle error the may occur when paring the files or while reading
    catch (err) {
      if (err.code === 'ENOENT') {
        console.error("config.json file not found. Make sure it exists in the project directory.");
      } else {
        console.error("Error while reading config.json:", err.message);
      }
      //exist the process when non-zero exist code to config error
     throw new error(`${err.message}`)
    }
  };
//read the file paths from config.json file   
  const files = readConfigFiles();
  console.log('files',files); 
//make specific process to count words from each file async
const filePaths = readConfigFiles();

const processingDataFiles = async () => {
  const resultProcess = [];
  //iterative for each file in the array
  for (const filePath of filePaths) {
    try {
        //call the function that count the words 
      const result = await countWordOfFiles(filePath);

      resultProcess.push(result);
    } catch (error) {
      //if error occur then push the error to the array
      resultProcess.push({ file: filePath, error: error });
    }
  }
return resultProcess;
};


const mainProcessing=async()=>{
try {
   const resultOfWordsCount=await processingDataFiles();
    // Iterate over the processed results
   resultOfWordsCount.forEach(element => {
    if(element.error){
        console.log(`${element.file} error processing return ${element.error}`);
    }
    else {
        // If processing is successful but is empty
        if (element.wordCount === 0 && element.message) {
            // log error message
            console.log(`${element.file}: ${element.message}`);
        } else {
            
            // log file nan=me and msg
            console.log(`${element.file} completed successfully and contains ${element.wordCount} words.`);
        }
    }
   }
   
   ); 
} catch (error) {
     // If processing is failed, log this
    console.log('Error processing return ${error.message');
}
}

mainProcessing();