# typescript-file-merger
This is a boilerplate project explaining some basic javascript/typescript stuff

# Setup

Make sure that you have:

* node
* yarn
* mocha

# Promises

For this tutorial, I grabbed [this](https://www.polygon.com/2017/9/12/16288926/metroid-samus-returns-review) Metroid Samus Return review 
and I'l refer to it as a book and one of a couple of sentences make a chapter.

## Crazy output

First lets try to load the content of some book chapters. 

Our first script is `yarn loreipsun`. Its code is straight forward. It look like this:

```typescript
import Chapter from "./chapter";

// This is a main method just for testing
(function (){

    let bookChapters = [1, 2, 9];
    for (var idx of bookChapters) {
        console.log(idx);
        let chapter = new Chapter(idx);
        var content = chapter.read();

        console.log(content);
    }
})();
```

If I run this script. I should get at least part of the chapters in the book printed in as my output right?

Well. The real output look like this: 
 
```
1
Loading :: ./typescript-file-merger/src/../book/chapters/1.txt
Promise { <pending> }
2
Loading :: ./typescript-file-merger/src/../book/chapters/2.txt
Promise { <pending> }
9
Loading :: ./typescript-file-merger/src/../book/chapters/9.txt
Promise { <pending> }
>> LOADED :: ./typescript-file-merger/src/../book/chapters/2.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/1.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/9.txt
```

Yeckes! What went wrong? I print the chapter indexes in the right order and I also say that I' loading them in the right order.
But the output says that chapter 2 was loaded before chapter 1 or 9. That's not the order that I said! Every time that I run this code, I might get a crazy new order. Try it!
Even worse: I was expecting to get some content as an output. I mean. Real text!!! Instead I got this weirdo Promise pending stuff.

Let's take a look into `chapter.ts` to see what it does.

```typescript
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

    public getFileName(): string {
        let chapterFolder = __dirname + "/../book/chapters/";
        const extension = ".txt";
        return chapterFolder + String(this.chapterNumber) + extension;
    }
}
```  

Hum. So every time that I create a new chapter, I have to pass an integer variable to it as declared in its constructor.

And the `filename` variable is being used in my `read()` function to state that I' loading the chapter as well as to state that the chapter was loaded.
But instead of returning a `string` it is returning me this weirdo `Promise<string>`. That might explains the output: `Promise { <pending> }`

So what is happening here?

This happens because we are using a file system library `fs` and reading a file is not an immediate process. It takes some time and depending on the content, length, and a bunch of other uncontrollable factors, loading a file may take milliseconds to minutes!

So, that's why we wrap around a **Promise**. When we call the `read()` function, we create a contract saying: *Hey I promise you that I will read the expected file* and, once the promise is **fulfill**ed, we return its content as a string.
What if something wrong happens? In that case, we *reject* the promise and whoever calls the read method will have to handle the success or error associated with the promise.

## Accessing the content of a promise.

Ok, so how do I access the content of a promise? take a look at `chapters.ts`. In order to properly access the content of a promise, you need to call it and use its builtin methods `then(...)` and `catch(...)` just like this:

```typescript
import Chapter from "./chapter";

(function (){

    let bookChapters = [1, 2, 9];
    for (var idx of bookChapters) {
        console.log(idx);
        let chapter = new Chapter(idx);

        let handleSuccess = (content) => {
            console.log(content)
        };

        let handleError = (err) => {
            console.log('Ops something went wrong!');
            console.log(err);
        };

        chapter.read().then(handleSuccess).catch(handleError);
    }
})();
```



> As a side note, `handleSuccess` and `handleError` are just variables that happen to be functions. This is an elegant way to make your code more clear but it messes up how we humans read the code execution. 
> The `console.log` inside these function will only be executed *after* the promise was resolved or rejected.

If this syntax is a little bit confusing, the same script could be written like this: 


```typescript
import Chapter from "./chapter";

(function (){

    let bookChapters = [1, 2, 9];
    for (var idx of bookChapters) {
        console.log(idx);
        let chapter = new Chapter(idx);

        chapter.read().then((content) => {
            console.log(content);
        }).catch((err) => {
            console.log('Ops something went wrong!');
            console.log(err);
        });
    }
})();
```

> Feel free to use the syntax that you prefer. The end result is the same. 


Try the script is `yarn chapters` and see what happens: 

```
1
Loading :: ./typescript-file-merger/src/../book/chapters/1.txt
2
Loading :: ./typescript-file-merger/src/../book/chapters/2.txt
9
Loading :: ./typescript-file-merger/src/../book/chapters/9.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/9.txt
WRAP UP
SAMUS RETURNS IS FAR MORE THAN A REMAKE

To call Metroid: Samus Returns a remake feels unfair. Remakes are old games with new coats of paint: an upgrade in resolution here, reworked artwork there. Samus Returns is far more than that. It’s a top-to-bottom reimagining, bringing the bones of a game that’s over 25 years old into the modern era with fantastic results.
>> LOADED :: ./typescript-file-merger/src/../book/chapters/1.txt
Metroid: Samus Returns review

An essential addition to the Metroid catalog
by Russ Frushtick@RussFrushtick  Sep 12, 2017, 8:00am EDT

Metroid: Samus Returns is the remake no one was asking for.

Sandwiched between the birth of the franchise and the beloved Super Metroid, Metroid 2: The Return of Samus was the first portable entry in the series. And it was a very solid, if safe, follow-up to the original game. Which is why no one was really demanding that it be remade.
>> LOADED :: ./typescript-file-merger/src/../book/chapters/2.txt
But thank god it was. Metroid: Samus Returns reforges the broad concept of the Game Boy original while adding modern gameplay mechanics and the best graphics yet seen on the 3DS, making it an essential part of the Metroid catalog.

Done in 0.53s.
```

Ok! We got one problem: accessing the content of the chapters. However, the order is still wrong. 
That happens because **promises are asynchronous** and thus, we need a way to coordinate how the chapters are glued together.

## Coordinating a bunch of promises

Ok. Now it is time to assemble our review. Please, take a look into `book.ts` to see what it does.
I omitted some of the content in the file, but you should be able to follow. Additionally, I'm using `chapter.load` instead of `read` the reason is because load returns a map with chapter number and content. This was necessary in order to properly sort the book.

```typescript
import Chapter from "./chapter";

(function (){
    
    let bookChapters = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let processList = [];
    let book = {};
    // TODO: change <for of> to <for in> and see what happens
    for (var idx of bookChapters) {
        console.log(idx);
        let chapter = new Chapter(idx);
        let handleSuccess = ...
        let handleError = ...

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
```   

The important part is related to `processList` and `Promise.all`.
In the first for loop, we iterate the `bookChapters` array, firing a bunch of `load` methods on the way.
However, `load` returns a promise (which is yet to be processed) and we add this promise to the `processList`.
The `Promise.all` receives this array and you can read it basicly like this: once all the promises in the passed array are finished then, I can run the code inside this function.
If *any* of the promises in the array is rejected then I simple jump directly to the catch block. 

With that, we get our awesome review saying how Metroid is such a great game.
Run `yarn book`:

```
1
Loading :: ./typescript-file-merger/src/../book/chapters/1.txt
2
Loading :: ./typescript-file-merger/src/../book/chapters/2.txt
3
Loading :: ./typescript-file-merger/src/../book/chapters/3.txt
4
Loading :: ./typescript-file-merger/src/../book/chapters/4.txt
5
Loading :: ./typescript-file-merger/src/../book/chapters/5.txt
6
Loading :: ./typescript-file-merger/src/../book/chapters/6.txt
7
Loading :: ./typescript-file-merger/src/../book/chapters/7.txt
8
Loading :: ./typescript-file-merger/src/../book/chapters/8.txt
9
Loading :: ./typescript-file-merger/src/../book/chapters/9.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/1.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/3.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/4.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/2.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/5.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/6.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/7.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/8.txt
>> LOADED :: ./typescript-file-merger/src/../book/chapters/9.txt


Metroid: Samus Returns review

An essential addition to the Metroid catalog
by Russ Frushtick@RussFrushtick  Sep 12, 2017, 8:00am EDT

               .............

WRAP UP
SAMUS RETURNS IS FAR MORE THAN A REMAKE

To call Metroid: Samus Returns a remake feels unfair. Remakes are old games with new coats of paint: an upgrade in resolution here, reworked artwork there. Samus Returns is far more than that. It’s a top-to-bottom reimagining, bringing the bones of a game that’s over 25 years old into the modern era with fantastic results.

Done in 0.56s.

``` 

Notice how the loaded order was still asynchronous. However, this time our **Promise.all** was clever enough to wait all promises to be finished before printing their content.
Notice that sorting the chapters in the proper is still our responsibility and we had to use some mechanism to do that. 

I' sure there might be other ways to achieve the same result. 


I hope you liked this tutorial. That's all folks ¯\\\_(ツ)_/¯   

# TODO

* Explain more about yarn
* Explain more about node
* Explain more about mocha

# References

* This tutorial is basically a code that wraps a more in-depth explanation about [Asynchrony Reading](https://github.com/ubccpsc/310/blob/2017jan/readings/Async.md) by Dr. Reid Holmes