const logger = {
  info: (message: string, meta?: object) => {
    console.log(message, meta);
  },
  error: (message: string, meta?: object) => {
    console.error(message, meta);
  },
};

export default logger;
