import Chapter from "./chapter";

(() => {
  let chapterNames = ["Ch1", "Ch2", "Ch3", "Ch4", "Ch5"];

  // TODO: change <for of> to <for in> and see what happens
  for (let name of chapterNames) {
    let chapter: Chapter = new Chapter(name);
    let content: Promise<string> = chapter.loadContent();

    console.log(content);
  }
})();
