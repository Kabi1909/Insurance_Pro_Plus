import { fail } from './security.js';
const writers={
  claims:['Claims Officer','Claims Manager'],
  policies:['Claims Manager','Finance Officer','Policy Officer'],
  documents:['Claims Officer','Claims Manager','Support Officer'],
  tickets:['Support Officer'],
};
export function requireWrite(user,kind){
  if(user?.kind!=='admin'||(user.role!=='System Administrator'&&!writers[kind]?.includes(user.role)))fail(403,'Your staff role cannot perform this action.');
}
