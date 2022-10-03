export const getSizeInBytes = (obj: any) => {
  let str;

  if (typeof obj === 'string') {
    // If obj is a string, then use it
    str = obj;
  } else {
    // Else, make obj into a string
    str = JSON.stringify(obj);
  }
  // Get the length of the Uint8Array
  return new TextEncoder().encode(str).length;
};
