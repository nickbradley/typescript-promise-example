import Chapter from "./chapter";
import {IChapter} from "./chapter";

// Let's create our own book type that represents an object with string keys
// (chapterNames) and string values.
// Defining your own type can also be useful if you want to give base types a
// name to make them more explicit. For example, if we wanted to have a more
// explicit type fo book we could have done:
//
//   type content = string;  // the content of chapters are strings
//   type book =  {[chapterName: string]: content};
//
// If we needed properties, we would have used an interface.
// If we needed methods, we would have used a class.
type book = {[chapterName: string]: string};

(async () => {
  let bookChapters = [1, 2, 3, 4, 5];
  let processList: Promise<IChapter>[] = bookChapters.map(async (chapterNumber) => {
    let chapter: Chapter = new Chapter(`Ch${chapterNumber}`);

    try {
      let chapterPromise: Promise<IChapter> = chapter.load();
      await chapterPromise;  // check for an error so we don't break Promise.all
      return chapterPromise;
    } catch (err) {
      console.log(`[ERROR] :: Could not load chapter ${chapterNumber}`);
    }
  });

  try {
    let chapters: IChapter[] = await Promise.all(processList);
    let book: book = chapters.reduce((partialBook: book, chpt: IChapter) =>
      (partialBook[chpt.name] = chpt.content, partialBook), {});

    for (const name of Object.keys(book).sort())
      console.log(book[name]);
  } catch (err) {
    console.log(`[ERROR] :: ${err}`)
  }
})();
