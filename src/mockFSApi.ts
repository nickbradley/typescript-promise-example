const Files: {[name: string]: string} = {
  "Ch1": "This is chapter 1... lore ipsun",
  "Ch2": "This is chapter 2... hello world",
  "Ch3": "This is chapter 3... 42",
  "Ch4": "This is chapter 4... typescript is fun",
  "Ch5": "This is chapter 5... yet promises are tricky"
}

/** Class repesenting a mocked FileSystem API */
export class FileSystemMock {

  /**
   * Mocks reading the content of the specified file.
   *
   * @returns A promise that resolves to the file contents.
   * @throws File Not Found
   */
  public static async readFile(path: string): Promise<string> {
    let delay: number = Math.floor(Math.random() * 5000) + 100;

    // Wait some random amount of time to simulate reading a file from disk
    // Think of this line as a sleep()
    await new Promise<void>(resolve => setTimeout(resolve, delay));

    // Get the file content
    // In our mock, just take the value from the object above
    let content: string = Files[path];

    // Check that we actually got some content
    // In TS/JS, all variables have a truthy value (https://developer.mozilla.org/en-US/docs/Glossary/Truthy).
    // In this case, we're checking that content is a non-empty string.
    if (!content)
      // Here I'm using a template literal (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
      throw `File Not Found`;

    return content;
  }
}
