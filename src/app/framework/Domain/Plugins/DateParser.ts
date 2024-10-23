export function parseDate(replace:string = "d/m/Y h:M:s", d: Date = new Date()){
   let nz = (dt:number)=> dt<10?"0".concat(dt.toString()):dt.toString()
   return replace.replace(/d/g,nz(d.getDate()))
   .replace(/m/g,nz(d.getMonth()+1))
   .replace(/Y/g,nz(d.getFullYear()))
   .replace(/h/g,nz(d.getHours()))
   .replace(/M/g,nz(d.getMinutes()))
   .replace(/s/g,nz(d.getSeconds()))
}