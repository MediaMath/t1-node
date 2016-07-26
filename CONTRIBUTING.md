# Contributing
t1-node is looking forward to receiving your feedback and pull requests!

#### Building and testing
1. Fork [t1-node](https://github.com/MediaMath/t1-node). 
1. Clone your fork (we'll refer to your fork as `origin` hereafter). 
1. Run and test using *mocha test*:

```bash
$ git clone git@github.com:[my-user-name]/t1-node.git
$ cd t1-node/
$ mocha test
  ```

## Found an Issue?
If you find a bug in the source code or a mistake in the documentation, help us by
submitting an [issue](https://github.com/MediaMath/t1-node/issues).

If you have a solution, you can submit a [Pull Request](#submitting-a-pull-request) with the fix, but please log the issue anyway for tracking purposes.

## Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/MediaMath/t1-node/pulls) for an open or closed Pull Request that relates to your submission.
* Make sure your fork is [synced](https://help.github.com/articles/syncing-a-fork/).
* Open an issue first to discuss any potential changes.
* Create a new branch from `develop`, the current development version.
* Branch name should be in the format:
```
<github_name>-<issue#>-<iteration> (ex: leetcoder-1853-2)
```
* Make your changes in a new git branch:
```bash
$ git checkout -b mygithub-1234-1
```
* Create your patch.
* Follow our [Coding Guidelines](#coding-guidelines).
* Commit your changes using a descriptive commit message
* Push your branch to GitHub:
```bash
$ git push origin mygithub-1234-1
```
* In GitHub, send a pull request to `t1-node:master`

## Code Review
If code review suggests changes...

* Make the required updates.
* [Rebase](https://help.github.com/articles/about-git-rebase/) your branch and force push to your GitHub repository (this will update your Pull Request):
```bash
$ git fetch upstream
$ git rebase -i upstream/develop
$ git push -f origin mygithub-1234-1
```
* Once your solution is approved, it will be merged by one of the t1-node repo owners

Thanks for your contribution!

#### After your pull request is merged
After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository.

## API Compatibility
We follow the major version of the release to signify API compatibility. The `develop` branch is the staging area
for the next API-compatible release. Any other changes that may break compatibility will need a pull request made
to a specific development branch for that future major version. These semantics will need to be discussed in the issue
before any pull request is made.

## Coding Guidelines
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested**
* All public API methods **must be documented** in at least the README.md
* Regarding code styling in general:
    * t1-node follows the AirBnB [javascript style guide](https://github.com/airbnb/javascript)
    * Functions and variables should be named in a meaningful way
    * Please refer to any of the t1-node components or shared files for reference
