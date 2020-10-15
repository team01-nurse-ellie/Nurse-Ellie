const generateCode = (chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", length = 5) => {
    // default should be 5 charcters long. 
    // default characters set to generate code from.  
    let code = "";
    for (let i = length; i > 0; --i) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};

export {
    generateCode
};