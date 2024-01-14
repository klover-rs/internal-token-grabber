# internal-token-grabber
This project is only for educational purposes to demonstrate how the injection of JavaScript into an Electron based application like discord works. I AM NOT RESPONSIBLE FOR ANY KIND OF DAMAGED CAUSED TO INDIVIDUALS.

## How does it work?
it works by injecting code into the discord client and appending an javascript file to the electron main process, this javascript file acts then as an renderer, you have full access to DOM etc. 

## How to use it
follow this [tutorial](https://gist.github.com/vanyle/edbdd0c28a0150af3b905b99a4c48f00) and use the inject.js file from this repo

## Another way of how to use it (i am expecting that you are familiar with the first method)
1. unpack the core.asar file
2. download the mainScreen.js and inject.js file from this repo
3. drag both files into the app folder of the extracted archieve
4. repack the archieve and done!
