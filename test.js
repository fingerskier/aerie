const {get, put, update} = require('./')('./data')


async function testPropChange(query, prop, newPropVal) {
  await update`${query}.${prop}=${newPropVal}`

  const postTestArrayProp = await get`${query}`
  console.log('test prop set', query, prop, postTestArrayProp)
}

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
  await testPropChange('fl*/*ey', 1, 'flarn')
  await testPropChange('sc*/*ib/*', 'active', 1)
  await testPropChange('sc*/*ib/*', 'name', (val,path)=>path)

  await update`zap/zip.name=bobby`
  await update`zap/zing/blah.name=huube` 

  const newMember = {
    name: 'Chung Smith',
    id: '42',
    weight: 246,
  }
  await put`member/42=${newMember}`

  const boringMember = "Chuck"
  await put`member/77=${boringMember}`

  // non-existent property
  await update`member/77.name=Chuck`
}


main().then(console.log).catch(console.error)