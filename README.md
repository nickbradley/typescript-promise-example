# typescript-file-merger
This is a boilerplate project explaining some basic javascript/typescript stuff

# Setup

Make sure that you have:

* node
* yarn
* mocha

# Promises

For this tutorial, we want to load the content of some book.  This is the complete book:

```
This is chapter 1... lore ipsun
This is chapter 2... hello world
This is chapter 3... 42
This is chapter 4... typescript is fun
This is chapter 5... yet promises are tricky
```

It is one of NYT best sellers!

## Crazy output

First lets try to load the content of some book chapters. 

Our first script is `yarn loreipsun`. Its code is straight forward. It look like this:

```typescript
import Chapter from "./chapter";

let bookChapters = [1, 2, 3, 4, 5];
for (var idx of bookChapters) {
    let chapter = new Chapter(idx);
    var content = chapter.load();

    console.log(content);
}

```

If I run this script. I should get at least part of the chapters in the book printed in as my output right?

Well. The real output look like this: 
 
```
Loading :: Ch1
Promise { <pending> }
Loading :: Ch2
Promise { <pending> }
Loading :: Ch3
Promise { <pending> }
Loading :: Ch4
Promise { <pending> }
Loading :: Ch5
Promise { <pending> }
>> LOADED :: Ch4
>> LOADED :: Ch5
>> LOADED :: Ch1
>> LOADED :: Ch3
>> LOADED :: Ch2
```

Yeckes! What went wrong? I print the chapter indexes in the right order and I also say that I' loading them in the right order.
But the output says that chapter 4 was loaded before chapter 1, 2 and 3. That's not the order that I said! Every time that I run this code, I might get a crazy new order. Try it!
Even worse: I was expecting to get some content as an output. I mean. Real text!!! Instead I got this weirdo Promise pending stuff.

Let's take a look into `chapter.ts` to see what it does.

```typescript
export class Chapter {

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
}
```  

Hum. So every time that I create a new chapter, I have to pass an integer variable to it as declared in its constructor.
And the `path` variable is being used in my `load()` function to state that I' loading the chapter as well as to state that the chapter was loaded.
But instead of returning a `string` it is returning me this weirdo `Promise<string>`. 

That might explains the output: `Promise { <pending> }`

So what is happening here?

This happens because we are using a *fake* file system library and reading a file is not an immediate process. It takes some time and depending on the content, length, and a bunch of other uncontrollable factors, loading a file may take milliseconds to minutes!

So, that's why we wrap around a **Promise**. When we call the `load()` function, we create a contract saying: *Hey I promise you that I will read the expected file* and, once the promise is **fulfill**ed, we return its content as a string.
What if something wrong happens? In that case, we *reject* the promise and whoever calls the load method will have to handle the success or error associated with the promise.

## Accessing the content of a promise.

Ok, so how do I access the content of a promise? take a look at `chapters.ts`. In order to properly access the content of a promise, you need to call it and use its builtin methods `then(...)` and `catch(...)` just like this:

```typescript
import Chapter from "./chapter";

let bookChapters = [1, 2, 3, 4, 5];
for (var idx of bookChapters) {
    let chapter = new Chapter(idx);

    let handleSuccess = (content) => {
        console.log(content)
    };

    let handleError = (err) => {
        console.log('Ops something went wrong!');
        console.log(err);
    };

    chapter.load().then(handleSuccess).catch(handleError);
}
```



> As a side note, `handleSuccess` and `handleError` are just variables that happen to be functions. This is an elegant way to make your code more clear but it messes up how we humans read the code execution. 
> The `console.log` inside these function will only be executed *after* the promise was resolved or rejected.

If this syntax is a little bit confusing, the same script could be written like this: 


```typescript
import Chapter from "./chapter";

let bookChapters = [1, 2, 3, 4, 5];
for (var idx of bookChapters) {
    let chapter = new Chapter(idx);

    chapter.load().then((content) => {
        console.log(content);
    }).catch((err) => {
        console.log('Ops something went wrong!');
        console.log(err);
    });
}
```

> Feel free to use the syntax that you prefer. The end result is the same. 


Try the script is `yarn chapters` and see what happens: 

```
Loading :: Ch1
Loading :: Ch2
Loading :: Ch3
Loading :: Ch4
Loading :: Ch5
>> LOADED :: Ch1
This is chapter 1... lore ipsun
>> LOADED :: Ch4
This is chapter 4... typescript is fun
>> LOADED :: Ch3
This is chapter 3... 42
>> LOADED :: Ch5
This is chapter 5... yet promises are tricky
>> LOADED :: Ch2
This is chapter 2... hello world
Done in 4.83s.
```

Ok! We got one problem: accessing the content of the chapters. However, the order is still wrong. 
That happens because **promises are asynchronous** and thus, we need a way to coordinate how the chapters are glued together.

## Coordinating a bunch of promises

Ok. Now it is time to assemble our review. Please, take a look into `book.ts` to see what it does.
I omitted some of the content in the file, but you should be able to follow. Additionally, I'm using `chapter.loadAnother` instead of `load` the reason is because loadAnother returns a `map` with chapter number and content. This was necessary in order to properly sort the book.

```typescript
import Chapter from "./chapter";

let bookChapters = [1, 2, 3, 4, 5];
let processList = [];
let book = {};
// TODO: change <for of> to <for in> and see what happens
for (var idx of bookChapters) {
    let chapter = new Chapter(idx);

    let handleSuccess = ...
    let handleError = ...

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

```   

The important part is related to `processList` and `Promise.all`.
In the first for loop, we iterate the `bookChapters` array, firing a bunch of `load` methods on the way.
However, `load` returns a promise (which is yet to be processed) and we add this promise to the `processList`.
The `Promise.all` receives this array and you can read it basically like this: once all the promises in the passed array are finished then, I can run the code inside this function.
If *any* of the promises in the array is rejected then I simple jump directly to the catch block. 

With that, we get our awesome review saying how Metroid is such a great game.
Run `yarn book`:

```
Loading :: Ch1
Loading :: Ch2
Loading :: Ch3
Loading :: Ch4
Loading :: Ch5
>> LOADED :: Ch2
>> LOADED :: Ch5
>> LOADED :: Ch1
>> LOADED :: Ch3
>> LOADED :: Ch4
This is chapter 1... lore ipsun
This is chapter 2... hello world
This is chapter 3... 42
This is chapter 4... typescript is fun
This is chapter 5... yet promises are tricky
Done in 5.18s.

``` 

Notice how the loaded order was still asynchronous. However, this time our **Promise.all** was clever enough to wait all promises to be running its code.
Notice that *sorting the chapters in the proper order is still our responsibility* and we had to use some mechanism to do that. 

I'm sure there might be other ways to achieve the same result. 


I hope you liked this tutorial. That's all folks ¯\\\_(ツ)_/¯   

# TODO

* Explain more about yarn
* Explain more about node
* Explain more about mocha

# References

* This tutorial is heavily inspired by this [Asynchrony Reading](https://github.com/ubccpsc/310/blob/2017jan/readings/Async.md) by Dr. Reid Holmes