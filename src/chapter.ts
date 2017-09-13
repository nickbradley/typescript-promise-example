var fs = require('fs');

export default class Chapter {

    private chapterNumber: number;

    constructor(chapterNumber: number) {
        this.chapterNumber = chapterNumber;
    }

    public read(): Promise<string> {
        let filename = this.getFileName();
        console.log('Loading :: ' + filename);
        return new Promise(function (fulfill, reject) {
            fs.readFile(filename, 'utf8', (err: any, txt: any) => {
                if (err) reject(err);
                console.log('>> LOADED :: ' + filename);
                fulfill(txt);
            });
        });
    }

    public load(): Promise<string> {
        let filename = this.getFileName();
        let that = this;
        console.log('Loading :: ' + filename);
        return new Promise(function (fulfill, reject) {
            fs.readFile(filename, 'utf8', (err: any, txt: any) => {
                if (err) reject(err);
                console.log('>> LOADED :: ' + filename);
                fulfill({'idx': that.chapterNumber, 'content': txt});
            });
        });
    }

    public getFileName(): string {
        let chapterFolder = __dirname + "/../book/chapters/";
        const extension = ".txt";
        return chapterFolder + String(this.chapterNumber) + extension;
    }
}