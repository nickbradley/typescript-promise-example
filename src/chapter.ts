function readFile(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fileBufferedReader() {
    let result = Math.floor(Math.random() * 5000) + 100;
    return result;
}

function File(chapter: number) {
    switch (chapter) {
        case 1:
            return "This is chapter 1... lore ipsun";
        case 2:
            return "This is chapter 2... hello world";
        case 3:
            return "This is chapter 3... 42";
        case 4:
            return "This is chapter 4... typescript is fun";
        case 5:
            return "This is chapter 5... yet promises are tricky";
        default:
            throw new Error('Chapter not found');
    }
}


export class Chapter {

    private chapterNumber: number;

    constructor(chapterNumber: number) {
        this.chapterNumber = chapterNumber;
    }

    public load(): Promise<string> {
        let path: number = this.chapterNumber;
        console.log('Loading :: Ch' + path);
        return new Promise(function (fulfill, reject) {
            readFile(fileBufferedReader()).then(() => {
                console.log('>> LOADED :: Ch' + path);
                let content = File(path);
                if (content == null) reject('[ERROR] :: Could not read file!');
                fulfill(content);
            });
        });
    }

    public anotherLoad(): Promise<string> {
        let path: number = this.chapterNumber;
        console.log('Loading :: Ch' + path);
        return new Promise(function (fulfill, reject) {
            readFile(fileBufferedReader()).then(() => {
                console.log('>> LOADED :: Ch' + path);
                let content: string = File(path);
                if (content == null) reject('[ERROR] :: Could not read file!');

                let result: any = {'idx': path, 'content': content};
                fulfill(result);
            });
        });
    }
}