Typescript decarator based framework to keep the server-side source code simple. 

- Provides decorators to mark classes as express routes. @Controller decorator generates a singleton class instance. Methods within Controller class can be market with @Get, @Post, @WS...
- Forces filename route to path organisation for code organisation. All route end-points can be found in corresponding files. A function x decorated in file /user/profile is executed when browser opens your-site/user/profile.
- Either parses and inputs parameters and returns whatever function returns as a response to the browser, or passes Express Request, Response objects.
- Provides data-management decorators, automating instanciating of data. Useful to instanciate objects serialised to JSON or pull objects RPC endpoints or from IPFS
- Tiny api, allowing easy configuration and modifications.

To install:
> npm i kiss-framework

To get started via example:
> npm i kiss-example
> npm start

If all goes well, you should see the example application as follows:


<img width="952" alt="Screenshot 2024-03-24 at 17 44 43" src="https://github.com/owl-technologies/kiss-framework/assets/64410585/ed3b2a03-2094-4970-9221-036000b3437a">


CDN: "https://cdn.jsdelivr.net/npm/kiss-framework@latest/dist/index.js"