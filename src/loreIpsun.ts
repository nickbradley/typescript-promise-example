import Chapter from "./chapter";

let bookChapters = [1, 2, 3, 4, 5];
// TODO: change <for of> to <for in> and see what happens
for (var idx of bookChapters) {
    let chapter = new Chapter(idx);
    var content = chapter.load();

    console.log(content);
}