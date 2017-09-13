import Chapter from "./chapter";

// This is a main method just for testing
(function (){

    let bookChapters = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let processList = [];
    let book = {};
    // TODO: change <for of> to <for in> and see what happens
    for (var idx of bookChapters) {
        console.log(idx);
        let chapter = new Chapter(idx);

        let handleSuccess = (data) => {
            book[data['idx']] = data['content'];
        };

        let handleError = (err) => {
            console.log('Ops something went wrong!');
            console.log(err);
        };

        let toProcess = chapter.load().then(handleSuccess).catch(handleError);
        processList.push(processList, toProcess);
    }

    Promise.all(processList).then(() => {
        let chapters = Object.keys(book).sort();
        for (chapter of bookChapters) {
            console.log(book[chapter]);
            console.log();
        }
    }).catch((err: any) => {

        console.log(err);
    })
})();