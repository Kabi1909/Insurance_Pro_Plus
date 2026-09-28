import { createApp } from './app.js';
const app=await createApp();
const port=Number(process.env.PORT || 3001);
app.server.listen(port,process.env.HOST || '127.0.0.1',()=>console.log(`Insurance Pro Plus API running on port ${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await app.close();process.exit(0);});
