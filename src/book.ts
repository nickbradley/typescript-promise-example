import {Chapter} from "./chapter";

let bookChapters: number[] = [1, 2, 3, 4, 9];
let processList: Promise<any>[] = [];
let book: any[] = [];
for (var idx of bookChapters) {
    let chapter = new Chapter(idx);

    let handleSuccess = (data: any) => {
        book.push(data);
    };

    let toProcess = chapter.anotherLoad().then(handleSuccess);
    processList.push(toProcess);
}

Promise.all(processList).then(() => {
    book = book.sort(function (a: any, b: any) {
        return a.idx - b.idx
    });
    for (let chapter of book) {
        console.log(chapter.content);
    }
}).catch((err: any) => {
    console.log('Ops something went wrong!');
    console.log(err);
});