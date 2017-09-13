function readFile(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fileBufferedReader(){
    let result = Math.floor(Math.random() * 5000) + 100;
    return result;
}

enum File {
    Ch1 = "This is chapter 1... lore ipsun",
    Ch2 = "This is chapter 2... hello world",
    Ch3 = "This is chapter 3... 42",
    Ch4 = "This is chapter 4... typescript is fun",
    Ch5 = "This is chapter 5... yet promises are tricky"
}

export default class Chapter {

    private chapterNumber: number;

    constructor(chapterNumber: number) {
        this.chapterNumber = chapterNumber;
    }

    public load(): Promise<string> {
        let path = this.filePath();
        console.log('Loading :: ' + path);
        return new Promise(function (fulfill, reject) {
            readFile(fileBufferedReader()).then(() => {
                console.log('>> LOADED :: ' + path);
                let content = File[path];
                if (content == null) reject('[ERROR] :: Could not read file!');
                fulfill(content);
            });
        });
    }

    public anotherLoad(): Promise<string> {
        let that = this;
        let path = this.filePath();
        console.log('Loading :: ' + path);
        return new Promise(function (fulfill, reject) {
            readFile(fileBufferedReader()).then(() => {
                console.log('>> LOADED :: ' + path);
                let content = File[path];
                if (content == null) reject('[ERROR] :: Could not read file!');
                fulfill({'idx': that.chapterNumber, 'content': content});
            });
        });
    }

    public filePath(): string {
        let path = "Ch" + String(this.chapterNumber);
        return path;
    }
}