import {FileSystemMock as fs} from "./mockFSApi";

// Let's define what properties a chapter should have using an interface
export interface IChapter {
  name: string;
  content: string;
}


/** Class representing a book chapter. */
export default class Chapter {
  private name: string;

  /**
   * Create a chapter.
   *
   * @param name The name of the chapter.
   */
  constructor(name: string) {
    this.name = name
  }

  /**
   * Asynchronously load the content for this chapter (from disk) and return it
   * as a string.
   *
   * @returns A promise that resolves to a string.
   * @throws File Not Found
   */
  public async loadContent(): Promise<string> {
    let content: string;

    console.log(`Loading :: ${this.name}`);
    content = await fs.readFile(this.name);
    console.log(`>> LOADED :: ${this.name}`);

    return content;
  }

  /**
   * Asynchronously load the content for this chapter and return an object with
   * the chapter name and content.
   *
   * @returns A promise that resolves to a book chapter.
   * @throws File Not Found
   */
  public async load(): Promise<IChapter> {
    let chapter: IChapter = {
      "name": this.name,
      "content": await this.loadContent()
    }

    return chapter;
  }
}