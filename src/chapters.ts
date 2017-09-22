import {Chapter} from "./chapter";

(async () => {
  let chapterNames: string[] = ["Ch1", "Ch2", "Ch3", "Ch4", "Ch5"];
  chapterNames.forEach(async (name) => {
    let chapter: Chapter = new Chapter(name);


    try {
      let content: string = await chapter.loadContent();
      console.log(content);
    } catch (err) {
      console.log(`[ERROR] :: ${err}`);
    }
  });

  // NOTE: You can also do the below
  // // TODO: change <for of> to <for in> and see what happens
  // for (let idx of bookChapters) {
  //
  //   // by default await will force the async operations to resolve in order
  //   // need to wrap in another function
  //   (async () => {
  //     let chapter: Chapter = new Chapter(`Ch${idx}`);
  //
  //     try {
  //       let content: string = await chapter.loadContent();
  //       console.log(content);
  //     } catch (err) {
  //       console.log(`[ERROR] :: ${err}`);
  //     }
  //   })();
  //
  // }
})();