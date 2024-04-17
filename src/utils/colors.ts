
export const colors = new (class {
    color = (code: number, ended = true, ...messages: any[]) =>
      `\x1b[${code}m${messages.join(" ")}${ended ? "\x1b[0m" : ""}`;
    black = this.color.bind(null, 30, true);
    red = this.color.bind(null, 31, true);
    green = this.color.bind(null, 32, true);
    gray = this.color.bind(null, 90, true);
    yellow = this.color.bind(this, 33, true);
    blue = this.color.bind(this, 34, true);
    magenta = this.color.bind(this, 35, true);
    cyan = this.color.bind(this, 36, true);
    white = this.color.bind(this, 37, true);
    bgBlack = this.color.bind(this, 40, true);
    bgRed = this.color.bind(this, 41, true);
    bgGreen = this.color.bind(this, 42, true);
    bgYellow = this.color.bind(this, 43, true);
    bgBlue = this.color.bind(this, 44, true);
    bgMagenta = this.color.bind(this, 45, true);
    bgCyan = this.color.bind(this, 46, true);
    bgWhite = this.color.bind(this, 47, true);
  })();
  