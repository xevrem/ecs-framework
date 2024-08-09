


function serialize(obj: Object ): void {
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    const shared = new SharedArrayBuffer(32, {
      maxByteLength: 1024
    });
    
    switch(typeof descriptor?.value){
      case "number":
        
        break;
      default:
        break;
    }
  });
}
