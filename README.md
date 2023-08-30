# SymType

SymType is a port of SymPy essentials to TypeScript.
The goal of this project is to provide better essential symbolic math functionality to
the together.math web application, but many JavaScript programmers have wished for a SymPy port.
We do not intend to replicate the syntax of SymPy in any form, and neither do we intend to
replicate all of its functionality, although all reasonable additions will be considered.

Initial work was done by William Bowers during his summer internship at together.science.
You can see the current state of capabilities in the [test cases](https://github.com/together-science/symtype/blob/main/ts-port/core/testing.ts).
William's notes about meta classes, mulitple inheritance and other topics are at the end of 
the [contributing guidelines](https://github.com/together-science/symtype/blob/main/CONTRIBUTING.md)

Contributions are welcome by PR. 

If you are looking for a fully functional, in-browser or node.js symbolic algebra system you can use TODAY, consider
[Nerdamer prime](https://github.com/together-science/nerdamer-prime), also maintained by us.

## Contact Us

- [Contact us](mailto:symtypeinfo@together.science) if you have questions
- Test out our product [together.math](https://www.together.science/) or learn more about it.

## License

This project is licensed under the [MIT License](https://github.com/together-science/symtype/blob/main/LICENSE).

## Where things stand

Here is William's statement from the end of his internship this summer ('23):

Changes this summer: 
- properties system is working
- relational system is implemented
- operations are a bit more flushed out
  
Big next steps: 
- linear solve: I already have a branch for linear solve, and I can finish up the branch during my next school break or someone else can take that over
- polynomial: This will be a big effort but its crucial for more advanced solve capabilities

In my opinion, simplify can come a bit later (after we have these things) since its really complicated and nothing we’re solving at the moment is complicated enough to be simplified

