import Chapter from "./chapter";

let bookChapters = [1, 2, 3, 4, 5];
let processList = [];
let book = {};
// TODO: change <for of> to <for in> and see what happens
for (var idx of bookChapters) {
    let chapter = new Chapter(idx);

    let handleSuccess = (data) => {
        book[data['idx']] = data['content'];
    };

    let handleError = (err) => {
        console.log('Ops something went wrong!');
        console.log(err);
    };

    let toProcess = chapter.anotherLoad().then(handleSuccess).catch(handleError);
    processList.push(processList, toProcess);
}

Promise.all(processList).then(() => {
    let chapters = Object.keys(book).sort();
    for (chapter of bookChapters) {
        console.log(book[chapter]);
    }
}).catch((err: any) => {
    console.log(err);
});
