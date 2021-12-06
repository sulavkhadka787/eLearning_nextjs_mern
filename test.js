const aa = {
  z: 1,
  y: 2,
};

const bb = {
  z: 111,
};

const cc = { ...aa, ...bb };
console.log(aa);
console.log(cc);
