const {get, set} = require('./')('./data')


async function main() {
  /**
   * Every JSON element is a file
   * Every JSON element is an array
   */
  
  // start with retrieving a file
  const testFixed = await get`flarn/gey`
  console.log('test fixed path', testFixed)

  const testGlob = await get`flarn/*ey`
  console.log('test glob path', testGlob)

  const testMap = testGlob.map(X=>X[1])
  console.log('test map of glob result', testMap)

  const testGlobTwo = await get`sch*/**`
  console.log('test glob 2', testGlobTwo)
  console.log('test glob 2 map of values', testGlobTwo.map(X=>X.value))

  const testGlobSubDir = await get`sch*/*ib/*e*`
  console.log('test glob sub-dir', testGlobSubDir)


  /**
    A set follows this pattern:
      some/file/path.propery=value
      If value is a function then that function gets called on the given property
   */
  // when the
  let testSetArrayProp = await set`fl*/*ey.1=2`
  let postTestArrayProp = await get`fl*/*ey`
  console.log('test set array prop', testSetArrayProp, postTestArrayProp)

  testSetArrayProp = await set`fl*/*ey.1=3`
  postTestArrayProp = await get`fl*/*ey`
  console.log('test set array prop', testSetArrayProp, postTestArrayProp)

  // set`sc*/*ib/*.active=1`
  // get`sc*/*ib/*`
}


main().then(console.log).catch(console.error)