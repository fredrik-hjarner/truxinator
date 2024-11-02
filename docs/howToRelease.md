Before I make a release I should have:
1. Make sure the e2e test works in node.
2. Also run the those tests in the browser too.
3. Make sure to record NEW inputs and e2e recorded data to make sure that tests can be updated.
4. Play through one game from start to end.
5. Test in Firefox, Chrome, Edge and maybe Safari.

How to release:
1. Create a new branch named X.Y.Z.
2. Create a new branch named X.Y.Z-release.
3. Run `npm run build:release`.
4. Move the contents of the schumpinator folder to the root and delete all other files. Push.
5. In settings of the schmupinator github page, set the gh-pages branch to be the one we just pushed.