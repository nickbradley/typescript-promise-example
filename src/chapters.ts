import {Chapter} from "./chapter";

let bookChapters = [1, 2, 3, 4, 5];
// TODO: change <for of> to <for in> and see what happens
for (var idx of bookChapters) {
    let chapter = new Chapter(idx);

    let handleSuccess = (content: string) => {
        console.log(content)
    };

    let handleError = (err: any) => {
        console.log('Ops something went wrong!');
        console.log(err);
    };

    chapter.load().then(handleSuccess).catch(handleError);
}