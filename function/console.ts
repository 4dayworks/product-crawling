export const l = (
  header: string,
  color: "red" | "green" | "yellow" | "blue" | "magenta" | "cyan",
  message?: string
) => {
  switch (color) {
    case "red":
      console.log("\x1b[31m%s\x1b[0m %s", header.padStart(10), message); // red
      break;
    case "green":
      console.log("\x1b[32m%s\x1b[0m %s", header.padStart(10), message); // green
      break;
    case "yellow":
      console.log("\x1b[33m%s\x1b[0m %s", header.padStart(10), message); // yellow
      break;
    case "blue":
      console.log("\x1b[34m%s\x1b[0m %s", header.padStart(10), message); // blue
      break;
    case "magenta":
      console.log("\x1b[35m%s\x1b[0m %s", header.padStart(10), message); // magenta
      break;
    case "cyan":
      console.log("\x1b[36m%s\x1b[0m %s", header.padStart(10), message); // cyan
      break;
    default: // cyan
      console.log("%s %s", header.padStart(10), message);
      break;
  }
};
