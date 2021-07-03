
const parseArgs = (numArgs, isWrapped) =>{
    const az = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  let args = "(";
  let i = 0; 
  
  
  while (i < numArgs){
    if (i < 26){
      const wraped = '${' + az[i] + '}';
      const unWraped =  az[i];

       switch(isWrapped){
         case false:
          i == numArgs - 1? args += unWraped : args += unWraped + ', ';
          i++; 
           break;
         default:
          i == numArgs - 1? args += wraped : args += wraped + ', ';
          i++; 
           break;
       } 

  
    } else {
      switch(isWrapped){
        case false:
          const unWrapedOver =  az[i % 26].repeat(Number.isInteger(i / 26) ? (i/26) + 1 : Math.ceil(i/26));
          i == numArgs - 1? args += unWrapedOver : args += unWrapedOver + ', ';
          i++;
          break;
        default:
          const wrapedOver = '${' + az[i % 26].repeat(Number.isInteger(i / 26) ? (i/26) + 1 : Math.ceil(i/26)) + '}';
          i == numArgs - 1? args += wrapedOver : args += wrapedOver + ', ';
          i++;
          break;
      } 
    }
  };

    args = args + ")";
    return args;
};

module.exports = parseArgs; 