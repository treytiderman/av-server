// Testing helper functions
// Used test(functionToTest, expectedResult, param1, param2, param3...)
// And testMany(functionToTest, [ { result: resultOfFunction, params: [param1, param2, param3...] } ], yesLogFunction);
function logFunctionAsString(functionToLog) {
  const string = functionToLog.toString();
  // console.log('\x1b[33m%s\x1b[0m', string); // Make string Yellow
  console.log(string);
  return true;
}
function test(functionToTest, expectedResult, ...params) {
  // Are not enough parameters for the function?
  // if (functionToTest.length > params.length) {
  //   const string = `- FAILED more parameters needed | ${functionToTest.name}(${params}) EXPECTED at least ${functionToTest.length} parameter(s)`;
  //   console.log('\x1b[31m%s\x1b[0m', string); // Make string Red
  //   return false;
  // }
  // If there are, see if the functions result equals the expected result
  const result = functionToTest(...params);
  // Equal
  if (JSON.stringify(expectedResult) === JSON.stringify(result)) {
    const string = `- PASSED ${functionToTest.name}(${params}) = ${result}`;
    console.log('\x1b[32m%s\x1b[0m', string); // Make string Green
    // console.log(string);
    return true;
  }
  // NOT Equal
  else {
    const string = `- FAILED ${functionToTest.name}(${params}) = ${result} EXPECTED ${expectedResult}`;
    console.log('\x1b[31m%s\x1b[0m', string); // Make string Red
    return false;
  }
}
function testMany(functionToTest, testsArray, yesLogFunction = false) {
  console.log('\x1b[1m%s\x1b[0m', `\nTesting function: ${functionToTest.name}(params)...`); // Make string Purple
  if (yesLogFunction) logFunctionAsString(functionToTest)
  testsArray.forEach(testObj => test(functionToTest, testObj.result, ...testObj.params));
}

// Test Functions
function funcNoParams() {
  return true;
}
function funcOneParam(test) {
  return test;
}
function funcMultipleParams(test1, test2, test3 = 0) {
  return test1 + test2 + test3;
}
function funcOneOrMoreParams(test1, ...tests) {
  return test1;
}
function runTests() {
  console.log('\nRun a single test');
  test(funcNoParams, true);
  console.log('\nRun many tests');
  testMany(funcNoParams, [
    { result: true, params: []},
    { result: true, params: [true]},
    { result: true, params: [false]},
    { result: true, params: [false, true]},
  ], true);
  testMany(funcOneParam, [
    { result: 'test',   params: ['test']},
    { result: 1,        params: [1]},
    { result: true,     params: [true]},
    { result: true,     params: [true, true, true]},
    { result: [1,2,3],  params: [[1,2,3]]},
    { result: false,    params: []},
  ], true);
  testMany(funcMultipleParams, [
    { result: 2,          params: [false, true, true]},
    { result: 3,          params: [1, 2]},
    { result: 'jumping9', params: ['jum', 'ping', 9]},
    { result: false,      params: []},
    { result: false,      params: [false]},
  ], true);
  testMany(funcOneOrMoreParams, [
    { result: true,       params: [true]},
    { result: false,      params: [false, true, true]},
    { result: 'jum',      params: ['jum', 'ping', 9]},
    { result: [12,32],    params: [[12,32]]},
    { result: false,      params: []},
    { result: { got: 'milk?', no: 'i have salt'}, params: [{ got: 'milk?', no: 'i have salt'}]},
    { result: { got: 'milk?', no: [12, 32]},      params: [{ got: 'milk?', no: [12, 32]}]},
  ], true);
}

// Exports
exports.test = test;
exports.testMany = testMany;

exports.runTests = runTests;

// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"

// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"
