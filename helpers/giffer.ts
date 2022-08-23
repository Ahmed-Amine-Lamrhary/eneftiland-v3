const gifshot = require("gifshot");

export const createGif = ({ gifArray, width, height }: any) => {
  return new Promise((resolve, reject) => {
    gifshot.createGIF(
      {
        images: gifArray,
        gifWidth: width,
        gifHeight: height,
        numWorkers: 2,
        interval: 0.5,
      },
      function (obj: any) {
        if (!obj.error) {
          resolve(obj);
        } else {
          reject(obj.error);
        }
      }
    );
  });
};
