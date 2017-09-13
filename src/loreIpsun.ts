import Chapter from "./chapter";

// This is a main method just for testing
(function (){

    let bookChapters = [1, 2, 9];
    // TODO: change <for of> to <for in> and see what happens
    for (var idx of bookChapters) {
        console.log(idx);
        let chapter = new Chapter(idx);
        var content = chapter.read();

        console.log(content);
    }
})();