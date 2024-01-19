import configkeys from "./configKeys.js";
const serverConnection = (server)=>{
    server.listen(configkeys.PORT,()=>{
        console.log(`Server started at http://localhost:${configkeys.PORT}`);
    })
}

export default serverConnection