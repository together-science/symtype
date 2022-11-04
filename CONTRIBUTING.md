# Contributing to SymType

There are many ways you can get involved with SymType. Contributing to an open
source project is fun and rewarding. See guidelines for specific techniques at 
the end of this document

## Contributing Issues

If you're running into some problems using together.science/symtype or something doesn't behave
the way you think it should, please file an issue in GitHub.

Before filing something, [have a look](https://github.com/together-science/symtype/issues)
at the existing issues. It's better to avoid filing duplicates. You can add a
comment to an existing issue if you'd like.

To speed up the resolution of an issue, including a pointer to an executable
test case that demonstrates the issue, if applicable.

### Can I help fix a bug?

Sure! Have a look at the issue report, and make sure no one is already working
on it. If the issue is assigned to someone, they're on it! Otherwise, add a
comment in the issue indicating you'd like to work on resolving the issue and go
for it!

## Contributing Test Cases

The `/core/testing.ts` file contains test cases that are used to make sure that bugs are
not introduced as new features are added (regression).

Adding or updating test cases can be very helpful to improve SymType's quality.
Submit an issue indicating what you'd like to work on, and a pull request when
you have it ready. Test cases should follow the TAP (Test Anything Protocol)
format.

## Contributing Ideas and Feature Requests

Use the [issue tracker](https://github.com/together-science/symtype/issues) to submit
requests for new features. First, have a look at what might already be there,
and if you don't see anything that matches, write up a new issue.

If you do see something similar to your idea, comment on it or add a 👍.

## Contributing Code

Whether you have a fix for an issue, some improved test cases, or a brand new
feature, we welcome contributions in the form of pull requests. Once submitted,
your pull request will be reviewed and you will receive some feedback to make
sure that your pull request fits in with

-   the roadmap for together.science and SymType
-   the architecture of the project
-   the coding guidelines of the project

Once your pull request has been accepted, it will be merged into the master
branch.

Congratulations, you've become a SymType and together.science contributor! Thanks for your help!

# Porting guidelines (William's notes from August 2022)

## Style and comments

Generally, it’s good to copy all comments in Sympy into the ported document just as they’re written – they come with helpful examples. Be sure to put them in the same location as they are in the Sympy document. Other than this, we want to document all decisions made in a header comment. Be sure to also include who made those decisions. Inline comments should be added for new code written in utility.ts.

## Utility classes and functions

/core/utility.ts is the hub for utility functions and classes. Currently, for most instances in which you would want a dictionary or a set, you should use the HashDict or HashSet classes in utility.ts. In addition, there is a small library of static methods and utility functions in the Util class, which can be expanded as necessary. 

## Metaclasses and properties

Sympy relies heavily on the ManagedProperties class to register default properties of each class. Currently, after defining a class, call ManagedProperties.register(*cls*). This will apply some default properties. These properties should be accessed as obj.constructor.is_property. Properties that are specific to objects are defined by their _eval_is_property() methods, which are recognized by the Basic constructor and turned into properties. To add a property, create an _eval_is_property() method, and the rest should be done for you (if not, play around with the property assignment in Basic). These properties should be accessed as obj.is_property(). 

All code related to properties is found in the assumptions.ts file, and this aspect of the project might need some future work as it would be nice to standardize how properties are accessed (i.e., obj.is_property for all properties instead of different ways of accessing properties).

## Multiple inheritance

Sympy relies on a few occurrences of multiple inheritance. We create a system based off of the system defined in the following article:
https://rasaturyan.medium.com/multiple-inheritance-in-javascript-es6-4999e4b6584c
The only difference is that we sometimes need multiple generations of multiple inheritance, so we use:

const myclass = (superclass: any) => extends mix(superclass).with(*supers*)

Note that the arguments of with() are not classes but lambdas (like the const myclass in the above snippet), whereas the arguments of mix() are actual classes.

For classes which are not extended but extend multiple classes, there is no need to use the lambda format. Here, we use base as the argument for mix(), which is just an empty class.

myclass extends mix(base).with(*supers*)

![classes](https://user-images.githubusercontent.com/86687645/200050339-3e2129b2-daff-483b-b6f8-9d97ecba80b8.png)

## Imports

Sympy has a habit of using cyclical imports, which they deal with by delaying the imports. As a solution, there is a global.ts file where you can register methods and constructors. This is mostly clearly implemented in the __add__(), __sub__(), __mul__(), and __truediv__() methods of the Expr class, so these those an example (also reference the add and mul classes where the constructors are registered). 

## Add, Mul, and Pow

Add and Mul have been reworked such that the first two arguments are Booleans determining whether to evaluate and whether to simplify the arguments. For Pow, these arguments are optional arguments which should be given after the base and exponent. The ordered components of these classes is not yet implemented.

## Next steps

As mentioned previously, some further thought should be given to assigning properties to objects and classes, and how to make that more consistent/efficient. Functionalities/utilities (including derivatives, matrix stuff, equation solving, etc.) can start being built out using Add, Mul, Pow, integer/rational factoring, and symbol for number substitution, which are all implemented. Eventually, we should also go through all of the comments (those copied from Sympy) and modify the descriptions and examples so that everything is consistent.





